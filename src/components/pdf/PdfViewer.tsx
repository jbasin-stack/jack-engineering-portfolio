import { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useLenis } from 'lenis/react';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import { ZoomIn, ZoomOut, Download, X } from 'lucide-react';

// Worker must be configured in the same file that renders <Document>
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  file: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Zoom constraints
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;

export function PdfViewer({ file, title, open, onOpenChange }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isMobile = useIsMobile();
  const lenis = useLenis();

  // Lock Lenis scroll when viewer is open (same pattern as MobileMenu)
  useEffect(() => {
    if (open) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    };
  }, [open, lenis]);

  // Reset state when file changes or viewer opens
  useEffect(() => {
    if (open) {
      setScale(1.0);
      setLoading(true);
      setError(false);
    }
  }, [open, file]);

  const onLoadSuccess = useCallback(({ numPages: total }: { numPages: number }) => {
    setNumPages(total);
    setLoading(false);
    setError(false);
  }, []);

  const onLoadError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  // Zoom controls
  const zoomIn = () => setScale((s) => Math.min(ZOOM_MAX, s + ZOOM_STEP));
  const zoomOut = () => setScale((s) => Math.max(ZOOM_MIN, s - ZOOM_STEP));

  const zoomPercent = `${Math.round(scale * 100)}%`;

  // Shared button style for toolbar controls
  const btnClass =
    'rounded-lg p-2 hover:bg-muted text-muted-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed';

  // Toolbar rendered inside both Dialog and Drawer
  const toolbar = (
    <div className="flex items-center justify-between border-b border-border/30 px-4 py-2">
      {/* Page count */}
      <span className="text-sm text-muted-foreground">
        {numPages > 0 ? `${numPages} page${numPages !== 1 ? 's' : ''}` : 'Loading...'}
      </span>

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={zoomOut}
          disabled={scale <= ZOOM_MIN}
          className={btnClass}
          aria-label="Zoom out"
        >
          <ZoomOut size={18} />
        </button>
        <span className="min-w-[3rem] text-center text-sm text-muted-foreground">
          {zoomPercent}
        </span>
        <button
          onClick={zoomIn}
          disabled={scale >= ZOOM_MAX}
          className={btnClass}
          aria-label="Zoom in"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {/* Download and close */}
      <div className="flex items-center gap-1">
        <a
          href={file}
          download
          className={btnClass}
          aria-label="Download PDF"
        >
          <Download size={18} />
        </a>
        <button
          onClick={() => onOpenChange(false)}
          className={btnClass}
          aria-label="Close viewer"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );

  // PDF display area (shared between Dialog and Drawer)
  const pdfContent = (
    <div className="flex-1 overflow-auto">
      <div className="flex justify-center p-4">
        {loading && !error && (
          <p className="py-12 text-center text-muted-foreground">Loading...</p>
        )}
        {error && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-muted-foreground">Failed to load PDF</p>
            <a
              href={file}
              download
              className="text-accent font-medium hover:underline"
            >
              Download instead
            </a>
          </div>
        )}
        <Document
          file={file}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={null}
          error={null}
        >
          {!error && numPages > 0 && Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              scale={scale}
              className="mb-4 shadow-sm"
            />
          ))}
        </Document>
      </div>
    </div>
  );

  // Responsive: Dialog on desktop, Drawer on mobile
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[95vh] flex flex-col p-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          {toolbar}
          {pdfContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[90vw] h-[90vh] flex flex-col p-0 sm:max-w-[90vw]"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {toolbar}
        {pdfContent}
      </DialogContent>
    </Dialog>
  );
}

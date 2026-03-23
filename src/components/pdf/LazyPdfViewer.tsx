import { lazy, Suspense } from 'react';

// Lazy-load PdfViewer (and its heavy react-pdf dependency) only when needed
const PdfViewer = lazy(() =>
  import('./PdfViewer').then((m) => ({ default: m.PdfViewer }))
);

interface LazyPdfViewerProps {
  file: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LazyPdfViewer(props: LazyPdfViewerProps) {
  // Only render (and thus trigger the chunk load) when open
  if (!props.open) return null;
  return (
    <Suspense fallback={null}>
      <PdfViewer {...props} />
    </Suspense>
  );
}

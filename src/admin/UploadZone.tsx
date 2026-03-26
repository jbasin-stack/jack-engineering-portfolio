import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, X, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile, validateUpload } from './upload';
import type { UploadContext } from './upload';

interface UploadZoneProps {
  /** Accepted file extensions, e.g. ['.jpg', '.jpeg', '.png', '.svg', '.webp'] */
  accept: string[];
  /** Max file size in bytes */
  maxSize: number;
  /** Upload context for server-side routing */
  context: UploadContext;
  /** Current file path (if one exists) */
  currentFile?: string;
  /** Label for the field, e.g. "Project Thumbnail" */
  label: string;
  /** Callback after successful upload with the new file path */
  onUploaded?: (path: string) => void;
}

type DragState = 'idle' | 'valid' | 'invalid';

/** Image extensions used to determine thumbnail vs icon preview */
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif']);

/** Extracts file extension from a path or filename */
function getExtension(path: string): string {
  const lastDot = path.lastIndexOf('.');
  return lastDot > 0 ? path.slice(lastDot).toLowerCase() : '';
}

/** Returns true if the file path refers to an image (by extension) */
function isImage(path: string): boolean {
  return IMAGE_EXTS.has(getExtension(path));
}

/** Extracts just the filename from a path */
function getFilename(path: string): string {
  return path.split('/').pop() ?? path;
}

/**
 * Checks whether dragged items contain a valid MIME type for the accepted extensions.
 * Maps extensions to expected MIME prefixes for DataTransfer type checking.
 */
function isDragTypeValid(items: DataTransferItemList, accept: string[]): boolean {
  if (items.length === 0) return false;

  const hasImage = accept.some((ext) => IMAGE_EXTS.has(ext));
  const hasPdf = accept.includes('.pdf');

  for (let i = 0; i < items.length; i++) {
    const type = items[i].type;
    if (hasImage && type.startsWith('image/')) return true;
    if (hasPdf && type === 'application/pdf') return true;
  }

  return false;
}

/** Reusable drag-drop upload component with idle, valid, invalid, uploading, and success states */
export function UploadZone({
  accept,
  maxSize,
  context,
  currentFile,
  label,
  onUploaded,
}: UploadZoneProps) {
  const [dragState, setDragState] = useState<DragState>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [showCheckmark, setShowCheckmark] = useState(false);

  // Counter prevents flicker from child element boundary crossings
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayPath = uploadedPath ?? currentFile;

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const result = await uploadFile(file, context);
        if (result.success && result.path) {
          setUploadedPath(result.path);
          setShowCheckmark(true);
          toast.success('File uploaded');
          onUploaded?.(result.path);
          setTimeout(() => setShowCheckmark(false), 2000);
        } else {
          toast.error(result.error ?? 'Upload failed');
        }
      } catch {
        toast.error('Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [context, onUploaded],
  );

  /** Validates and uploads a file (shared by drop and input change) */
  const processFile = useCallback(
    (file: File) => {
      const error = validateUpload(file.name, file.size);
      if (error) {
        toast.error(error);
        return;
      }
      handleUpload(file);
    },
    [handleUpload],
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current += 1;

      if (e.dataTransfer.items) {
        const valid = isDragTypeValid(e.dataTransfer.items, accept);
        setDragState(valid ? 'valid' : 'invalid');
      }
    },
    [accept],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragState('idle');
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setDragState('idle');

      const file = e.dataTransfer.files[0];
      if (!file) return;
      processFile(file);
    },
    [processFile],
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      processFile(file);
      // Reset input so re-selecting the same file triggers onChange
      e.target.value = '';
    },
    [processFile],
  );

  // Border and background classes driven by drag state
  const borderClasses =
    dragState === 'valid'
      ? 'border-solid border-2 border-accent bg-accent/5'
      : dragState === 'invalid'
        ? 'border-solid border-2 border-red-500 bg-red-50'
        : displayPath
          ? 'border-dashed border-2 border-border'
          : 'border-dashed border-2 border-border';

  const scaleValue = dragState === 'valid' ? 1.02 : 1;

  return (
    <div className="space-y-1.5">
      {/* Field label */}
      <span className="text-sm font-medium text-foreground">{label}</span>

      {/* Drop zone */}
      <motion.div
        className={`relative cursor-pointer rounded-lg p-4 transition-colors ${borderClasses}`}
        animate={{ scale: scaleValue }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
      >
        {/* Hidden file input for click-to-browse */}
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(',')}
          hidden
          onChange={handleInputChange}
        />

        {/* Drag-over overlay: valid */}
        {dragState === 'valid' && (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <Upload className="size-8 text-accent" />
            </motion.div>
            <p className="text-sm font-medium text-accent">Drop to upload!</p>
          </div>
        )}

        {/* Drag-over overlay: invalid */}
        {dragState === 'invalid' && (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <X className="size-8 text-red-500" />
            <p className="text-sm font-medium text-red-500">
              File type not allowed
            </p>
          </div>
        )}

        {/* Idle state: no current file */}
        {dragState === 'idle' && !displayPath && (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <Upload className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drop file here or click to browse
            </p>
          </div>
        )}

        {/* Idle state: has current file */}
        {dragState === 'idle' && displayPath && (
          <div className="flex flex-col items-center gap-2">
            {isImage(displayPath) ? (
              <img
                src={displayPath}
                alt={getFilename(displayPath)}
                className="max-h-24 rounded object-cover"
              />
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="size-6" />
                <span className="text-sm">{getFilename(displayPath)}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Drop to replace</p>
          </div>
        )}

        {/* Upload spinner overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/70">
            <Loader2 className="size-8 animate-spin text-accent" />
          </div>
        )}

        {/* Success checkmark animation */}
        {showCheckmark && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="flex size-10 items-center justify-center rounded-full bg-green-100"
            >
              <Check className="size-6 text-green-600" />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Accepted formats hint */}
      <p className="text-xs text-muted-foreground">
        Accepts: {accept.join(', ')} (max {Math.round(maxSize / 1024 / 1024)}MB)
      </p>
    </div>
  );
}

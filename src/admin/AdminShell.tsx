import { Group, Panel, Separator } from 'react-resizable-panels';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { AdminNav } from './AdminNav';
import { useAdminPanel } from './useAdminPanel';
import { UploadZone } from './UploadZone';

interface AdminShellProps {
  onClose: () => void;
}

/** Full admin panel with split-pane layout, grouped nav, and editor area */
export default function AdminShell({ onClose }: AdminShellProps) {
  const { activeContentType, setActiveContentType, isDirty, setDirty } =
    useAdminPanel();

  const handleSave = () => {
    toast.info('Save coming in Phase 10');
    setDirty(false);
  };

  const handleDiscard = () => {
    setDirty(false);
  };

  const handleClose = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Close anyway?'
      );
      if (!confirmed) return;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70]"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
      >
        <Group orientation="horizontal">
          {/* Left panel: admin controls */}
          <Panel
            defaultSize={30}
            minSize={20}
            maxSize={60}
            className="flex flex-col overflow-hidden border-r border-gray-200 bg-white shadow-lg"
          >
            {/* Header bar */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Admin Panel
              </h2>
              <button
                onClick={handleClose}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close admin panel"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Navigation */}
            <div className="shrink-0 overflow-y-auto border-b border-gray-100">
              <AdminNav
                activeType={activeContentType}
                onSelect={setActiveContentType}
              />
            </div>

            {/* Editor placeholder area */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeContentType === 'projects' ? (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400">
                    Upload Zone Preview (full editors in Phase 10)
                  </p>
                  <UploadZone
                    label="Project Thumbnail"
                    accept={['.jpg', '.jpeg', '.png', '.svg', '.webp']}
                    maxSize={10 * 1024 * 1024}
                    context={{ contentType: 'projects', field: 'thumbnail', itemId: 'lna-design' }}
                    currentFile="/projects/lna-design.svg"
                  />
                </div>
              ) : activeContentType === 'papers' ? (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400">
                    Upload Zone Preview (full editors in Phase 10)
                  </p>
                  <UploadZone
                    label="Paper PDF"
                    accept={['.pdf']}
                    maxSize={10 * 1024 * 1024}
                    context={{ contentType: 'papers', field: 'pdfPath', itemId: 'lna-design' }}
                    currentFile="/papers/lna-design.pdf"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Editor for{' '}
                  <span className="font-medium text-gray-600">
                    {activeContentType}
                  </span>{' '}
                  coming in Phase 10
                </p>
              )}
            </div>

            {/* Save bar */}
            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={!isDirty}
                onClick={handleDiscard}
              >
                Discard
              </Button>
              <Button
                size="sm"
                disabled={!isDirty}
                onClick={handleSave}
                className="bg-accent text-white hover:bg-accent/90 disabled:opacity-40"
              >
                Save
              </Button>
            </div>
          </Panel>

          {/* Drag separator */}
          <Separator className="w-1.5 cursor-col-resize bg-transparent transition-colors hover:bg-accent/50" />

          {/* Right panel: transparent passthrough to portfolio */}
          <Panel minSize={40} className="pointer-events-none bg-transparent" />
        </Group>

        {/* Toast notifications (dev-only, rendered inside admin shell) */}
        <Toaster />
      </motion.div>
    </AnimatePresence>
  );
}

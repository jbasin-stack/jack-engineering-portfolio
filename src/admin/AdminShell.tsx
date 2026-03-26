import { useRef, useCallback } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { AdminNav } from './AdminNav';
import { useAdminPanel } from './useAdminPanel';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { EditorSwitch } from './editors/EditorSwitch';

interface AdminShellProps {
  onClose: () => void;
}

/** Full admin panel with split-pane layout, grouped nav, and editor area */
export default function AdminShell({ onClose }: AdminShellProps) {
  const { activeContentType, setActiveContentType, isDirty, setDirty } =
    useAdminPanel();
  const saveRef = useRef<(() => Promise<boolean>) | null>(null);
  const savingRef = useRef(false);

  const handleSave = async () => {
    if (saveRef.current) {
      await saveRef.current();
    }
  };

  // Save-in-progress guard for keyboard shortcut: skip if already saving or nothing dirty
  const guardedSave = useCallback(async () => {
    if (savingRef.current || !isDirty) return;
    savingRef.current = true;
    try {
      await handleSave();
    } finally {
      savingRef.current = false;
    }
  }, [isDirty]);

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

  // Keyboard shortcuts: Ctrl+S and Escape handled here with real state.
  // isOpen=true (AdminShell only renders when panel is open).
  // onToggle is no-op (Ctrl+Shift+A toggle lives in App.tsx).
  useKeyboardShortcuts(true, () => {}, guardedSave, handleClose, isDirty);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70]"
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Group orientation="horizontal">
          {/* Left panel: admin controls */}
          <Panel
            defaultSize="20%"
            minSize="20%"
            maxSize="85%"
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
            <div className="shrink-0 overflow-y-auto overscroll-contain border-b border-gray-100">
              <AdminNav
                activeType={activeContentType}
                onSelect={setActiveContentType}
              />
            </div>

            {/* Editor area */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              <EditorSwitch
                contentType={activeContentType}
                onDirtyChange={setDirty}
                saveRef={saveRef}
              />
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
          <Panel minSize="15%" className="pointer-events-none bg-transparent" />
        </Group>

        {/* Toast notifications (dev-only, rendered inside admin shell) */}
        <Toaster />
      </motion.div>
    </AnimatePresence>
  );
}

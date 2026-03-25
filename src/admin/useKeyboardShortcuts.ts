import { useEffect } from 'react';

/**
 * Global keyboard shortcut handler for the admin panel.
 *
 * - Ctrl+Shift+A: toggle panel open/closed (always active)
 * - Ctrl+S: trigger save, prevent browser save dialog (only when open)
 * - Escape: close panel with dirty-state confirmation (only when open)
 */
export function useKeyboardShortcuts(
  isOpen: boolean,
  onToggle: () => void,
  onSave: () => void,
  onClose: () => void,
  isDirty: boolean
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+Shift+A — toggle panel
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        onToggle();
        return;
      }

      // Shortcuts below only apply when the panel is open
      if (!isOpen) return;

      // Ctrl+S — save (block browser save dialog)
      if (e.ctrlKey && !e.shiftKey && e.key === 's') {
        e.preventDefault();
        onSave();
        return;
      }

      // Escape — close with dirty check
      if (e.key === 'Escape') {
        if (isDirty) {
          const confirmed = window.confirm(
            'You have unsaved changes. Close anyway?'
          );
          if (!confirmed) return;
        }
        onClose();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onToggle, onSave, onClose, isDirty]);
}

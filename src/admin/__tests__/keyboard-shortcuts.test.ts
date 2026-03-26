import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

/** Helper: dispatch a keydown event on window */
function fireKeyDown(opts: Partial<KeyboardEventInit>) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    ...opts,
  });
  // Spy on preventDefault so we can assert it
  const preventSpy = vi.spyOn(event, 'preventDefault');
  window.dispatchEvent(event);
  return { event, preventSpy };
}

describe('useKeyboardShortcuts', () => {
  let onToggle: ReturnType<typeof vi.fn>;
  let onSave: ReturnType<typeof vi.fn>;
  let onClose: ReturnType<typeof vi.fn>;
  let confirmSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    onToggle = vi.fn();
    onSave = vi.fn();
    onClose = vi.fn();
    confirmSpy = vi.spyOn(window, 'confirm');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Ctrl+S calls onSave when panel is open', () => {
    renderHook(() =>
      useKeyboardShortcuts(true, onToggle, onSave, onClose, false)
    );
    fireKeyDown({ ctrlKey: true, key: 's' });
    expect(onSave).toHaveBeenCalledOnce();
  });

  it('Ctrl+S does NOT call onSave when panel is closed', () => {
    renderHook(() =>
      useKeyboardShortcuts(false, onToggle, onSave, onClose, false)
    );
    const { preventSpy } = fireKeyDown({ ctrlKey: true, key: 's' });
    expect(onSave).not.toHaveBeenCalled();
    // Should NOT preventDefault either, so browser save dialog works
    expect(preventSpy).not.toHaveBeenCalled();
  });

  it('Ctrl+S calls preventDefault when panel is open', () => {
    renderHook(() =>
      useKeyboardShortcuts(true, onToggle, onSave, onClose, false)
    );
    const { preventSpy } = fireKeyDown({ ctrlKey: true, key: 's' });
    expect(preventSpy).toHaveBeenCalled();
  });

  it('Escape calls onClose when not dirty', () => {
    renderHook(() =>
      useKeyboardShortcuts(true, onToggle, onSave, onClose, false)
    );
    fireKeyDown({ key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('Escape shows confirm dialog when dirty and closes on accept', () => {
    confirmSpy.mockReturnValue(true);
    renderHook(() =>
      useKeyboardShortcuts(true, onToggle, onSave, onClose, true)
    );
    fireKeyDown({ key: 'Escape' });
    expect(confirmSpy).toHaveBeenCalledWith(
      expect.stringContaining('unsaved changes')
    );
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('Escape does NOT close when dirty and user cancels confirm', () => {
    confirmSpy.mockReturnValue(false);
    renderHook(() =>
      useKeyboardShortcuts(true, onToggle, onSave, onClose, true)
    );
    fireKeyDown({ key: 'Escape' });
    expect(confirmSpy).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Ctrl+Shift+A calls onToggle', () => {
    renderHook(() =>
      useKeyboardShortcuts(false, onToggle, onSave, onClose, false)
    );
    fireKeyDown({ ctrlKey: true, shiftKey: true, key: 'A' });
    expect(onToggle).toHaveBeenCalledOnce();
  });
});

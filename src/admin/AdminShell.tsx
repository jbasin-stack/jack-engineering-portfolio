/** Stub admin shell component - replaced with full UI in Phase 9 */
export default function AdminShell() {
  const handleClose = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.history.replaceState({}, '', url.toString());
    // Force re-render by dispatching a popstate event
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-[320px] bg-white border-r border-gray-200 z-[70] p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          aria-label="Close admin panel"
        >
          &times;
        </button>
      </div>
      <p className="text-sm text-gray-500">Coming in Phase 9</p>
    </div>
  );
}

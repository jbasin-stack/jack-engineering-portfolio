export function Footer() {
  return (
    <div className="border-t border-border py-8 text-center">
      <p className="text-sm text-silicon-400">
        &copy; {new Date().getFullYear()} Jack Basinski
      </p>
      <p className="mt-1 text-xs text-silicon-400/60">
        Built with React &amp; Motion
      </p>
    </div>
  );
}

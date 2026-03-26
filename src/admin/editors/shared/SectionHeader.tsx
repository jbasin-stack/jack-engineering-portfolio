interface SectionHeaderProps {
  children: React.ReactNode;
}

/** Visual section divider within editor forms */
export function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <h3 className="border-b border-gray-100 pb-1 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
      {children}
    </h3>
  );
}

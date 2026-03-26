import { Plus } from 'lucide-react';

interface ItemListProps<T> {
  items: T[];
  activeIndex: number;
  onSelect: (index: number) => void;
  getLabel: (item: T) => string;
  onAdd: () => void;
}

/** Compact item picker for list-type editors, styled like VS Code's file explorer */
export function ItemList<T>({
  items,
  activeIndex,
  onSelect,
  getLabel,
  onAdd,
}: ItemListProps<T>) {
  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      {items.length === 0 ? (
        <p className="px-3 py-2 text-sm text-gray-400">No items yet</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                className={`w-full text-left text-sm py-1.5 px-3 transition-colors ${
                  i === activeIndex
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {getLabel(item)}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center gap-1.5 border-t border-gray-200 px-3 py-1.5 text-sm text-accent hover:text-accent/80 transition-colors"
      >
        <Plus className="size-3.5" />
        Add new
      </button>
    </div>
  );
}

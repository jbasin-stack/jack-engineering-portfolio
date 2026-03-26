import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  error?: string[];
}

/** String array editor rendered as tags with Enter-to-add */
export function TagInput({ label, tags, onChange, error }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onChange([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const hasError = error && error.length > 0;

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-sm text-gray-700"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter"
        aria-invalid={hasError || undefined}
      />
      {hasError && <p className="text-sm text-red-500">{error[0]}</p>}
    </div>
  );
}

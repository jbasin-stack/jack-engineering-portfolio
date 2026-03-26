import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string[];
  multiline?: boolean;
  placeholder?: string;
}

/** Labeled input/textarea with inline error display */
export function FormField({
  label,
  value,
  onChange,
  error,
  multiline,
  placeholder,
}: FormFieldProps) {
  const hasError = error && error.length > 0;
  const id = label.toLowerCase().replace(/\s+/g, '-');
  const Component = multiline ? Textarea : Input;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Component
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={hasError || undefined}
      />
      {hasError && <p className="text-sm text-red-500">{error[0]}</p>}
    </div>
  );
}

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
  required?: boolean;
}

/** Labeled input/textarea with inline error display */
export function FormField({
  label,
  value,
  onChange,
  error,
  multiline,
  placeholder,
  required,
}: FormFieldProps) {
  const hasError = error && error.length > 0;
  const id = label.toLowerCase().replace(/\s+/g, '-');
  const Component = multiline ? Textarea : Input;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <Component
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={hasError || undefined}
        className={hasError ? 'ring-1 ring-red-500' : undefined}
      />
      {hasError && <p className="text-sm text-red-500">{error[0]}</p>}
    </div>
  );
}

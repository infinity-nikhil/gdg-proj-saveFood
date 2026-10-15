import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/format";

const controlStyles =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition focus:border-forest-500 focus:outline-none focus:ring-4 focus:ring-forest-100";

interface FieldShellProps {
  label: string;
  error?: string;
  hint?: string;
  children: (id: string) => ReactNode;
}

function FieldShell({ label, error, hint, children }: FieldShellProps) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {children(id)}
      {error ? (
        <p className="text-xs font-medium text-tomato-600">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

type Shared = { label: string; error?: string; hint?: string };

export function TextField({ label, error, hint, className, ...props }: Shared & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(id) => (
        <input id={id} className={cn(controlStyles, error && "border-tomato-500", className)} {...props} />
      )}
    </FieldShell>
  );
}

export function TextArea({ label, error, hint, className, ...props }: Shared & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(id) => (
        <textarea
          id={id}
          rows={3}
          className={cn(controlStyles, "resize-none", error && "border-tomato-500", className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function SelectField({ label, error, hint, className, children, ...props }: Shared & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(id) => (
        <select id={id} className={cn(controlStyles, "appearance-none", error && "border-tomato-500", className)} {...props}>
          {children}
        </select>
      )}
    </FieldShell>
  );
}

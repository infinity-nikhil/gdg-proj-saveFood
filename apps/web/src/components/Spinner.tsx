import { Loader2 } from "lucide-react";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted">
      <Loader2 className="size-5 animate-spin text-forest-500" />
      {label}
    </div>
  );
}

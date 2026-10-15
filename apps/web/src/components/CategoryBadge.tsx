import type { Category } from "@morsel/shared";
import { categoryStyles } from "@/lib/categories";
import { cn } from "@/lib/format";

export function CategoryBadge({ category, className }: { category: Category; className?: string }) {
  const { label, icon: Icon, tint, accent } = categoryStyles[category];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", tint, accent, className)}>
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}

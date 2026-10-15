import { cn } from "@/lib/format";

interface Tab<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function Tabs<T extends string>({ tabs, value, onChange }: TabsProps<T>) {
  return (
    <div className="inline-flex rounded-full bg-paper p-1 ring-1 ring-line">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
            value === tab.value ? "bg-forest-700 text-cream" : "text-muted hover:text-ink",
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn("rounded-full px-2 text-xs", value === tab.value ? "bg-cream/20" : "bg-forest-50")}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

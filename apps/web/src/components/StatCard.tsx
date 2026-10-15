import type { LucideIcon } from "lucide-react";
import { cn, formatNumber } from "@/lib/format";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  tone?: "forest" | "sun" | "tomato" | "sky";
}

const tones = {
  forest: "bg-forest-50 text-forest-600",
  sun: "bg-sun-100 text-sun-600",
  tomato: "bg-tomato-50 text-tomato-600",
  sky: "bg-sky-50 text-sky-600",
};

export function StatCard({ icon: Icon, label, value, suffix, tone = "forest" }: StatCardProps) {
  return (
    <div className="rounded-3xl bg-paper p-5 shadow-card ring-1 ring-line/70">
      <span className={cn("grid size-10 place-items-center rounded-2xl", tones[tone])}>
        <Icon className="size-5" />
      </span>
      <p className="mt-4 font-display text-3xl font-semibold text-forest-900">
        {formatNumber(value)}
        {suffix && <span className="ml-1 text-base font-medium text-muted">{suffix}</span>}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

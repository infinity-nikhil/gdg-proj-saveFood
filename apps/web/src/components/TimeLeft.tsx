import { Clock } from "lucide-react";
import { useNow } from "@/hooks/useNow";
import { cn, timeLeft, urgency } from "@/lib/format";

const tones = {
  high: "bg-tomato-50 text-tomato-600",
  medium: "bg-sun-100 text-sun-600",
  low: "bg-forest-50 text-forest-600",
};

export function TimeLeft({ until, className }: { until: string; className?: string }) {
  const now = useNow();
  const tone = tones[urgency(until, now)];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", tone, className)}>
      <Clock className="size-3.5" />
      {timeLeft(until, now)}
    </span>
  );
}

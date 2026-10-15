import type { ClaimStatus, ListingStatus } from "@morsel/shared";
import { cn } from "@/lib/format";

const styles: Record<ListingStatus | ClaimStatus, string> = {
  AVAILABLE: "bg-forest-50 text-forest-600",
  RESERVED: "bg-sun-100 text-sun-600",
  PENDING: "bg-sun-100 text-sun-600",
  COLLECTED: "bg-forest-700 text-cream",
  EXPIRED: "bg-stone-100 text-stone-500",
  CANCELLED: "bg-stone-100 text-stone-500",
};

const labels: Record<ListingStatus | ClaimStatus, string> = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  PENDING: "Awaiting pickup",
  COLLECTED: "Rescued",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export function StatusPill({ status }: { status: ListingStatus | ClaimStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", styles[status])}>
      {labels[status]}
    </span>
  );
}

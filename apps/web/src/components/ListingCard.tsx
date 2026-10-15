import type { Listing } from "@morsel/shared";
import { MapPin, Scale } from "lucide-react";
import { Link } from "react-router";
import { categoryStyles } from "@/lib/categories";
import { cn } from "@/lib/format";
import { CategoryBadge } from "./CategoryBadge";
import { TimeLeft } from "./TimeLeft";

export function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const { icon: Icon, tint, accent } = categoryStyles[listing.category];

  return (
    <Link
      to={`/listings/${listing.id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
      className="group flex animate-rise flex-col overflow-hidden rounded-3xl bg-paper shadow-card ring-1 ring-line/70 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className={cn("relative flex h-36 items-center justify-center", tint)}>
        <Icon className={cn("size-16 opacity-80 transition duration-500 group-hover:scale-110 group-hover:-rotate-6", accent)} strokeWidth={1.4} />
        <TimeLeft until={listing.availableUntil} className="absolute top-3 right-3 bg-paper/90 backdrop-blur" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <CategoryBadge category={listing.category} className="self-start" />
        <h3 className="mt-3 text-lg leading-snug font-semibold text-forest-900 group-hover:text-forest-600">
          {listing.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{listing.donor.organization ?? listing.donor.name}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted">
            <MapPin className="size-4" />
            {listing.city}
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
            <Scale className="size-4 text-muted" />
            {listing.quantity} {listing.unit} · {listing.weightKg} kg
          </span>
        </div>
      </div>
    </Link>
  );
}

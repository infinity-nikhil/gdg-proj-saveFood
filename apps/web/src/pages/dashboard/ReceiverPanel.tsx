import type { Claim } from "@morsel/shared";
import { MapPin, ShoppingBasket, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button, buttonStyles } from "@/components/Button";
import { CategoryBadge } from "@/components/CategoryBadge";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";
import { StatusPill } from "@/components/StatusPill";
import { Tabs } from "@/components/Tabs";
import { TimeLeft } from "@/components/TimeLeft";
import { useCancelClaim, useMyClaims } from "@/hooks/queries";
import { formatDateTime } from "@/lib/format";

type View = "pickups" | "history";

function PickupCard({ claim }: { claim: Claim }) {
  const cancel = useCancelClaim();
  const { listing } = claim;

  const handleCancel = () => {
    if (confirm("Cancel this pickup? The food will be offered to others.")) cancel.mutate(claim.id);
  };

  return (
    <article className="grid overflow-hidden rounded-3xl bg-paper shadow-card ring-1 ring-line/70 sm:grid-cols-[1fr_auto]">
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={listing.category} />
          <TimeLeft until={listing.availableUntil} />
        </div>
        <Link to={`/listings/${listing.id}`} className="mt-3 block text-xl font-semibold text-forest-900 hover:text-forest-600">
          {listing.title}
        </Link>
        <p className="mt-1 text-sm text-muted">
          {listing.quantity} {listing.unit} from {listing.donor.organization ?? listing.donor.name}
        </p>
        <p className="mt-4 inline-flex items-start gap-2 text-sm font-medium">
          <MapPin className="mt-0.5 size-4 shrink-0 text-tomato-500" />
          {listing.pickupAddress}, {listing.city}
        </p>
        <div className="mt-5">
          <Button variant="danger" size="sm" loading={cancel.isPending} onClick={handleCancel}>
            <X className="size-4" />
            Cancel pickup
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 border-t border-dashed border-line bg-forest-700 px-8 py-6 text-cream sm:border-t-0 sm:border-l">
        <p className="text-xs font-semibold tracking-widest text-cream/60 uppercase">Pickup code</p>
        <p className="font-mono text-4xl font-bold tracking-[0.25em] text-sun-400">{claim.pickupCode}</p>
        <p className="max-w-36 text-center text-xs text-cream/60">Show this to the donor at handover</p>
      </div>
    </article>
  );
}

function HistoryRow({ claim }: { claim: Claim }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper px-5 py-4 ring-1 ring-line/70">
      <div>
        <p className="font-semibold text-forest-900">{claim.listing.title}</p>
        <p className="text-sm text-muted">
          {claim.listing.donor.organization ?? claim.listing.donor.name} · {claim.listing.weightKg} kg ·{" "}
          {formatDateTime(claim.collectedAt ?? claim.createdAt)}
        </p>
      </div>
      <StatusPill status={claim.status} />
    </div>
  );
}

export function ReceiverPanel() {
  const [view, setView] = useState<View>("pickups");
  const { data: claims = [], isLoading } = useMyClaims();

  const pending = claims.filter((claim) => claim.status === "PENDING");
  const history = claims.filter((claim) => claim.status !== "PENDING");

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs
          value={view}
          onChange={setView}
          tabs={[
            { value: "pickups", label: "Upcoming pickups", count: pending.length },
            { value: "history", label: "History", count: history.length },
          ]}
        />
        <Link to="/browse" className={buttonStyles("accent")}>
          <ShoppingBasket className="size-4" />
          Find food
        </Link>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <Spinner />
        ) : view === "pickups" ? (
          pending.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {pending.map((claim) => (
                <PickupCard key={claim.id} claim={claim} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ShoppingBasket}
              title="No pickups scheduled"
              description="Browse what's available near you and claim something before it's gone."
              action={<Link to="/browse" className={buttonStyles()}>Browse food</Link>}
            />
          )
        ) : history.length ? (
          <div className="space-y-3">
            {history.map((claim) => (
              <HistoryRow key={claim.id} claim={claim} />
            ))}
          </div>
        ) : (
          <EmptyState icon={ShoppingBasket} title="No history yet" description="Completed and cancelled pickups show up here." />
        )}
      </div>
    </>
  );
}

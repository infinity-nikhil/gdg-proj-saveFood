import type { Listing } from "@morsel/shared";
import { KeyRound, PackageOpen, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Button, buttonStyles } from "@/components/Button";
import { CategoryBadge } from "@/components/CategoryBadge";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";
import { StatusPill } from "@/components/StatusPill";
import { Tabs } from "@/components/Tabs";
import { TimeLeft } from "@/components/TimeLeft";
import { useCollectListing, useMyListings } from "@/hooks/queries";
import { formatDateTime } from "@/lib/format";

type View = "active" | "history";

const isActive = (listing: Listing) => listing.status === "AVAILABLE" || listing.status === "RESERVED";

function VerifyPickup({ listing }: { listing: Listing }) {
  const [code, setCode] = useState("");
  const collect = useCollectListing();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    collect.mutate({ id: listing.id, code });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-2xl bg-sun-100/60 p-4">
      <p className="text-sm font-medium">
        Reserved by <strong>{listing.claim?.receiver.organization ?? listing.claim?.receiver.name}</strong>. Ask
        for their pickup code at handover.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          placeholder="0000"
          className="h-10 w-28 rounded-full border border-line bg-paper px-4 text-center font-mono text-lg tracking-[0.3em] focus:border-forest-500 focus:outline-none"
        />
        <Button size="sm" type="submit" loading={collect.isPending} disabled={code.length !== 4}>
          <KeyRound className="size-4" />
          Confirm pickup
        </Button>
      </div>
      {collect.error && <p className="mt-2 text-xs font-medium text-tomato-600">{collect.error.message}</p>}
    </form>
  );
}

function DonorListingRow({ listing }: { listing: Listing }) {
  return (
    <article className="rounded-3xl bg-paper p-5 shadow-card ring-1 ring-line/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={listing.category} />
            <StatusPill status={listing.status} />
          </div>
          <Link to={`/listings/${listing.id}`} className="mt-3 block text-lg font-semibold text-forest-900 hover:text-forest-600">
            {listing.title}
          </Link>
          <p className="mt-1 text-sm text-muted">
            {listing.quantity} {listing.unit} · {listing.weightKg} kg · {listing.pickupAddress}
          </p>
        </div>
        {isActive(listing) ? (
          <TimeLeft until={listing.availableUntil} />
        ) : (
          <span className="text-xs text-muted">{formatDateTime(listing.availableUntil)}</span>
        )}
      </div>
      {listing.status === "RESERVED" && <VerifyPickup listing={listing} />}
    </article>
  );
}

export function DonorPanel() {
  const [view, setView] = useState<View>("active");
  const { data: listings = [], isLoading } = useMyListings();

  const active = listings.filter(isActive);
  const history = listings.filter((listing) => !isActive(listing));
  const visible = view === "active" ? active : history;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs
          value={view}
          onChange={setView}
          tabs={[
            { value: "active", label: "Active", count: active.length },
            { value: "history", label: "History", count: history.length },
          ]}
        />
        <Link to="/listings/new" className={buttonStyles("accent")}>
          <Plus className="size-4" />
          New listing
        </Link>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <Spinner />
        ) : visible.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {visible.map((listing) => (
              <DonorListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={PackageOpen}
            title={view === "active" ? "No active listings" : "No history yet"}
            description={
              view === "active"
                ? "Got leftovers from today's service? List them and someone nearby will pick them up."
                : "Rescued and expired listings will appear here."
            }
            action={
              view === "active" && (
                <Link to="/listings/new" className={buttonStyles()}>
                  Share food
                </Link>
              )
            }
          />
        )}
      </div>
    </>
  );
}

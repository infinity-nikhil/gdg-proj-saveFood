import { ArrowLeft, Building2, CalendarClock, CheckCircle2, MapPin, Scale, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { Alert } from "@/components/Alert";
import { Button, buttonStyles } from "@/components/Button";
import { CategoryBadge } from "@/components/CategoryBadge";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";
import { StatusPill } from "@/components/StatusPill";
import { TimeLeft } from "@/components/TimeLeft";
import { useClaimListing, useDeleteListing, useListing } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { categoryStyles } from "@/lib/categories";
import { cn, formatDateTime } from "@/lib/format";

export function ListingDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: listing, isLoading } = useListing(id);
  const claim = useClaimListing();
  const remove = useDeleteListing();

  if (isLoading) return <Spinner />;
  if (!listing) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24">
        <EmptyState
          icon={Scale}
          title="This listing is gone"
          description="It may have been claimed or removed by the donor."
          action={<Link to="/browse" className={buttonStyles()}>Browse other food</Link>}
        />
      </div>
    );
  }

  const { icon: Icon, tint, accent } = categoryStyles[listing.category];
  const isOwner = user?.id === listing.donor.id;
  const canClaim = user?.role === "RECEIVER" && listing.status === "AVAILABLE";

  const handleClaim = () => claim.mutate(listing.id, { onSuccess: () => navigate("/dashboard") });
  const handleDelete = () => {
    if (!confirm("Remove this listing?")) return;
    remove.mutate(listing.id, { onSuccess: () => navigate("/dashboard") });
  };

  const facts = [
    { icon: Scale, label: "Quantity", value: `${listing.quantity} ${listing.unit} · ${listing.weightKg} kg` },
    { icon: CalendarClock, label: "Pick up before", value: formatDateTime(listing.availableUntil) },
    { icon: MapPin, label: "Pickup address", value: `${listing.pickupAddress}, ${listing.city}` },
    { icon: Building2, label: "Shared by", value: listing.donor.organization ?? listing.donor.name },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <Link to="/browse" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" />
        Back to listings
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className={cn("relative flex min-h-80 items-center justify-center overflow-hidden rounded-[2rem]", tint)}>
          <Icon className={cn("size-40 opacity-80", accent)} strokeWidth={1} />
          <div className="absolute top-5 left-5 flex gap-2">
            <CategoryBadge category={listing.category} className="bg-paper/90" />
            <StatusPill status={listing.status} />
          </div>
        </div>

        <div className="flex flex-col">
          <TimeLeft until={listing.availableUntil} className="self-start" />
          <h1 className="mt-4 text-4xl font-semibold text-forest-900">{listing.title}</h1>
          {listing.description && <p className="mt-4 leading-relaxed text-muted">{listing.description}</p>}

          <dl className="mt-8 space-y-4 rounded-3xl bg-paper p-6 shadow-card ring-1 ring-line/70">
            {facts.map(({ icon: FactIcon, label, value }) => (
              <div key={label} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-600">
                  <FactIcon className="size-5" />
                </span>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</dt>
                  <dd className="mt-0.5 font-medium">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-6 space-y-3">
            <Alert message={claim.error?.message ?? remove.error?.message} />

            {canClaim && (
              <Button size="lg" className="w-full" loading={claim.isPending} onClick={handleClaim}>
                <CheckCircle2 className="size-5" />
                Claim this food
              </Button>
            )}

            {!user && listing.status === "AVAILABLE" && (
              <Link to="/login" state={{ from: `/listings/${listing.id}` }} className={buttonStyles("primary", "lg", "w-full")}>
                Sign in to claim
              </Link>
            )}

            {isOwner && listing.status === "AVAILABLE" && (
              <Button variant="danger" className="w-full" loading={remove.isPending} onClick={handleDelete}>
                <Trash2 className="size-4" />
                Remove listing
              </Button>
            )}

            {listing.status === "RESERVED" && !isOwner && (
              <p className="rounded-2xl bg-sun-100 px-4 py-3 text-sm font-medium text-sun-600">
                Someone has already reserved this. Keep an eye out — it may come back if they cancel.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

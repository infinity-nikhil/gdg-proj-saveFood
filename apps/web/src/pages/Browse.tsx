import { CATEGORIES, type Category, type ListingQuery } from "@morsel/shared";
import { Search, SearchX } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { useSearchParams } from "react-router";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard } from "@/components/ListingCard";
import { Spinner } from "@/components/Spinner";
import { useCities, useListings } from "@/hooks/queries";
import { categoryStyles } from "@/lib/categories";
import { cn } from "@/lib/format";

export function Browse() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const deferredSearch = useDeferredValue(search);

  const category = (params.get("category") as Category | null) ?? undefined;
  const city = params.get("city") ?? undefined;

  const filters: ListingQuery = { q: deferredSearch.trim() || undefined, category, city };
  const { data: listings, isLoading } = useListings(filters);
  const { data: cities = [] } = useCities();

  const updateParam = (key: string, value?: string) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, { replace: true });
  };

  const chipClass = (active: boolean) =>
    cn(
      "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
      active ? "bg-forest-700 text-cream shadow-sm" : "bg-paper text-ink ring-1 ring-line hover:ring-forest-200",
    );

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-forest-900 sm:text-5xl">Food looking for a home</h1>
          <p className="mt-3 text-muted">
            Fresh surplus from local kitchens and shops. Claim it before the timer runs out.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                updateParam("q", event.target.value);
              }}
              placeholder="Search bread, curry, fruit…"
              className="h-11 w-full rounded-full border border-line bg-paper pr-4 pl-11 text-sm focus:border-forest-500 focus:ring-4 focus:ring-forest-100 focus:outline-none sm:w-72"
            />
          </label>
          <select
            value={city ?? ""}
            onChange={(event) => updateParam("city", event.target.value)}
            className="h-11 rounded-full border border-line bg-paper px-5 text-sm font-semibold focus:border-forest-500 focus:outline-none"
          >
            <option value="">All cities</option>
            {cities.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-2">
        <button onClick={() => updateParam("category")} className={chipClass(!category)}>
          Everything
        </button>
        {CATEGORIES.map((value) => {
          const { label, icon: Icon } = categoryStyles[value];
          return (
            <button key={value} onClick={() => updateParam("category", value)} className={chipClass(category === value)}>
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </div>

      <section className="mt-8">
        {isLoading ? (
          <Spinner label="Finding food near you" />
        ) : listings?.length ? (
          <>
            <p className="mb-5 text-sm text-muted">
              {listings.length} {listings.length === 1 ? "listing" : "listings"} available, soonest to expire first
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} index={index} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={SearchX}
            title="Nothing here right now"
            description="Try another category or city — new surplus is posted throughout the day."
          />
        )}
      </section>
    </div>
  );
}

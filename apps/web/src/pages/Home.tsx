import { ArrowRight, Droplets, HandHeart, Leaf, Store, Truck, UtensilsCrossed, Wind } from "lucide-react";
import { Link } from "react-router";
import { buttonStyles } from "@/components/Button";
import { ListingCard } from "@/components/ListingCard";
import { useImpact, useListings } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { formatNumber } from "@/lib/format";

const steps = [
  {
    icon: Store,
    title: "List your surplus",
    body: "Restaurants, bakeries and grocers post what's left in under a minute — quantity, pickup spot and window.",
  },
  {
    icon: HandHeart,
    title: "Someone claims it",
    body: "Shelters, community fridges and neighbours nearby reserve it instantly and get a private pickup code.",
  },
  {
    icon: Truck,
    title: "Food gets eaten",
    body: "The donor checks the code at handover. Every rescue is counted toward your impact.",
  },
];

function Hero() {
  const { user } = useAuth();
  const { data: listings = [] } = useListings({});
  const preview = listings.slice(0, 2);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-sun-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-60 -left-40 size-[28rem] rounded-full bg-forest-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pt-16 pb-24 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pt-24">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-1.5 text-sm font-semibold text-forest-600 shadow-card ring-1 ring-line">
            <Leaf className="size-4" />
            Zero food waste, one pickup at a time
          </span>
          <h1 className="mt-6 text-5xl leading-[1.05] font-semibold text-forest-900 sm:text-6xl lg:text-7xl">
            Good food deserves a <em className="text-tomato-500 not-italic">plate</em>, not a bin.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Morsel connects kitchens with surplus to the people and places who need it — before the
            clock runs out.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/browse" className={buttonStyles("primary", "lg")}>
              Find food nearby
              <ArrowRight className="size-5" />
            </Link>
            {!user && (
              <Link to="/register?role=DONOR" className={buttonStyles("secondary", "lg")}>
                I have surplus to share
              </Link>
            )}
          </div>
        </div>

        <div className="relative hidden h-[30rem] lg:block">
          {preview.map((listing, index) => (
            <div
              key={listing.id}
              className={
                index === 0
                  ? "absolute top-0 left-6 w-72 -rotate-3"
                  : "absolute right-0 bottom-0 w-72 rotate-3"
              }
            >
              <ListingCard listing={listing} index={index + 2} />
            </div>
          ))}
          <div className="absolute top-1/2 left-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-forest-700 text-center text-cream shadow-lift">
            <div>
              <p className="font-display text-3xl font-semibold">{listings.length}</p>
              <p className="text-xs text-cream/70">live listings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactBand() {
  const { data } = useImpact();

  const stats = [
    { icon: Leaf, value: data?.kgSaved ?? 0, suffix: "kg", label: "food rescued" },
    { icon: UtensilsCrossed, value: data?.meals ?? 0, label: "meals shared" },
    { icon: Wind, value: data?.co2Kg ?? 0, suffix: "kg", label: "CO₂e avoided" },
    { icon: Droplets, value: data?.waterLitres ?? 0, suffix: "L", label: "water saved" },
  ];

  return (
    <section id="impact" className="scroll-mt-24 px-5 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-forest-700 px-6 py-14 text-cream sm:px-12">
        <div className="pointer-events-none absolute -right-20 -bottom-24 size-80 rounded-full bg-sun-400/20 blur-2xl" />
        <div className="relative grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-semibold">Every pickup adds up.</h2>
            <p className="mt-4 text-cream/70">
              Live totals from every rescue completed on Morsel.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(({ icon: Icon, value, suffix, label }) => (
              <div key={label}>
                <Icon className="size-6 text-sun-400" />
                <p className="mt-3 font-display text-4xl font-semibold">
                  {formatNumber(value)}
                  {suffix && <span className="ml-1 text-lg text-cream/60">{suffix}</span>}
                </p>
                <p className="mt-1 text-sm text-cream/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-bold tracking-widest text-tomato-500 uppercase">How it works</p>
        <h2 className="mt-3 text-4xl font-semibold text-forest-900 sm:text-5xl">
          From surplus to supper in three steps.
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, index) => (
          <article key={title} className="relative rounded-3xl bg-paper p-8 shadow-card ring-1 ring-line/70">
            <span className="absolute top-6 right-7 font-display text-6xl font-semibold text-forest-50">
              {index + 1}
            </span>
            <span className="relative grid size-12 place-items-center rounded-2xl bg-sun-100 text-sun-600">
              <Icon className="size-6" />
            </span>
            <h3 className="relative mt-6 text-2xl font-semibold text-forest-900">{title}</h3>
            <p className="relative mt-3 leading-relaxed text-muted">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-8 text-center lg:px-8">
      <h2 className="text-4xl font-semibold text-forest-900 sm:text-5xl">
        Have food that won't sell today?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
        It takes less than a minute to list it. Someone nearby is ready to pick it up.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/register?role=DONOR" className={buttonStyles("accent", "lg")}>
          Start donating
        </Link>
        <Link to="/register?role=RECEIVER" className={buttonStyles("secondary", "lg")}>
          Register to receive
        </Link>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <ImpactBand />
      <HowItWorks />
      <Closing />
    </>
  );
}

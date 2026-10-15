import { Droplets, Leaf, UtensilsCrossed, Wind } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useMyImpact } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { DonorPanel } from "./dashboard/DonorPanel";
import { ReceiverPanel } from "./dashboard/ReceiverPanel";

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export function Dashboard() {
  const { user } = useAuth();
  const { data: impact } = useMyImpact();

  if (!user) return null;

  const isDonor = user.role === "DONOR";

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-muted">{user.organization ?? user.city}</p>
        <h1 className="mt-1 text-4xl font-semibold text-forest-900 sm:text-5xl">
          {greeting()}, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-3 text-muted">
          {isDonor ? "Here's what your surplus has achieved so far." : "Here's the food you've helped rescue."}
        </p>
      </header>

      <section className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Leaf} label="Food rescued" value={impact?.kgSaved ?? 0} suffix="kg" />
        <StatCard icon={UtensilsCrossed} label="Meals" value={impact?.meals ?? 0} tone="sun" />
        <StatCard icon={Wind} label="CO₂e avoided" value={impact?.co2Kg ?? 0} suffix="kg" tone="tomato" />
        <StatCard icon={Droplets} label="Water saved" value={impact?.waterLitres ?? 0} suffix="L" tone="sky" />
      </section>

      <section className="mt-14">{isDonor ? <DonorPanel /> : <ReceiverPanel />}</section>
    </div>
  );
}

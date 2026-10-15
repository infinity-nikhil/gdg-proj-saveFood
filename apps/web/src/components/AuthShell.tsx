import { Leaf, Quote } from "lucide-react";
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-2 lg:px-8 lg:py-20">
      <aside className="relative hidden overflow-hidden rounded-[2.5rem] bg-forest-700 p-12 text-cream lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-sun-400/25 blur-2xl" />
        <Leaf className="relative size-10 text-sun-400" />
        <div className="relative">
          <Quote className="size-8 text-cream/30" />
          <p className="mt-4 font-display text-3xl leading-snug">
            We used to throw out twenty loaves a night. Now they're breakfast at the shelter down the road.
          </p>
          <p className="mt-6 text-sm text-cream/60">Ana Ribeiro, Crumb & Co. Bakery</p>
        </div>
      </aside>

      <div className="flex animate-rise flex-col justify-center">
        <h1 className="text-4xl font-semibold text-forest-900">{title}</h1>
        <p className="mt-3 text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-8 text-sm text-muted">{footer}</p>
      </div>
    </div>
  );
}

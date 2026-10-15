import { Link } from "react-router";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-forest-700 transition group-hover:rotate-6">
        <svg viewBox="0 0 32 32" className="size-6">
          <path d="M16 5c-5 3.4-8 7.6-8 12a8 8 0 0 0 16 0c0-4.4-3-8.6-8-12Z" fill="#F4B942" />
          <path d="M16 11v14" stroke="#1F4D36" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
      <span className={`font-display text-2xl font-semibold ${light ? "text-cream" : "text-forest-900"}`}>
        morsel
      </span>
    </Link>
  );
}

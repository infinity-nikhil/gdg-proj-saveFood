import { LayoutDashboard, LogOut, Menu, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/format";
import { buttonStyles } from "./Button";
import { Logo } from "./Logo";

const navLinks = [
  { to: "/browse", label: "Find food" },
  { to: "/#how-it-works", label: "How it works" },
  { to: "/#impact", label: "Impact" },
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-full px-4 py-2 text-sm font-semibold transition",
      isActive && !location.hash ? "bg-forest-50 text-forest-700" : "text-muted hover:text-ink",
    );

  const actions = user ? (
    <>
      {user.role === "DONOR" && (
        <Link to="/listings/new" className={buttonStyles("accent", "sm")}>
          <Plus className="size-4" />
          Share food
        </Link>
      )}
      <Link to="/dashboard" className={buttonStyles("secondary", "sm")}>
        <LayoutDashboard className="size-4" />
        Dashboard
      </Link>
      <button onClick={handleLogout} className={buttonStyles("ghost", "sm")} aria-label="Sign out">
        <LogOut className="size-4" />
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className={buttonStyles("ghost", "sm")}>
        Sign in
      </Link>
      <Link to="/register" className={buttonStyles("primary", "sm")}>
        Join Morsel
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-cream/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">{actions}</div>

        <button
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-full hover:bg-forest-50 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="space-y-4 border-t border-line px-5 py-5 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">{actions}</div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 bg-forest-900 text-cream/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 md:flex-row md:items-end md:justify-between lg:px-8">
        <div className="max-w-sm space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed">
            A third of all food produced is never eaten. Morsel helps kitchens, bakeries and grocers
            pass their surplus to people who will.
          </p>
        </div>
        <div className="flex gap-8 text-sm">
          <Link to="/browse" className="hover:text-cream">Find food</Link>
          <Link to="/register" className="hover:text-cream">Become a donor</Link>
          <Link to="/#impact" className="hover:text-cream">Our impact</Link>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Morsel. Good food belongs on plates.
      </div>
    </footer>
  );
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToHash />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

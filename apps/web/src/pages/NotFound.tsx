import { Soup } from "lucide-react";
import { Link } from "react-router";
import { buttonStyles } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";

export function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <EmptyState
        icon={Soup}
        title="This page has been eaten"
        description="We couldn't find what you were looking for."
        action={<Link to="/" className={buttonStyles()}>Back home</Link>}
      />
    </div>
  );
}

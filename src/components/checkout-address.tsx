import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useState } from "react";

import { AuthDialog } from "@/components/auth-dialog";
import { useAuth } from "@/lib/auth-context";
import { formatAddress, hasAddress, useProfile } from "@/lib/profile";

export function CheckoutAddress() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading } = useProfile();
  const [open, setOpen] = useState(false);

  if (authLoading) return null;

  if (!user) {
    return (
      <>
        <section className="mt-6 rounded-md border border-border bg-card p-4">
          <p className="text-sm font-semibold">Sign in to use your saved delivery address</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-3 rounded-md bg-cta px-4 py-2 text-sm font-semibold text-cta-foreground"
          >
            Sign in
          </button>
        </section>
        <AuthDialog open={open} onOpenChange={setOpen} defaultMode="signin" />
      </>
    );
  }

  return (
    <section className="mt-6 rounded-md border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <MapPin className="mt-0.5 size-5 shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Deliver to {profile.full_name || user.email}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Loading your saved address…" : hasAddress(profile) ? formatAddress(profile) : "No delivery address saved yet."}
          </p>
        </div>
        <Link to="/account" className="shrink-0 text-sm font-semibold text-primary hover:underline">
          {hasAddress(profile) ? "Change" : "Add address"}
        </Link>
      </div>
    </section>
  );
}

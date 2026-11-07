import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { AuthDialog } from "@/components/auth-dialog";
import { formatAddress, hasAddress, useProfile } from "@/lib/profile";
import { useAuth } from "@/lib/auth-context";
import { isSupabaseConfigured } from "@/lib/cloud-config";

export function SignInCard() {
  const { user, loading } = useAuth();
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  if (user) {
    const name =
      (user.user_metadata?.["full_name"] as string | undefined) || profile.full_name || user.email;
    return (
      <article className="shop-card min-h-0">
        <h2>Welcome back, {name}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {hasAddress(profile) ? `Delivering to ${formatAddress(profile)}` : "Add a delivery address to speed up checkout."}
        </p>
        <Link
          to="/account"
          className="mt-4 block rounded-md bg-cta px-4 py-2 text-center text-sm font-semibold text-cta-foreground"
        >
          {hasAddress(profile) ? "Manage your address" : "Add delivery address"}
        </Link>
      </article>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <article className="shop-card min-h-0">
        <h2>Account services are temporarily unavailable</h2>
        <p className="mt-2 text-sm text-muted-foreground">Please try signing in again later.</p>
      </article>
    );
  }

  return (
    <>
      <article className="shop-card min-h-0">
        <h2>Sign in for the best experience</h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 block w-full rounded-md bg-cta px-4 py-2 text-center text-sm font-semibold text-cta-foreground"
        >
          Sign in securely
        </button>
      </article>
      <AuthDialog open={open} onOpenChange={setOpen} defaultMode="signin" />
    </>
  );
}

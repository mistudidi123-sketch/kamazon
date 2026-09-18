import { createFileRoute, Link } from "@tanstack/react-router";
import { KamazonLogo } from "@/components/kamazon-logo";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { emptyProfile, useProfile, type Profile } from "@/lib/profile";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Your Account & Delivery Address | Amazon Romania" },
      { name: "description", content: "Save your name, phone number, and delivery address so checkout is faster next time." },
      { property: "og:title", content: "Your Account & Delivery Address | Amazon Romania" },
      { property: "og:description", content: "Save your name, phone number, and delivery address so checkout is faster next time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

type ProfileForm = Profile;

function AccountPage() {
  const { user, signOut } = useAuth();
  const { profile, loading, save: saveProfile } = useProfile();
  const [form, setForm] = useState<ProfileForm>(emptyProfile);

  useEffect(() => {
    if (!loading) setForm(profile);
  }, [loading, profile]);

  const saving = saveProfile.isPending;

  const update = (key: keyof ProfileForm) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (!form.full_name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    try {
      await saveProfile.mutateAsync(form);
      toast.success("Your details are saved.");
    } catch {
      toast.error("Couldn't save your details. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <header className="bg-header px-4 py-3 text-header-foreground">
        <KamazonLogo />

      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="font-display text-2xl font-semibold">Your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Signed in as {user?.email}</p>

        <form className="mt-6 grid gap-4 rounded-md border border-border bg-card p-5 md:grid-cols-2" onSubmit={save}>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" value={form.full_name} onChange={update("full_name")} disabled={loading} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Mobile number</Label>
            <Input id="phone" value={form.phone} onChange={update("phone")} disabled={loading} inputMode="tel" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={form.country} onChange={update("country")} disabled={loading} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="address_line1">Address</Label>
            <Input id="address_line1" value={form.address_line1} onChange={update("address_line1")} disabled={loading} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="address_line2">Apartment, suite (optional)</Label>
            <Input id="address_line2" value={form.address_line2} onChange={update("address_line2")} disabled={loading} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={form.city} onChange={update("city")} disabled={loading} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="state">State / region</Label>
            <Input id="state" value={form.state} onChange={update("state")} disabled={loading} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="postal_code">Postal code</Label>
            <Input id="postal_code" value={form.postal_code} onChange={update("postal_code")} disabled={loading} />
          </div>

          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <Button type="submit" className="bg-cta text-cta-foreground hover:bg-cta/90" disabled={saving || loading}>
              {saving ? "Saving..." : "Save details"}
            </Button>
            <Button type="button" variant="outline" onClick={() => void signOut()}>
              Sign out
            </Button>
            <Link to="/" className="text-sm font-semibold text-primary hover:underline">
              Continue shopping
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

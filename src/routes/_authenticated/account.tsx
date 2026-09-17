import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

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

type ProfileForm = {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

const emptyForm: ProfileForm = {
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
};

function AccountPage() {
  const { user, signOut } = useAuth();
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase
      .from("profiles")
      .select("full_name, phone, address_line1, address_line2, city, state, postal_code, country")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) toast.error("Couldn't load your saved details.");
        if (data) {
          setForm({
            full_name: data.full_name ?? "",
            phone: data.phone ?? "",
            address_line1: data.address_line1 ?? "",
            address_line2: data.address_line2 ?? "",
            city: data.city ?? "",
            state: data.state ?? "",
            postal_code: data.postal_code ?? "",
            country: data.country ?? "",
          });
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const update = (key: keyof ProfileForm) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, email: user.email ?? null, ...form }, { onConflict: "id" });
    setSaving(false);
    if (error) {
      toast.error("Couldn't save your details. Please try again.");
      return;
    }
    toast.success("Your details are saved.");
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

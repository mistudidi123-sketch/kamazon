import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Banknote, Building2, Check, CreditCard, Loader2, Lock, Smartphone, Store, Truck, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { KamazonLogo } from "@/components/kamazon-logo";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatAddress, hasAddress, useProfile } from "@/lib/profile";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Select a payment method | Kamazon Checkout" },
      { name: "description", content: "Choose UPI, card, net banking, wallet or cash on delivery and review your Kamazon order summary before placing the order." },
      { property: "og:title", content: "Select a payment method | Kamazon Checkout" },
      { property: "og:description", content: "Choose UPI, card, net banking, wallet or cash on delivery and review your Kamazon order summary before placing the order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const methods = [
  { id: "upi", title: "UPI", icon: Smartphone, description: "Pay using any UPI app (Google Pay, PhonePe, Paytm, etc.)", detail: "user123@okicici" },
  { id: "card", title: "Credit or Debit Card", icon: CreditCard, description: "Visa, Mastercard, Rupay & more", detail: "**** **** **** 4587" },
  { id: "netbanking", title: "Net Banking", icon: Building2, description: "Pay using your bank's net banking facility", detail: "HDFC Bank" },
  { id: "wallet", title: "Wallet / Gift Card", icon: Wallet, description: "Use your wallet balance or gift card", detail: "Rs 250 balance" },
  { id: "cod", title: "Cash on Delivery", icon: Banknote, description: "Pay when you receive your order", detail: null },
] as const;

function rs(value: number) {
  return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
}

function Steps() {
  const items = [
    { label: "Shipping", state: "done" },
    { label: "Payment", state: "current" },
    { label: "Place Order", state: "todo" },
  ] as const;
  return (
    <ol className="flex items-start">
      {items.map((item, index) => (
        <li key={item.label} className="flex flex-1 items-start last:flex-none">
          <div className="flex w-20 flex-col items-center gap-2">
            <span
              className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                item.state === "current"
                  ? "bg-accent text-accent-foreground"
                  : item.state === "done"
                    ? "bg-muted-foreground text-background"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {item.state === "done" ? <Check className="size-4" /> : index + 1}
            </span>
            <span className={`text-sm ${item.state === "current" ? "font-bold text-accent" : "text-muted-foreground"}`}>{item.label}</span>
          </div>
          {index < items.length - 1 && <span className="mt-4 h-px flex-1 bg-border" />}
        </li>
      ))}
    </ol>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, itemCount, subtotal } = useCart();
  const { profile } = useProfile();
  const [selected, setSelected] = useState<string>("upi");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (itemCount === 0) navigate({ to: "/cart" });
  }, [itemCount, navigate]);

  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleContinue = () => {
    setPlacing(true);
    window.setTimeout(() => {
      setPlacing(false);
      toast.success("Payment method saved", { description: "Order placing is coming soon." });
    }, 900);
  };

  return (
    <div className="min-h-screen animate-in fade-in duration-500 bg-background font-body text-foreground">
      <header className="bg-header px-4 py-2 text-header-foreground">
        <KamazonLogo />
      </header>

      <main className="px-4 py-6 md:px-10 md:py-8">
        <div className="mx-auto max-w-5xl">
          <Steps />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section aria-label="Payment methods">
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Select a payment method</h1>
            <p className="mt-2 text-muted-foreground">Choose how you want to pay for your order.</p>

            <div className="mt-6 space-y-3">
              {methods.map((method) => {
                const active = selected === method.id;
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelected(method.id)}
                    aria-pressed={active}
                    className={`flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-all duration-300 ${
                      active ? "border-accent bg-accent/10 shadow-sm" : "border-border bg-card hover:border-muted-foreground/40"
                    }`}
                  >
                    <Icon className={`mt-1 size-7 shrink-0 ${active ? "text-accent" : "text-foreground"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-bold">{method.title}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{method.description}</span>
                      {method.detail && (
                        <span className="mt-2 flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">{method.detail}</span>
                          <span className="font-medium text-primary">Change</span>
                        </span>
                      )}
                    </span>
                    <span
                      className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        active ? "border-accent" : "border-muted-foreground/40"
                      }`}
                    >
                      {active && <span className="size-2.5 rounded-full bg-accent" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              onClick={handleContinue}
              disabled={placing}
              className="mt-7 h-14 w-full bg-cta text-base font-bold text-cta-foreground hover:bg-cta"
            >
              {placing ? <Loader2 className="size-5 animate-spin" /> : "Continue"}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="size-4" /> Your payment information is secure and encrypted.
            </p>
            <div className="mt-6">
              <Link to="/cart" className="text-sm font-semibold text-primary hover:underline">← Back to cart</Link>
            </div>
          </section>

          <aside aria-label="Order summary" className="h-fit rounded-lg border border-border bg-card p-5">
            <h2 className="font-display text-xl font-bold">Order Summary</h2>
            <div className="mt-4 space-y-4 border-b border-border pb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <img src={item.image} alt={item.name} className="size-16 shrink-0 rounded-md bg-muted object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">{rs(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <dl className="space-y-2 border-b border-border py-4 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-semibold">{rs(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Shipping Charges</dt><dd className="font-semibold">Rs 0</dd></div>
              <div className="flex justify-between"><dt>Tax (18%)</dt><dd className="font-semibold">{rs(tax)}</dd></div>
            </dl>
            <div className="flex items-center justify-between py-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-xl font-bold">{rs(total)}</span>
            </div>
            <div className="flex items-start gap-3 border-t border-border pt-4 text-sm">
              <Truck className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Delivering to</p>
                <p className="font-medium">{hasAddress(profile) ? formatAddress(profile) : "Add a delivery address on your account page"}</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

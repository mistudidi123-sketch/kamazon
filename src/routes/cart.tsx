import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, MapPin, Menu, Search, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Amazon Shopping Cart | Amazon Romania" },
      { name: "description", content: "Review items, update quantities, and see your Amazon Romania shopping cart subtotal." },
      { property: "og:title", content: "Amazon Shopping Cart | Amazon Romania" },
      { property: "og:description", content: "Review items, update quantities, and see your Amazon Romania shopping cart subtotal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function AmazonLogo() {
  return <Link to="/" className="amazon-logo" aria-label="Amazon home"><span>amazon</span><i aria-hidden="true" /></Link>;
}

function Header() {
  const { itemCount } = useCart();
  return (
    <header className="bg-header text-header-foreground">
      <div className="mx-auto flex min-h-15 max-w-[1500px] items-center gap-2 px-3 py-2">
        <AmazonLogo />
        <Link to="/" className="hidden items-end gap-1 px-2 py-1.5 leading-tight outline-focus md:flex">
          <MapPin className="mb-0.5 size-4" aria-hidden="true" />
          <span><small className="block text-[11px] text-header-muted">Deliver to</small><strong className="block text-sm">Romania</strong></span>
        </Link>
        <form className="flex min-w-0 flex-1 overflow-hidden rounded-md ring-2 ring-transparent focus-within:ring-accent" onSubmit={(event) => event.preventDefault()}>
          <Button type="button" variant="ghost" className="h-auto rounded-none bg-search-muted px-3 text-xs text-muted-foreground hover:bg-search-muted" aria-label="Select search category">All <ChevronDown className="size-3" /></Button>
          <input className="min-w-0 flex-1 bg-card px-3 py-2.5 text-sm text-foreground outline-none" placeholder="Search Amazon" aria-label="Search Amazon" />
          <Button type="submit" className="h-auto w-12 rounded-none bg-accent p-0 text-accent-foreground hover:bg-accent" aria-label="Search"><Search className="size-5" /></Button>
        </form>
        <Link to="/cart" className="relative flex items-end gap-1 px-2 py-1.5 font-semibold outline-focus" aria-label={`Cart, ${itemCount} items`}>
          <ShoppingCart className="size-8" /><span className="absolute left-7 top-0 text-sm text-accent">{itemCount}</span><span className="hidden text-sm sm:block">Cart</span>
        </Link>
      </div>
      <div className="bg-subnav px-3 py-2 text-sm font-semibold"><div className="mx-auto flex max-w-[1500px] items-center gap-2"><Menu className="size-5" /> All</div></div>
      <div className="bg-subnav/90 px-4 py-3 text-sm md:hidden"><span className="flex items-center gap-2"><MapPin className="size-5" /> Deliver to Romania <ChevronDown className="size-4" /></span></div>
    </header>
  );
}

function Price({ value }: { value: number }) {
  const [whole, cents] = value.toFixed(2).split(".");
  return <span className="whitespace-nowrap font-bold"><span className="text-xl">{Number(whole).toLocaleString("ro-RO")}</span><sup className="text-xs">{cents}</sup><span className="ml-1 text-sm">lei</span></span>;
}

function CartPage() {
  const { cart, itemCount, subtotal, changeQuantity, removeItem } = useCart();
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Header />
      <nav aria-label="Cart sections" className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1100px] gap-6 px-5 py-3 text-sm font-semibold sm:text-base">
          <span className="border-b-2 border-accent pb-2">Cart</span><button type="button">Buy Again</button><button type="button">Whole Foods code</button>
        </div>
      </nav>

      <main className="mx-auto max-w-[1100px] px-4 py-5 md:py-8">
        <section className="overflow-hidden rounded-md border-2 border-accent bg-card" aria-label="Important cart messages">
          <button type="button" className="flex w-full items-center gap-4 p-4 text-left font-bold sm:text-lg"><span className="h-12 w-2 shrink-0 bg-accent" /><span className="flex-1">Important messages for items in your Cart</span><ChevronRight className="size-6" /></button>
        </section>

        <section className="mt-6 border-b border-border pb-6">
          <p className="text-2xl">Subtotal <Price value={subtotal} /></p>
          <Button type="button" disabled={itemCount === 0} className="mt-5 h-12 w-full bg-cta text-base text-cta-foreground shadow-sm hover:bg-cta sm:max-w-xl">Proceed to checkout ({itemCount} {itemCount === 1 ? "item" : "items"})</Button>
          <label className="mt-5 flex cursor-pointer items-center gap-3 text-base"><input type="checkbox" className="size-6 accent-[var(--cta)]" /><span aria-hidden="true">🎁</span> This order contains a gift</label>
        </section>

        {cart.length === 0 ? (
          <section className="bg-card px-5 py-14 text-center"><ShoppingCart className="mx-auto size-12 text-muted-foreground" /><h1 className="mt-4 font-display text-2xl font-semibold">Your Amazon Cart is empty</h1><Button asChild className="mt-5 bg-cta text-cta-foreground hover:bg-cta"><Link to="/">Continue shopping</Link></Button></section>
        ) : (
          <section aria-label="Shopping cart items" className="divide-y divide-border bg-card">
            {cart.map((item) => (
              <article key={item.id} className="grid grid-cols-[104px_1fr] gap-4 py-6 sm:grid-cols-[150px_1fr_auto]">
                <img src={item.image} alt={item.name} className={`aspect-square w-full rounded-md bg-muted object-cover ${item.imageClass ?? "object-center"}`} />
                <div className="min-w-0">
                  <h2 className="text-base font-semibold leading-6 sm:text-lg">{item.name}</h2>
                  <div className="mt-2 sm:hidden"><Price value={item.price} /></div>
                  <p className="mt-2 text-sm font-semibold text-green-700">In Stock</p>
                  <p className="mt-1 text-xs text-muted-foreground">Shipped from: <span className="text-primary">Amazon Romania</span></p>
                  <p className="mt-1 text-sm"><strong>Color:</strong> Assorted</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <div className="flex h-10 items-center rounded-md border border-border shadow-sm">
                      <Button type="button" variant="ghost" size="icon" className="h-9" onClick={() => changeQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}>−</Button>
                      <span className="w-8 text-center font-semibold" aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                      <Button type="button" variant="ghost" size="icon" className="h-9" onClick={() => changeQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}>+</Button>
                    </div>
                    <Button type="button" variant="outline" className="h-10" onClick={() => removeItem(item.id)}>Delete</Button>
                    <Button type="button" variant="outline" className="h-10">Save for later</Button>
                  </div>
                </div>
                <div className="hidden text-right sm:block"><Price value={item.price * item.quantity} /></div>
              </article>
            ))}
          </section>
        )}

        <div className="mt-7"><Button asChild variant="outline"><Link to="/">← Continue shopping</Link></Button></div>
      </main>
    </div>
  );
}
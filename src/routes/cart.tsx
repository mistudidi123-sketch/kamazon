import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Menu, ShoppingCart } from "lucide-react";

import { AccountNavLink } from "@/components/account-nav-link";
import { CartNavLink } from "@/components/cart-nav-link";
import { CheckoutAddress } from "@/components/checkout-address";
import { DiwaliBar } from "@/components/diwali-bar";
import { LocationSearch } from "@/components/location-search";
import { LocationPicker } from "@/components/location-picker";
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


function Header() {
  return (
    <header className="bg-header text-header-foreground">
      <DiwaliBar />
      <div className="flex min-h-15 items-center gap-2 px-3 py-2">
        <KamazonLogo />
        <LocationPicker className="hidden md:flex" />
        <form className="flex min-w-0 flex-1 overflow-hidden rounded-md ring-2 ring-transparent focus-within:ring-accent" onSubmit={(event) => event.preventDefault()}>
          <Button type="button" variant="ghost" className="h-auto rounded-none bg-search-muted px-3 text-xs text-muted-foreground hover:bg-search-muted" aria-label="Select search category">All <ChevronDown className="size-3" /></Button>
          <input className="min-w-0 flex-1 bg-card px-3 py-2.5 text-sm text-foreground outline-none" placeholder="Search Amazon" aria-label="Search Amazon" />
          <Button type="submit" className="h-auto w-12 rounded-none bg-accent p-0 text-accent-foreground hover:bg-accent" aria-label="Search"><Search className="size-5" /></Button>
        </form>
        <AccountNavLink className="hidden lg:block" />
        <CartNavLink />
      </div>
      <div className="bg-subnav px-3 py-2 text-sm font-semibold"><div className="flex items-center gap-2"><Menu className="size-5" /> All</div></div>
      <div className="bg-subnav/90 px-2 py-1 text-sm md:hidden"><LocationPicker className="flex" /></div>
    </header>
  );
}

function Price({ value }: { value: number }) {
  const [whole, cents] = value.toFixed(2).split(".");
  return <span className="whitespace-nowrap font-bold"><span className="mr-1 text-sm">Rs</span><span className="text-xl">{Number(whole).toLocaleString("en-IN")}</span><sup className="text-xs">{cents}</sup></span>;
}

function CartPage() {
  const { cart, saved, itemCount, subtotal, changeQuantity, removeItem, saveForLater, moveToCart, removeSaved } = useCart();
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Header />
      <nav aria-label="Cart sections" className="border-b border-border bg-card">
        <div className="flex gap-6 px-5 py-3 text-sm font-semibold sm:text-base">
          <span className="border-b-2 border-accent pb-2">Cart</span><button type="button">Buy Again</button><button type="button">Whole Foods code</button>
        </div>
      </nav>

      <main className="grid items-start gap-5 px-4 py-5 md:px-6 md:py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
          <section className="overflow-hidden rounded-lg border-2 border-accent bg-card" aria-label="Important cart messages">
            <button type="button" className="flex w-full items-center gap-4 p-4 text-left font-bold sm:text-lg"><span className="h-12 w-2 shrink-0 bg-accent" /><span className="flex-1">Important messages for items in your Cart</span><ChevronRight className="size-6" /></button>
          </section>

          <CheckoutAddress />

          <section className="rounded-lg border border-border bg-card px-5 py-5 shadow-sm" aria-label="Shopping cart items">
            <div className="border-b border-border pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
                <span className="diwali-deal-tag">Diwali Special</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
            </div>

            {cart.length === 0 ? (
              <div className="py-14 text-center"><ShoppingCart className="mx-auto size-12 text-muted-foreground" /><h2 className="mt-4 font-display text-2xl font-semibold">Your Kamazon Cart is empty</h2><Button asChild className="mt-5 bg-cta text-cta-foreground hover:bg-cta"><Link to="/">Continue shopping</Link></Button></div>
            ) : (
              <>
                <div className="divide-y divide-border">
                  {cart.map((item) => (
                    <article key={item.id} className="grid grid-cols-[104px_1fr] gap-4 py-6 sm:grid-cols-[150px_1fr_auto]">
                      <img src={item.image} alt={item.name} className={`aspect-square w-full rounded-md bg-muted object-cover ${item.imageClass ?? "object-center"}`} />
                      <div className="min-w-0">
                        <h2 className="text-base font-semibold leading-6 sm:text-lg">{item.name}</h2>
                        <div className="mt-2 sm:hidden"><Price value={item.price} /></div>
                        <p className="mt-2 text-sm font-semibold text-green-700">In Stock</p>
                        <p className="mt-1 text-xs text-muted-foreground">Shipped from: <span className="text-primary">Kamazon</span></p>
                        <p className="mt-1 text-sm"><strong>Color:</strong> Assorted</p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <div className="flex h-10 items-center rounded-md border border-border shadow-sm">
                            <Button type="button" variant="ghost" size="icon" className="h-9" onClick={() => changeQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}>−</Button>
                            <span className="w-8 text-center font-semibold" aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-9" onClick={() => changeQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}>+</Button>
                          </div>
                          <Button type="button" variant="outline" className="h-10" onClick={() => removeItem(item.id)}>Delete</Button>
                          <Button type="button" variant="outline" className="h-10" onClick={() => saveForLater(item.id)}>Save for later</Button>
                        </div>
                      </div>
                      <div className="hidden text-right sm:block"><Price value={item.price * item.quantity} /></div>
                    </article>
                  ))}
                </div>
                <p className="border-t border-border pt-4 text-right text-lg">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}): <Price value={subtotal} /></p>
              </>
            )}
          </section>

          {saved.length > 0 && (
            <section aria-label="Saved for later" className="rounded-lg border border-border bg-card px-5 py-5 shadow-sm">
              <h2 className="font-display text-xl font-semibold">Saved for later ({saved.length} {saved.length === 1 ? "item" : "items"})</h2>
              <div className="mt-4 divide-y divide-border">
                {saved.map((item) => (
                  <article key={item.id} className="grid grid-cols-[88px_1fr] gap-4 py-5 sm:grid-cols-[120px_1fr_auto]">
                    <img src={item.image} alt={item.name} className={`aspect-square w-full rounded-md bg-muted object-cover ${item.imageClass ?? "object-center"}`} />
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold leading-6">{item.name}</h3>
                      <div className="mt-2 sm:hidden"><Price value={item.price} /></div>
                      <p className="mt-1 text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button type="button" variant="outline" className="h-10" onClick={() => moveToCart(item.id)}>Move to cart</Button>
                        <Button type="button" variant="outline" className="h-10" onClick={() => removeSaved(item.id)}>Delete</Button>
                      </div>
                    </div>
                    <div className="hidden text-right sm:block"><Price value={item.price * item.quantity} /></div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="rounded-lg border border-border bg-card px-5 py-5 shadow-sm lg:sticky lg:top-4" aria-label="Order summary">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xl font-bold">Subtotal <span className="text-base font-normal text-muted-foreground">({itemCount} {itemCount === 1 ? "item" : "items"})</span></p>
            <Price value={subtotal} />
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" className="size-5 accent-[var(--cta)]" /><span aria-hidden="true">🎁</span> This order contains a gift</label>

          {itemCount === 0 ? (
            <Button type="button" disabled className="mt-5 h-12 w-full rounded-full bg-cta text-base font-bold text-cta-foreground hover:bg-cta">Proceed to checkout (0 items)</Button>
          ) : (
            <Button asChild className="mt-5 h-12 w-full rounded-full bg-cta text-base font-bold text-cta-foreground shadow-sm transition-transform hover:bg-cta active:scale-[0.99]">
              <Link to="/checkout" preload="intent">Proceed to checkout ({itemCount} {itemCount === 1 ? "item" : "items"})</Link>
            </Button>
          )}
          <Button asChild variant="outline" className="mt-3 h-12 w-full rounded-full text-base"><Link to="/">Continue shopping</Link></Button>

          <div className="mt-6 border-t border-border pt-5">
            <h2 className="text-base font-bold">Apply promo code</h2>
            <form className="mt-3 flex gap-2" onSubmit={(event) => event.preventDefault()}>
              <input className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-accent" placeholder="Enter code" aria-label="Promo code" />
              <Button type="submit" variant="outline" className="h-10">Apply</Button>
            </form>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <h2 className="text-base font-bold">Order summary</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between"><dt>Items ({itemCount})</dt><dd className="font-semibold">Rs {subtotal.toLocaleString("en-IN")}</dd></div>
              <div className="flex items-center justify-between"><dt>Delivery Charges</dt><dd className="font-semibold">Rs 0</dd></div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-lg font-bold"><span>Total</span><Price value={subtotal} /></div>
          </div>

          <p className="mt-5 rounded-md bg-muted px-3 py-3 text-xs text-muted-foreground">You can review this order before paying.</p>
        </aside>
      </main>

    </div>
  );
}
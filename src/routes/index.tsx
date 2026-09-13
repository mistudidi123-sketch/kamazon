import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  MapPin,
  Menu,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import categoryGrid from "@/assets/category-grid.jpg";
import electronicsGrid from "@/assets/electronics-grid.jpg";
import globalShipping from "@/assets/global-shipping.jpg";
import refreshSpace from "@/assets/refresh-space.jpg";
import valentinesGiftStack from "@/assets/valentines-gift-stack.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amazon Romania | Valentine's Day Deals" },
      {
        name: "description",
        content: "Explore Valentine's gifts, electronics, home essentials, and global delivery offers on Amazon Romania.",
      },
      { property: "og:title", content: "Amazon Romania | Valentine's Day Deals" },
      {
        property: "og:description",
        content: "Explore Valentine's gifts, electronics, home essentials, and global delivery offers on Amazon Romania.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = [
  "Today's Deals",
  "Customer Service",
  "Registry",
  "Gift Cards",
  "Sell",
];

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  imagePosition?: string;
};

type CartLine = Product & { quantity: number };

const products: Record<string, Product> = {
  romance: {
    id: "romance",
    name: "The Romance Gift Set",
    price: 189,
    image: valentinesGiftStack,
  },
  trainers: {
    id: "trainers",
    name: "CloudRun Trainers",
    price: 289,
    image: categoryGrid,
    imagePosition: "left top",
  },
  lamp: {
    id: "lamp",
    name: "Aura Ceramic Table Lamp",
    price: 142,
    image: refreshSpace,
    imagePosition: "left center",
  },
  headphones: {
    id: "headphones",
    name: "Aurora ANC Headphones",
    price: 489,
    image: electronicsGrid,
    imagePosition: "left center",
  },
};

const formatPrice = (price: number) => `${price.toLocaleString("ro-RO")} lei`;

function AmazonLogo() {
  return (
    <a href="#" className="amazon-logo" aria-label="Amazon home">
      <span>amazon</span>
      <i aria-hidden="true" />
    </a>
  );
}

function Index() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    if (!cartOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const changeQuantity = (id: string, amount: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <header className="bg-header text-header-foreground">
        <div className="mx-auto flex min-h-15 max-w-[1500px] items-center gap-2 px-3 py-2">
          <AmazonLogo />

          <a href="#" className="hidden items-end gap-1 px-2 py-1.5 leading-tight outline-focus md:flex">
            <MapPin className="mb-0.5 size-4" aria-hidden="true" />
            <span>
              <small className="block text-[11px] text-header-muted">Deliver to</small>
              <strong className="block text-sm">Romania</strong>
            </span>
          </a>

          <form className="flex min-w-0 flex-1 overflow-hidden rounded-md ring-2 ring-transparent focus-within:ring-accent" onSubmit={(event) => event.preventDefault()}>
            <button type="button" className="flex items-center gap-2 bg-search-muted px-3 text-xs text-muted-foreground" aria-label="Select search category">
              All <ChevronDown className="size-3" aria-hidden="true" />
            </button>
            <input className="min-w-0 flex-1 bg-card px-3 py-2.5 text-sm text-foreground outline-none" placeholder="Search Amazon" aria-label="Search Amazon" />
            <button type="submit" className="grid w-12 place-items-center bg-accent text-accent-foreground" aria-label="Search">
              <Search className="size-5" />
            </button>
          </form>

          <a href="#" className="hidden items-center gap-1 px-2 py-2 text-sm font-semibold outline-focus xl:flex">
            <span aria-hidden="true">🇺🇸</span> EN <ChevronDown className="size-3" />
          </a>
          <a href="#" className="hidden px-2 py-1.5 leading-tight outline-focus lg:block">
            <small className="block text-[11px]">Hello, sign in</small>
            <strong className="flex items-center text-sm">Account &amp; Lists <ChevronDown className="ml-1 size-3" /></strong>
          </a>
          <a href="#" className="hidden px-2 py-1.5 leading-tight outline-focus lg:block">
            <small className="block text-[11px]">Returns</small>
            <strong className="block text-sm">&amp; Orders</strong>
          </a>
          <button type="button" onClick={() => setCartOpen(true)} className="relative flex items-end gap-1 px-2 py-1.5 font-semibold outline-focus" aria-label={`Open cart, ${itemCount} items`}>
            <ShoppingCart className="size-8" />
            <span className="absolute left-7 top-0 text-sm text-accent" aria-hidden="true">{itemCount}</span>
            <span className="hidden text-sm sm:block">Cart</span>
          </button>
        </div>

        <nav className="bg-subnav text-sm font-semibold">
          <div className="mx-auto flex max-w-[1500px] items-center gap-1 overflow-x-auto px-3">
            <a href="#" className="flex shrink-0 items-center gap-1 px-2 py-2 outline-focus"><Menu className="size-5" /> All</a>
            {navItems.map((item) => <a key={item} href="#" className="shrink-0 px-2 py-2 outline-focus">{item}</a>)}
            <a href="#" className="ml-auto hidden shrink-0 px-2 py-2 outline-focus md:block">Shop deals in Electronics</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative mx-auto max-w-[1500px] overflow-hidden bg-hero text-hero-foreground">
          <div className="absolute left-5 top-0 z-20 w-[430px] max-w-[calc(100%-2.5rem)] rounded-b-md bg-card p-4 text-card-foreground shadow-xl">
            <p className="text-sm font-semibold leading-5">We're showing you items that ship to RO. To see items that ship to a different country, change your delivery address.</p>
            <div className="mt-3 flex justify-end gap-3">
              <button type="button" className="rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold shadow-sm">Don't Change</button>
              <button type="button" className="rounded-md bg-cta px-4 py-2 text-sm font-semibold text-cta-foreground shadow-sm">Change Address</button>
            </div>
          </div>

          <div className="grid min-h-[470px] items-center gap-6 px-7 pb-20 pt-36 md:grid-cols-[0.86fr_1.14fr] md:px-16 md:pb-16 md:pt-20">
            <div className="relative z-10 text-center md:text-left">
              <p className="inline-flex rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase text-accent-foreground">Seasonal campaign</p>
              <h1 className="mt-4 max-w-[17ch] font-display text-4xl font-semibold leading-tight md:text-5xl">Gifts that say it better than words.</h1>
              <p className="mt-3 max-w-[46ch] text-base text-hero-muted md:text-lg">Explore Valentine's Day picks for every kind of love, delivered across Romania.</p>
              <button type="button" onClick={() => addToCart(products.romance)} className="mt-6 inline-flex rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-foreground outline-focus">Add gift set · 189 lei</button>
            </div>
            <div className="relative mx-auto w-full max-w-[680px]">
              <img src={valentinesGiftStack} width={1200} height={900} alt="Perfume, roses, chocolate, and jewelry arranged as Valentine's gifts" className="aspect-[4/3] w-full object-contain" />
            </div>
          </div>
          <button type="button" className="slider-control left-4" aria-label="Previous Valentine's promotion"><ChevronLeft /></button>
          <button type="button" className="slider-control right-4" aria-label="Next Valentine's promotion"><ChevronRight /></button>
        </section>

        <section aria-label="Featured shopping" className="relative z-10 mx-auto -mt-12 grid max-w-[1500px] gap-5 px-5 pb-10 md:grid-cols-2 xl:grid-cols-4">
          <article className="shop-card">
            <h2>Shop by Category</h2>
            <img src={categoryGrid} width={1200} height={1200} loading="lazy" alt="Shoes, headphones, home comforts, and beauty products" className="mt-3 aspect-square w-full object-cover" />
            <div className="mt-2 grid grid-cols-2 text-center text-xs font-semibold"><span>Computers &amp; Accessories</span><span>Electronics</span><span className="pt-2">Home</span><span className="pt-2">Beauty</span></div>
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-sm font-bold">289 lei</span>
              <button type="button" onClick={() => addToCart(products.trainers)} className="rounded-md bg-cta px-3 py-2 text-xs font-bold text-cta-foreground">Add to cart</button>
            </div>
          </article>

          <article className="shop-card">
            <h2>Refresh your space</h2>
            <img src={refreshSpace} width={1200} height={800} loading="lazy" alt="Warm ceramic lamp and knitted throw in a calm living space" className="mt-3 aspect-[4/3] w-full object-cover" />
            <div className="mt-2 flex justify-between text-xs font-semibold"><span>Lighting</span><span>Home comforts</span></div>
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-sm font-bold">142 lei</span>
              <button type="button" onClick={() => addToCart(products.lamp)} className="rounded-md bg-cta px-3 py-2 text-xs font-bold text-cta-foreground">Add to cart</button>
            </div>
          </article>

          <article className="shop-card">
            <h2>Electronics</h2>
            <img src={electronicsGrid} width={1500} height={700} loading="lazy" alt="Wireless headphones, smartwatch, and portable speaker" className="mt-3 aspect-[4/3] w-full object-cover" />
            <p className="mt-3 text-sm text-muted-foreground">Headphones, wearables and portable audio.</p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-sm font-bold">489 lei</span>
              <button type="button" onClick={() => addToCart(products.headphones)} className="rounded-md bg-cta px-3 py-2 text-xs font-bold text-cta-foreground">Add to cart</button>
            </div>
          </article>

          <div className="grid gap-5">
            <article className="shop-card min-h-0">
              <h2>Sign in for the best experience</h2>
              <a href="#" className="mt-4 block rounded-md bg-cta px-4 py-2 text-center text-sm font-semibold text-cta-foreground">Sign in securely</a>
            </article>
            <article className="overflow-hidden bg-promo text-promo-foreground shadow-sm">
              <div className="px-5 pt-5 text-center"><h2 className="font-display text-xl font-semibold">We ship over 45 million products around the world</h2></div>
              <img src={globalShipping} width={1000} height={650} loading="lazy" alt="Packages and a world map representing global shipping" className="mt-3 aspect-[16/9] w-full object-cover" />
            </article>
          </div>
        </section>
      </main>

      {cartOpen && (
        <div className="fixed inset-0 z-[100]" role="presentation">
          <button type="button" className="absolute inset-0 bg-overlay" onClick={() => setCartOpen(false)} aria-label="Close cart" />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-card text-card-foreground shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 id="cart-title" className="font-display text-xl font-semibold">Your cart</h2>
                <p className="text-sm text-muted-foreground">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} className="grid size-10 place-items-center rounded-full hover:bg-muted" aria-label="Close cart"><X className="size-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <div className="grid min-h-64 place-items-center text-center">
                  <div>
                    <ShoppingCart className="mx-auto size-10 text-muted-foreground" />
                    <h3 className="mt-4 font-display text-lg font-semibold">Your cart is empty</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Add a featured item to get started.</p>
                    <button type="button" onClick={() => setCartOpen(false)} className="mt-5 rounded-md bg-cta px-4 py-2.5 text-sm font-bold text-cta-foreground">Continue shopping</button>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {cart.map((item) => (
                    <li key={item.id} className="flex gap-4 py-4">
                      <img src={item.image} alt="" className="size-20 shrink-0 rounded-md bg-muted object-cover" style={{ objectPosition: item.imagePosition }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div><h3 className="text-sm font-bold leading-5">{item.name}</h3><p className="mt-0.5 text-sm text-muted-foreground">{formatPrice(item.price)} each</p></div>
                          <button type="button" onClick={() => removeItem(item.id)} className="grid size-8 shrink-0 place-items-center text-muted-foreground hover:text-destructive" aria-label={`Remove ${item.name}`}><Trash2 className="size-4" /></button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-md border border-border">
                            <button type="button" onClick={() => changeQuantity(item.id, -1)} className="grid size-8 place-items-center" aria-label={`Decrease ${item.name} quantity`}><Minus className="size-3.5" /></button>
                            <span className="w-8 text-center text-sm font-bold" aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                            <button type="button" onClick={() => changeQuantity(item.id, 1)} className="grid size-8 place-items-center" aria-label={`Increase ${item.name} quantity`}><Plus className="size-3.5" /></button>
                          </div>
                          <strong className="text-sm">{formatPrice(item.price * item.quantity)}</strong>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border bg-muted/40 px-5 py-5">
                <div className="flex justify-between text-sm"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
                <div className="mt-2 flex justify-between text-sm"><span>Delivery</span><strong>Free</strong></div>
                <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg"><strong>Total</strong><strong>{formatPrice(subtotal)}</strong></div>
                <button type="button" className="mt-5 w-full rounded-md bg-cta px-4 py-3 text-sm font-bold text-cta-foreground">Proceed to checkout</button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
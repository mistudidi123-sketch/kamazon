import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  
  Menu,
  Search,
  ShoppingCart,
} from "lucide-react";

import { LocationPicker } from "@/components/location-picker";
import categoryGrid from "@/assets/category-grid.jpg";
import electronicsGrid from "@/assets/electronics-grid.jpg";
import globalShipping from "@/assets/global-shipping.jpg";
import refreshSpace from "@/assets/refresh-space.jpg";
import valentinesGiftStack from "@/assets/valentines-gift-stack.jpg";
import { useCart, type Product } from "@/lib/cart-context";

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

const products = {
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
    imageClass: "object-left-top",
  },
  lamp: {
    id: "lamp",
    name: "Aura Ceramic Table Lamp",
    price: 142,
    image: refreshSpace,
    imageClass: "object-left",
  },
  headphones: {
    id: "headphones",
    name: "Aurora ANC Headphones",
    price: 489,
    image: electronicsGrid,
    imageClass: "object-left",
  },
} satisfies Record<string, Product>;

function AmazonLogo() {
  return (
    <Link to="/" className="amazon-logo" aria-label="Amazon home">
      <span>amazon</span>
      <i aria-hidden="true" />
    </Link>
  );
}

function Index() {
  const { addToCart: addCartItem, itemCount } = useCart();
  const navigate = useNavigate({ from: "/" });

  const addToCart = (product: Product) => {
    addCartItem(product);
    navigate({ to: "/cart" });
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <header className="bg-header text-header-foreground">
        <div className="mx-auto flex min-h-15 max-w-[1500px] items-center gap-2 px-3 py-2">
          <AmazonLogo />

          <LocationPicker className="hidden md:flex" />

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
          <Link to="/cart" className="relative flex items-end gap-1 px-2 py-1.5 font-semibold outline-focus" aria-label={`Open cart, ${itemCount} items`}>
            <ShoppingCart className="size-8" />
            <span className="absolute left-7 top-0 text-sm text-accent" aria-hidden="true">{itemCount}</span>
            <span className="hidden text-sm sm:block">Cart</span>
          </Link>
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
              <button type="button" onClick={() => addToCart(products.romance)} className="mt-6 inline-flex rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-foreground outline-focus">Add gift set · Rs 189</button>
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
              <span className="text-sm font-bold">Rs 289</span>
              <button type="button" onClick={() => addToCart(products.trainers)} className="rounded-md bg-cta px-3 py-2 text-xs font-bold text-cta-foreground">Add to cart</button>
            </div>
          </article>

          <article className="shop-card">
            <h2>Refresh your space</h2>
            <img src={refreshSpace} width={1200} height={800} loading="lazy" alt="Warm ceramic lamp and knitted throw in a calm living space" className="mt-3 aspect-[4/3] w-full object-cover" />
            <div className="mt-2 flex justify-between text-xs font-semibold"><span>Lighting</span><span>Home comforts</span></div>
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-sm font-bold">Rs 142</span>
              <button type="button" onClick={() => addToCart(products.lamp)} className="rounded-md bg-cta px-3 py-2 text-xs font-bold text-cta-foreground">Add to cart</button>
            </div>
          </article>

          <article className="shop-card">
            <h2>Electronics</h2>
            <img src={electronicsGrid} width={1500} height={700} loading="lazy" alt="Wireless headphones, smartwatch, and portable speaker" className="mt-3 aspect-[4/3] w-full object-cover" />
            <p className="mt-3 text-sm text-muted-foreground">Headphones, wearables and portable audio.</p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-sm font-bold">Rs 489</span>
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

    </div>
  );
}
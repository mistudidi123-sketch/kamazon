import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { KamazonLogo } from "@/components/kamazon-logo";
import { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

import { AccountNavLink } from "@/components/account-nav-link";
import { DiwaliBar } from "@/components/diwali-bar";
import { ProductSearch } from "@/components/product-search";
import { SignInCard } from "@/components/sign-in-card";
import { CartNavLink } from "@/components/cart-nav-link";
import { LocationPicker } from "@/components/location-picker";
import { CountrySelector } from "@/components/country-selector";
import { Button } from "@/components/ui/button";
import categoryGrid from "@/assets/category-grid.jpg";
import diwaliGifts from "@/assets/diwali-gifts.jpg";
import diwaliHero from "@/assets/diwali-hero.jpg";
import electronicsGrid from "@/assets/electronics-grid.jpg";
import globalShipping from "@/assets/global-shipping.jpg";
import refreshSpace from "@/assets/refresh-space.jpg";
import { useCart, type Product } from "@/lib/cart-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amazon Romania | Diwali Special — Festive Gifts & Deals" },
      {
        name: "description",
        content: "Celebrate Diwali with festive hampers, sweets, décor and electronics deals — delivered in time for the festival of lights.",
      },
      { property: "og:title", content: "Amazon Romania | Diwali Special — Festive Gifts & Deals" },
      {
        property: "og:description",
        content: "Celebrate Diwali with festive hampers, sweets, décor and electronics deals — delivered in time for the festival of lights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = [
  "Diwali Store",
  "Festive Gifts",
  "Today's Deals",
  "Customer Service",
  "Gift Cards",
  "Sell",
];

const products = {
  hamper: {
    id: "hamper",
    name: "Diwali Gift Hamper",
    price: 189,
    image: diwaliGifts,
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


function Index() {
  const { addToCart: addCartItem, locationChanged, locationReady } = useCart();
  const navigate = useNavigate({ from: "/" });
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [addressNoticeDismissed, setAddressNoticeDismissed] = useState(false);

  const addToCart = (product: Product) => {
    addCartItem(product);
    navigate({ to: "/cart" });
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <DiwaliBar />
      <header className="bg-header text-header-foreground">
        <div className="flex min-h-15 items-center gap-2 px-3 py-2">
          <KamazonLogo />

          <LocationPicker
            className="hidden md:flex"
            open={locationPickerOpen}
            onOpenChange={setLocationPickerOpen}
          />

          <ProductSearch />

          <CountrySelector />
          <AccountNavLink className="hidden lg:block" />
          <a href="#" className="hidden px-2 py-1.5 leading-tight outline-focus lg:block">
            <small className="block text-[11px]">Returns</small>
            <strong className="block text-sm">&amp; Orders</strong>
          </a>
          <CartNavLink />
        </div>

        <nav className="bg-subnav text-sm font-semibold">
          <div className="flex items-center gap-1 overflow-x-auto px-3">
            <a href="#" className="flex shrink-0 items-center gap-1 px-2 py-2 outline-focus"><Menu className="size-5" /> All</a>
            {navItems.map((item) => <a key={item} href="#" className="shrink-0 px-2 py-2 outline-focus">{item}</a>)}
            <a href="#" className="ml-auto hidden shrink-0 px-2 py-2 outline-focus md:block">Shop Diwali deals in Electronics</a>
          </div>
        </nav>
      </header>
      <div className="bg-subnav/90 px-2 py-1 text-sm md:hidden">
        <LocationPicker
          className="flex"
          open={locationPickerOpen}
          onOpenChange={setLocationPickerOpen}
        />
      </div>

      <main>
        <section className="relative overflow-hidden diwali-hero-bg text-hero-foreground">
          {locationReady && !locationChanged && !addressNoticeDismissed && (
            <div className="absolute left-5 top-0 z-20 w-[430px] max-w-[calc(100%-2.5rem)] rounded-b-md bg-card p-4 text-card-foreground shadow-xl">
              <p className="text-sm font-semibold leading-5">We're showing you items that ship to RO. To see items that ship to a different country, change your delivery address.</p>
              <div className="mt-3 flex flex-wrap justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setAddressNoticeDismissed(true)}>
                  Don't Change
                </Button>
                <Button type="button" className="bg-cta text-cta-foreground hover:bg-cta/90" onClick={() => setLocationPickerOpen(true)}>
                  Change Address
                </Button>
              </div>
            </div>
          )}

          <div className="grid min-h-[470px] items-center gap-6 px-7 pb-20 pt-36 md:grid-cols-[0.86fr_1.14fr] md:px-16 md:pb-16 md:pt-20">
            <div className="relative z-10 text-center md:text-left">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-diwali-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-diwali-night-deep">✨ Diwali Special · November 8</p>
              <h1 className="mt-4 max-w-[18ch] font-display text-4xl font-semibold leading-tight md:text-5xl">
                Light up your <span className="diwali-gold-text">Diwali</span> with gifts that glow.
              </h1>
              <p className="mt-3 max-w-[46ch] text-base text-hero-muted md:text-lg">Diyas, sweets, festive hampers and décor — handpicked for the festival of lights, delivered in time for Diwali night.</p>
              <button type="button" onClick={() => addToCart(products.hamper)} className="mt-6 inline-flex rounded-md bg-diwali-gold px-5 py-3 text-sm font-bold text-diwali-night-deep outline-focus transition-colors hover:bg-diwali-gold-deep">Shop the Diwali hamper · Rs 189</button>
            </div>
            <div className="relative mx-auto w-full max-w-[680px]">
              <img src={diwaliHero} width={1600} height={1008} alt="Glowing diyas, marigold flowers and golden gift boxes under festive fireworks" className="aspect-[4/3] w-full rounded-xl object-cover shadow-2xl" />
            </div>
          </div>
          <button type="button" className="slider-control left-4" aria-label="Previous Diwali promotion"><ChevronLeft /></button>
          <button type="button" className="slider-control right-4" aria-label="Next Diwali promotion"><ChevronRight /></button>
        </section>

        <section aria-label="Featured shopping" className="relative z-10 -mt-12 grid gap-5 px-5 pb-10 md:grid-cols-2 xl:grid-cols-4">
          <article className="shop-card">
            <span className="diwali-deal-tag">Diwali Deal</span>
            <h2 className="mt-2">Diwali Shop by Category</h2>
            <img src={categoryGrid} width={1200} height={1200} loading="lazy" alt="Shoes, headphones, home comforts, and beauty products" className="mt-3 aspect-square w-full rounded-md object-cover" />
            <div className="mt-2 grid grid-cols-2 text-center text-xs font-semibold"><span>Computers &amp; Accessories</span><span>Electronics</span><span className="pt-2">Home</span><span className="pt-2">Beauty</span></div>
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-sm font-bold">Rs 289</span>
              <button type="button" onClick={() => addToCart(products.trainers)} className="rounded-md bg-cta px-3 py-2 text-xs font-bold text-cta-foreground">Add to cart</button>
            </div>
          </article>

          <article className="shop-card">
            <span className="diwali-deal-tag">Diwali Deal</span>
            <h2 className="mt-2">Festive sweets &amp; gifting</h2>
            <img src={diwaliGifts} width={1408} height={1056} loading="lazy" alt="Box of colourful Indian mithai sweets with a golden gift box, marigolds and a lit diya" className="mt-3 aspect-[4/3] w-full rounded-md object-cover" />
            <div className="mt-2 flex justify-between text-xs font-semibold"><span>Mithai boxes</span><span>Gift hampers</span></div>
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-sm font-bold">Rs 189</span>
              <button type="button" onClick={() => addToCart(products.hamper)} className="rounded-md bg-cta px-3 py-2 text-xs font-bold text-cta-foreground">Add to cart</button>
            </div>
          </article>

          <article className="shop-card">
            <span className="diwali-deal-tag">Diwali Deal</span>
            <h2 className="mt-2">Electronics</h2>
            <img src={electronicsGrid} width={1500} height={700} loading="lazy" alt="Wireless headphones, smartwatch, and portable speaker" className="mt-3 aspect-[4/3] w-full rounded-md object-cover" />
            <p className="mt-3 text-sm text-muted-foreground">Headphones, wearables and portable audio for the festive season.</p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-sm font-bold">Rs 489</span>
              <button type="button" onClick={() => addToCart(products.headphones)} className="rounded-md bg-cta px-3 py-2 text-xs font-bold text-cta-foreground">Add to cart</button>
            </div>
          </article>

          <div className="grid gap-5">
            <SignInCard />
            <article className="overflow-hidden bg-promo text-promo-foreground shadow-sm">
              <div className="px-5 pt-5 text-center"><h2 className="font-display text-xl font-semibold">Order by 6 Nov — light up Diwali night, 8 Nov</h2></div>
              <img src={globalShipping} width={1000} height={650} loading="lazy" alt="Packages and a world map representing festive delivery" className="mt-3 aspect-[16/9] w-full object-cover" />
            </article>
          </div>
        </section>
      </main>

    </div>
  );
}

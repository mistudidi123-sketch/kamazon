import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import categoryGrid from "@/assets/category-grid.jpg";
import diwaliGifts from "@/assets/diwali-gifts.jpg";
import electronicsGrid from "@/assets/electronics-grid.jpg";
import refreshSpace from "@/assets/refresh-space.jpg";
import type { Product } from "@/lib/cart-context";

type FeaturedProduct = {
  product: Product;
  description: string;
  tone: "crimson" | "berry" | "green" | "teal";
};

export function FestiveBanner({
  products,
  onAddToCart,
}: {
  products: FeaturedProduct[];
  onAddToCart: (product: Product) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="festive-banner-heading" className="festive-banner">
      <div className="flex flex-wrap items-end justify-between gap-4 px-4 pb-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase text-muted-foreground">The Kamazon seasonal edit</p>
          <h1 id="festive-banner-heading" className="mt-1 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Fast Festive Days
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Thoughtful gifts, bright spaces and everyday favourites for the season.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="icon" onClick={() => scrollRail(-1)} aria-label="Show previous festive picks" title="Previous picks">
            <ChevronLeft className="size-5" aria-hidden="true" />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={() => scrollRail(1)} aria-label="Show more festive picks" title="More picks">
            <ChevronRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div ref={railRef} className="festive-rail flex gap-3 overflow-x-auto px-4 pb-4 sm:gap-4 sm:px-6 lg:px-8" aria-label="Festive shopping highlights">
        <article className="festive-panel festive-panel--orange">
          <p className="text-xs font-extrabold uppercase">A little something for everyone</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight">Fast Festive Days</h2>
          <p className="mt-2 text-sm">Discover gifts, home accents and more in one bright collection.</p>
          <div className="mt-4 grid grid-cols-2 gap-2" aria-label="Gifts, home and electronics">
            <img src={diwaliGifts} alt="Festive sweets and gift hamper" className="festive-tile" />
            <img src={electronicsGrid} alt="Headphones and personal electronics" className="festive-tile" />
            <img src={refreshSpace} alt="Home accessories and décor" className="festive-tile" />
            <img src={categoryGrid} alt="A mix of everyday shopping categories" className="festive-tile" />
          </div>
          <Button asChild className="mt-auto w-full bg-card font-bold text-card-foreground hover:bg-card/90">
            <Link to="/#featured">Explore festive picks</Link>
          </Button>
        </article>

        {products.map(({ product, description, tone }) => (
          <article key={product.id} className={`festive-panel festive-panel--${tone}`}>
            <p className="text-xs font-extrabold uppercase">Festive pick</p>
            <h2 className="mt-2 min-h-14 font-display text-xl font-bold leading-7">{product.name}</h2>
            <p className="mt-1 min-h-10 text-sm">{description}</p>
            <img src={product.image} alt={product.name} className="festive-product-image mt-3" />
            <p className="mt-3 text-sm font-semibold">Rs {product.price.toLocaleString("en-IN")}</p>
            <Button type="button" onClick={() => onAddToCart(product)} className="mt-auto w-full bg-card font-bold text-card-foreground hover:bg-card/90">
              Add to cart
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
import { Link } from "@tanstack/react-router";

import { useCart } from "@/lib/cart-context";

/** Amazon-style cart glyph: handle, basket, two wheels. */
function CartGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M1.5 2.5h3.6c.7 0 1.3.5 1.4 1.2l2.6 12.2c.15.7.75 1.2 1.45 1.2h15.1c.7 0 1.3-.5 1.45-1.2L30 7.2H8.2"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12.5" cy="21" r="2.3" fill="currentColor" />
      <circle cx="24" cy="21" r="2.3" fill="currentColor" />
    </svg>
  );
}

export function CartNavLink({ className = "" }: { className?: string }) {
  const { itemCount } = useCart();
  return (
    <Link
      to="/cart"
      className={`relative flex items-end gap-1 px-2 pb-1 pt-1.5 font-bold outline-focus ${className}`}
      aria-label={`Cart, ${itemCount} items`}
    >
      <span className="relative block">
        <span
          aria-hidden="true"
          className="absolute -top-1 left-1/2 w-full -translate-x-1/2 text-center font-body text-base font-bold leading-none text-accent"
        >
          {itemCount}
        </span>
        <CartGlyph className="mt-3 h-6 w-9 text-header-foreground" />
      </span>
      <span className="hidden pb-0.5 text-sm sm:block">Cart</span>
    </Link>
  );
}

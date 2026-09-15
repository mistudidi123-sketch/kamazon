# Show cart item count at the top centre of the Cart page

## What you'll see

The cart page gets an Amazon-style header at the top centre of the cart content (right below the Cart / Buy Again tabs):

```text
        ┌──────────────────────────────┐
        │   🛒 (3)  Shopping Cart (3)  │
        └──────────────────────────────┘
```

- A cart icon with the item count badge on it, centred at the top of the cart area.
- Text next to it: "Shopping Cart (N items)" — using the same wording Amazon uses.
- The count updates live: adding items, changing + / − quantity, or removing items all update the badge and text instantly.
- When the cart is empty, it reads "Shopping Cart (0 items)" (empty-cart state below is unchanged).

## How it works (technical)

- File: `src/routes/cart.tsx`, `CartPage` component.
- The page already has `itemCount` from the shared cart context (`useCart`), so no state or logic changes — only a small presentational block added at the top of `<main>`.
- Styling uses the existing semantic tokens (header/accent colours) already used on the page, so it matches the current Amazon look and dark-mode behaviour.
- No changes to cart logic, totals, or any other page.

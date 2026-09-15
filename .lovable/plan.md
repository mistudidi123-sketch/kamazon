# Show the cart item quantity at the top of the Cart page

## What you'll see

At the top centre of the cart page (right below the Cart / Buy Again / Whole Foods code tabs), the item quantity is written plainly, Amazon-style:

```text
                 3 items
```

- Just the count in words — e.g. "1 item" or "3 items" — no icon, no extra heading.
- Updates live as you add items, change quantity with + / −, or delete items.
- Shows "0 items" when the cart is empty; everything else on the page stays unchanged.

## How it works (technical)

- File: `src/routes/cart.tsx`, `CartPage` component.
- The page already has `itemCount` from the shared cart context (`useCart`), so this is one small presentational line at the top of `<main>` — no logic changes.
- Styled with existing semantic tokens to match the page.

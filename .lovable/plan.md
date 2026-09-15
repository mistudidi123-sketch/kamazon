# Show the item count on top of the header cart symbol (Amazon-style)

## What you'll see

The header cart icon gets Amazon's exact look from your screenshot: the quantity is written directly on top of the cart symbol.

```text
        (22)
      🛒 Cart
```

- The count appears in bold orange/amber, sitting above and centred on the cart icon.
- Example from your reference: "22" floating over the cart symbol, with "Cart" beside it.
- Updates live when you add items, change quantity, or delete items.
- Applied to the header cart icon on both the homepage and the cart page, so it looks the same everywhere.
- Nothing else on the page changes.

## How it works (technical)

- File: `src/lib/cart-context.tsx` provides `itemCount` — already used by both page headers in `src/routes/index.tsx` and `src/routes/cart.tsx`.
- Only a small restyle of the cart icon block in each header: reposition the existing count span so it is centred directly above the cart symbol, bolder styling to match the Amazon reference.
- No logic, cart state, or totals changes.

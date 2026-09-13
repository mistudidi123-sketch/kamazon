# Dedicated shopping cart page

## What I’ll change
- Make the header cart icon navigate to a dedicated `/cart` page.
- Preserve cart items and quantities between the homepage and cart page for the current browser session.
- Recreate the attached mobile Amazon cart structure with Cart, Buy Again, and Whole Foods code tabs.
- Add the important-messages banner, prominent subtotal, item-count checkout button, and gift checkbox.
- Show full item rows with thumbnail, title, split price styling, stock status, shipping/seller details, quantity controls, Delete, and Save for later.
- Add clear navigation back to the storefront.

## Behavior
- Adding an item on the homepage updates the shared cart and navigates to the cart page.
- Quantity changes and deletion immediately update item counts, subtotal, and total.
- Cart state persists across page navigation and refreshes within the current browser session.
- Checkout, Buy Again, Whole Foods code, and Save for later remain visual placeholders.

## Technical details
- Extract cart state into a small shared React context mounted at the app root.
- Add a separate TanStack route for `/cart` with unique page metadata.
- Reuse the existing Amazon-inspired tokens, typography, images, and responsive header patterns.
- Verify homepage-to-cart navigation, persistence, quantities, deletion, totals, empty state, and mobile/desktop layouts.

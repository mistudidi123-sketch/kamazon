# Functional shopping cart

## What I’ll build
- Turn each featured product area into an add-to-cart action with a clear price.
- Update the cart count in the top navigation immediately as items are added.
- Open a side cart panel from the cart button, listing items with image, name, price, and quantity.
- Add quantity increase/decrease controls, item removal, empty-cart state, and close controls.
- Calculate subtotal and total dynamically from current quantities.

## Interaction details
- The cart panel will open after adding an item and when selecting the cart in the header.
- Reducing an item below one will remove it.
- Checkout remains a visual placeholder; no payments or account system will be added.
- Cart state will last for the current page session only.

## Technical details
- Use React state in the existing homepage with reusable product and cart item data.
- Preserve the selected visual direction, responsive behavior, accessibility labels, keyboard focus, and reduced-motion support.
- Verify add, increment, decrement, remove, empty-cart, totals, drawer opening, and mobile layout in the browser.

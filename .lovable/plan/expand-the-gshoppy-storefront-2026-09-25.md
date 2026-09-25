# Expand the gshoppy storefront

## Goal
Turn the first storefront version into a richer shopping experience with realistic product photography, powerful catalog filtering, detailed product pages, and a fully editable cart.

## Changes
- Replace every customer-facing “Voltra” reference with “gshoppy,” including page titles and descriptions.
- Add a cohesive set of realistic product images across all 25 products, using locally stored storefront assets and useful alt text.
- Add responsive catalog controls for keyword search, category, price range, and device/platform compatibility, with clear reset and no-results states.
- Make every product card link to a dedicated product detail page.
- Build product detail pages with an image gallery, pricing, rating, stock status, quantity selector, specifications, compatibility details, delivery notes, and add-to-cart controls.
- Expand product data to support galleries, specifications, compatibility, and searchable details.
- Keep the slide-out cart editable with product thumbnails, increment/decrement controls, direct quantity editing, remove and clear actions, live subtotal, and a prominent checkout button.
- Preserve the existing five category pages while making filtering and product navigation consistent across the storefront.

## Verification
- Check the storefront at desktop and mobile sizes.
- Verify search and each filter can combine and reset correctly.
- Open multiple product pages and exercise gallery and quantity controls.
- Add, update, and remove cart items and confirm totals update correctly.
- Confirm all routes have unique gshoppy metadata and the preview builds without errors.

## Technical details
- Use TanStack Router routes for product pages and URL search parameters for shareable catalog state.
- Reuse the existing semantic color system and shared controls.
- Store imagery as bundled project assets; no externally hotlinked images.

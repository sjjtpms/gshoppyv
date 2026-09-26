<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep product filtering and URL query synchronization in `CatalogBrowser`; this gives home and category collections one consistent browsing behavior.
- Keep cart quantities in the shared cart provider and display them through `CartDrawer`; this preserves a single subtotal across product pages.
- Keep demo product prices, INR formatting, and the free-shipping threshold in `src/lib/products.ts`; this keeps all storefront price displays consistent.

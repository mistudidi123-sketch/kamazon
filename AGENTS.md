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

- Check a shared browser-safe Cloud configuration predicate before accessing the Supabase client, so missing runtime bindings cannot blank public pages.
- Keep the selected storefront country separate from the delivery address and persist it through shared app state, so market selection never overwrites customer address details.
- Keep delivery-address completion state beside the shared delivery location, so address prompts stay consistent across storefront layouts and reloads.

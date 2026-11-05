import { ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProductSearch() {
  return (
    <form
      className="flex min-w-0 flex-1 overflow-hidden rounded-md bg-card ring-2 ring-transparent focus-within:ring-accent"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <Button
        type="button"
        variant="ghost"
        className="h-auto shrink-0 gap-1 rounded-none bg-search-muted px-3 text-xs text-muted-foreground hover:bg-search-muted hover:text-foreground"
        aria-label="Select product category"
      >
        All <ChevronDown className="size-3" aria-hidden="true" />
      </Button>
      <input
        className="min-w-0 flex-1 bg-card px-3 py-2.5 text-sm text-foreground outline-none"
        placeholder="Search Kamazon"
        aria-label="Search products"
      />
      <Button
        type="submit"
        size="icon"
        className="h-auto w-12 shrink-0 rounded-none bg-cta text-cta-foreground hover:bg-cta"
        aria-label="Search products"
      >
        <Search className="size-5" />
      </Button>
    </form>
  );
}
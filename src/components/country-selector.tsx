import { useMemo, useState } from "react";
import { Check, ChevronDown, Globe2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { COUNTRIES, countryFlag, getCountry } from "@/lib/countries";
import { useCart } from "@/lib/cart-context";

export function CountrySelector({ className }: { className?: string }) {
  const { countryCode, setCountryCode } = useCart();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = getCountry(countryCode);
  const filteredCountries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("en");
    if (!normalizedQuery) return COUNTRIES;
    return COUNTRIES.filter((country) =>
      `${country.name} ${country.code}`.toLocaleLowerCase("en").includes(normalizedQuery),
    );
  }, [query]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={`h-auto min-w-0 gap-1 px-2 py-1.5 text-left text-header-foreground hover:bg-header/70 hover:text-header-foreground ${className ?? "hidden xl:inline-flex"}`}
          aria-label={`Country or region: ${selected.name}`}
        >
          <span aria-hidden="true" className="text-base leading-none">{countryFlag(selected.code)}</span>
          <span className="text-xs font-semibold">{selected.code} · EN</span>
          <ChevronDown className="size-3 shrink-0" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle>Choose your country or region</DialogTitle>
          <DialogDescription>Your selection is saved on this device.</DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <label className="sr-only" htmlFor="country-region-search">Search countries</label>
          <Input
            id="country-region-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search countries"
            autoComplete="off"
            autoFocus
          />
        </div>
        <div role="listbox" aria-label="Countries and regions" className="min-h-0 overflow-y-auto px-2 pb-3">
          {filteredCountries.length ? (
            filteredCountries.map((country) => {
              const isSelected = country.code === selected.code;
              return (
                <Button
                  key={country.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  variant="ghost"
                  className="h-auto w-full justify-start gap-3 px-3 py-2 text-left"
                  onClick={() => {
                    setCountryCode(country.code);
                    handleOpenChange(false);
                  }}
                >
                  <span aria-hidden="true" className="w-7 text-center text-lg leading-none">{countryFlag(country.code)}</span>
                  <span className="min-w-0 flex-1 truncate">{country.name}</span>
                  <span className="text-xs text-muted-foreground">{country.code}</span>
                  {isSelected ? <Check className="size-4 shrink-0 text-primary" aria-label="Selected" /> : null}
                </Button>
              );
            })
          ) : (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No countries match that search.</p>
          )}
        </div>
        <div className="flex items-center gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <Globe2 className="size-4" aria-hidden="true" />
          <span>Selected: {selected.name}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  GraduationCap,
  Landmark,
  Loader2,
  MapPin,
  Search,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { searchPlaces, type PlaceResult } from "@/lib/places.functions";

type LocationSearchProps = {
  onSelect: (place: PlaceResult) => void;
};

function resultIcon(types: string[]) {
  const joined = types.join(" ");
  if (/(school|university|college|library)/.test(joined)) return GraduationCap;
  if (/(store|shop|restaurant|cafe|food|market|supermarket|meal|clothing)/.test(joined)) return Store;
  if (/(landmark|museum|monument|place_of_worship|church|temple|tourist|mosque|gurdwara|hindu)/.test(joined))
    return Landmark;
  return MapPin;
}

export function LocationSearch({ onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      requestId.current += 1;
      setStatus("idle");
      setResults([]);
      setOpen(false);
      return;
    }
    setStatus("loading");
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      try {
        const { results: found, error } = await searchPlaces({ data: { query: trimmed } });
        if (id !== requestId.current) return;
        setResults(found);
        setStatus(error ? "error" : "done");
        setOpen(true);
      } catch {
        if (id === requestId.current) {
          setResults([]);
          setStatus("error");
          setOpen(true);
        }
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const showPanel = open && query.trim().length >= 3;

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <form
        className="flex overflow-hidden rounded-md border border-border bg-background ring-2 ring-transparent focus-within:ring-accent"
        onSubmit={(event) => {
          event.preventDefault();
          if (results.length > 0) setOpen(true);
        }}
      >
        <input
          className="min-w-0 flex-1 bg-background px-3 py-2.5 text-sm text-foreground outline-none"
          placeholder="Search a village, town, address or place"
          aria-label="Search delivery locations"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (query.trim().length >= 3) setOpen(true);
          }}
        />
        <Button
          type="submit"
          size="icon"
          className="h-auto w-12 shrink-0 rounded-none bg-cta text-cta-foreground hover:bg-cta"
          aria-label="Search delivery locations"
        >
          {status === "loading" ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
        </Button>
      </form>

      {showPanel && (
        <div
          role="listbox"
          aria-label="Delivery location results"
          className="absolute left-0 top-full z-30 mt-2 max-h-[60vh] w-full min-w-[min(540px,calc(100vw-2rem))] overflow-y-auto rounded-md border border-border bg-card text-card-foreground shadow-xl"
        >
          {status === "loading" && (
            <p className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Searching places…
            </p>
          )}
          {status === "error" && (
            <p className="px-4 py-4 text-sm text-destructive">
              Location search is unavailable right now. Please try again.
            </p>
          )}
          {status === "done" && results.length === 0 && (
            <p className="px-4 py-4 text-sm text-muted-foreground">
              No matching places found — try a nearby town, landmark or business name.
            </p>
          )}
          {status === "done" && results.length > 0 && (
            <ul className="divide-y divide-border">
              {results.map((place) => {
                const Icon = resultIcon(place.types);
                return (
                  <li key={place.id}>
                    <a
                      href={place.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted"
                    >
                      <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">{place.name}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                          {place.address || "Address unavailable"}
                        </span>
                      </span>
                    </a>
                    <div className="flex items-center justify-end gap-2 px-4 pb-3">
                      <a
                        href={place.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Maps <ExternalLink className="size-3" aria-hidden="true" />
                      </a>
                      <Button type="button" size="sm" onClick={() => onSelect(place)}>
                        Select this address
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
            Choose an address to save it as your delivery location.
          </p>
        </div>
      )}
    </div>
  );
}

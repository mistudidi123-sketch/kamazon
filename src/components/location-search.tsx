import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Landmark,
  Loader2,
  MapPin,
  Search,
  Store,
} from "lucide-react";

import { searchPlaces, type PlaceResult } from "@/lib/places.functions";

function resultIcon(types: string[]) {
  const joined = types.join(" ");
  if (/(school|university|college|library)/.test(joined)) return GraduationCap;
  if (/(store|shop|restaurant|cafe|food|market|supermarket|meal|clothing)/.test(joined)) return Store;
  if (/(landmark|museum|monument|place_of_worship|church|temple|tourist|mosque|gurdwara|hindu)/.test(joined))
    return Landmark;
  return MapPin;
}

export function LocationSearch({ className }: { className?: string }) {
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
    <div ref={wrapperRef} className={`relative min-w-0 ${className ?? ""}`}>
      <form
        className="flex overflow-hidden rounded-md ring-2 ring-transparent focus-within:ring-accent"
        onSubmit={(event) => {
          event.preventDefault();
          if (results.length > 0) setOpen(true);
        }}
      >
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 bg-search-muted px-3 text-xs text-muted-foreground"
          aria-label="Select search category"
        >
          All <ChevronDown className="size-3" aria-hidden="true" />
        </button>
        <input
          className="min-w-0 flex-1 bg-card px-3 py-2.5 text-sm text-foreground outline-none"
          placeholder="Search any village, town, school, shop or landmark…"
          aria-label="Universal location search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (query.trim().length >= 3) setOpen(true);
          }}
        />
        <button
          type="submit"
          className="grid w-12 shrink-0 place-items-center bg-accent text-accent-foreground"
          aria-label="Search locations"
        >
          {status === "loading" ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
        </button>
      </form>

      {showPanel && (
        <div
          role="listbox"
          aria-label="Location results"
          className="absolute left-0 top-full z-30 mt-1 max-h-[70vh] w-[min(560px,calc(100vw-2rem))] overflow-y-auto rounded-md border border-border bg-card text-card-foreground shadow-xl"
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
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted"
                    >
                      <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">{place.name}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                          {place.address || "Address unavailable"}
                        </span>
                      </span>
                      <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                        Maps <ExternalLink className="size-3" aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
            Search results from Google Maps — open any result to see it on the map.
          </p>
        </div>
      )}
    </div>
  );
}

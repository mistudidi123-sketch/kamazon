import { useState } from "react";
import { MapPin } from "lucide-react";

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
import { useCart } from "@/lib/cart-context";
import { LocationSearch } from "@/components/location-search";
import type { PlaceResult } from "@/lib/places.functions";

type LocationPickerProps = {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function LocationPicker({ className, open: controlledOpen, onOpenChange }: LocationPickerProps) {
  const { location, setLocation } = useCart();
  const [internalOpen, setInternalOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const open = controlledOpen ?? internalOpen;

  const updateOpen = (nextOpen: boolean) => {
    setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const saveLocation = (nextLocation: string) => {
    const trimmed = nextLocation.trim();
    if (!trimmed) return;
    setLocation(trimmed);
    setDraft("");
    updateOpen(false);
  };

  const choosePlace = (place: PlaceResult) => {
    saveLocation([place.name, place.address].filter(Boolean).join(", "));
  };

  return (
    <Dialog open={open} onOpenChange={updateOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={`items-end gap-1 px-2 py-1.5 text-left leading-tight text-header-foreground hover:bg-header/70 hover:text-header-foreground ${className ?? "flex"}`}
          aria-label="Change delivery location"
        >
          <MapPin className="mb-0.5 size-4" aria-hidden="true" />
          <span>
            <small className="block text-[11px] text-header-muted">Deliver to</small>
            <strong className="block max-w-[190px] truncate text-sm">{location}</strong>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your location</DialogTitle>
          <DialogDescription>Choose an address for delivery updates and availability.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">Saved delivery location</p>
            <p className="mt-0.5 flex items-start gap-2 text-sm font-semibold">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{location}</span>
            </p>
          </div>
          <LocationSearch onSelect={choosePlace} />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const nextLocation = draft.trim();
              if (!nextLocation) return;
              saveLocation(nextLocation);
            }}
            className="flex gap-2"
          >
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Or enter a location manually"
              aria-label="Enter a delivery location manually"
            />
            <Button type="submit" className="bg-cta text-cta-foreground hover:bg-cta">
              Save
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

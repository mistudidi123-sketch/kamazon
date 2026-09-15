import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";

export function LocationPicker({ className }: { className?: string }) {
  const { location, setLocation } = useCart();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(location);

  useEffect(() => {
    if (open) setDraft(location);
  }, [open, location]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`items-end gap-1 px-2 py-1.5 text-left leading-tight outline-focus ${className ?? "flex"}`}
          aria-label="Change delivery location"
        >
          <MapPin className="mb-0.5 size-4" aria-hidden="true" />
          <span>
            <small className="block text-[11px] text-header-muted">Deliver to</small>
            <strong className="block max-w-[140px] truncate text-sm">{location}</strong>
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your location</DialogTitle>
          <DialogDescription>
            Delivery options and speeds may vary for different locations.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setLocation(draft);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <Input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Enter a city, address or postcode"
            aria-label="Delivery location"
          />
          <DialogFooter>
            <Button type="submit" className="bg-cta text-cta-foreground hover:bg-cta">
              Apply
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

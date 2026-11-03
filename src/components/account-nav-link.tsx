import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { AuthDialog } from "@/components/auth-dialog";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccountNavLink({ className = "" }: { className?: string }) {
  const { user, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  const firstName =
    (user?.user_metadata?.["full_name"] as string | undefined)?.split(" ")[0] ??
    user?.email?.split("@")[0];

  if (!user) {
    return (
      <>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className={`px-2 py-1.5 text-left leading-tight outline-focus ${className}`}
        >
          <small className="block text-[11px]">Hello, sign in</small>
          <strong className="flex items-center text-sm">
            Account &amp; Lists <ChevronDown className="ml-1 size-3" />
          </strong>
        </button>
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultMode="signin" />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`px-2 py-1.5 text-left leading-tight outline-focus ${className}`}>
        <small className="block text-[11px]">Hello, {firstName}</small>
        <strong className="flex items-center text-sm">
          Account &amp; Lists <ChevronDown className="ml-1 size-3" />
        </strong>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>Your account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate({ to: "/account" })}>Your account &amp; address</DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.info("Seller account coming soon", { description: "We're building a space for you to sell on Kamazon." })}
        >
          Seller account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

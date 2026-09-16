import { useEffect, useState } from "react";

import { AuthDialog } from "@/components/auth-dialog";
import { useAuth } from "@/lib/auth-context";

const SKIP_KEY = "amazon-romania-signup-skipped";

export function SignupPrompt() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading || user) return;
    if (window.localStorage.getItem(SKIP_KEY) === "1") return;

    const timer = window.setTimeout(() => setOpen(true), 6000);
    return () => window.clearTimeout(timer);
  }, [loading, user]);

  useEffect(() => {
    if (user) setOpen(false);
  }, [user]);

  const skip = () => {
    window.localStorage.setItem(SKIP_KEY, "1");
    setOpen(false);
  };

  return <AuthDialog open={open} onOpenChange={(next) => (next ? setOpen(true) : skip())} onSkip={skip} />;
}

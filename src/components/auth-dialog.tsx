import { useState } from "react";
import { toast } from "sonner";

import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSkip?: () => void;
  defaultMode?: "signup" | "signin";
};

export function AuthDialog({ open, onOpenChange, onSkip, defaultMode = "signup" }: Props) {
  const [mode, setMode] = useState<"signup" | "signin">(defaultMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in didn't work. Please try again.");
      return;
    }
    if (result.redirected) return;
    setBusy(false);
    onOpenChange(false);
    toast.success("You're signed in.");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    if (!emailPattern.test(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (mode === "signup") {
      if (!fullName.trim()) {
        toast.error("Please enter your full name.");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
      }
      if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        toast.error("Password must include both letters and numbers.");
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim() },
          },
        });
        if (error) throw error;
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          toast.error("An account with this email already exists. Please sign in instead.");
          setMode("signin");
          return;
        }
        if (!data.session) {
          toast.success("Almost there — check your email and click the confirmation link.");
        } else {
          toast.success("Welcome! Your account is ready.");
        }
        onOpenChange(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) {
          if (/invalid login credentials/i.test(error.message)) {
            toast.error("That email or password is incorrect.");
            return;
          }
          if (/email not confirmed/i.test(error.message)) {
            toast.error("Please confirm your email first — check your inbox for the link.");
            return;
          }
          throw error;
        }
        toast.success("Welcome back.");
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "signup" ? "Create your account" : "Sign in"}</DialogTitle>
          <DialogDescription>
            Save your details and delivery address so you never have to fill them in again.
          </DialogDescription>
        </DialogHeader>

        <Button type="button" variant="outline" className="w-full" disabled={busy} onClick={handleGoogle}>
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <div className="space-y-1">
              <Label htmlFor="auth-name">Full name</Label>
              <Input id="auth-name" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
            </div>
          ) : null}
          <div className="space-y-1">
            <Label htmlFor="auth-email">Email</Label>
            <Input id="auth-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              required
              minLength={mode === "signup" ? 8 : 6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>
          <Button type="submit" className="w-full bg-cta text-cta-foreground hover:bg-cta/90" disabled={busy}>
            {mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            className="font-semibold text-primary underline-offset-2 hover:underline"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          >
            {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
          {onSkip ? (
            <button type="button" className="text-muted-foreground hover:underline" onClick={onSkip}>
              Skip for now
            </button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

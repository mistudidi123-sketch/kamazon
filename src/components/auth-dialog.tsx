import { useEffect, useState } from "react";
import { Loader2, Lock, Mail, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { KamazonLogo } from "@/components/kamazon-logo";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/cloud-config";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSkip?: () => void;
  defaultMode?: "signup" | "signin";
};

type Errors = Partial<Record<"fullName" | "email" | "password" | "form", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function AuthDialog({ open, onOpenChange, onSkip, defaultMode = "signup" }: Props) {
  const cloudConfigured = isSupabaseConfigured();
  const [mode, setMode] = useState<"signup" | "signin">(defaultMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<false | "google" | "form">(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setErrors({});
      setSentTo(null);
    }
  }, [open, defaultMode]);

  const switchMode = () => {
    setMode(mode === "signup" ? "signin" : "signup");
    setErrors({});
    setSentTo(null);
  };

  const handleGoogle = async () => {
    if (!cloudConfigured) {
      setErrors({ form: "Sign-in services are temporarily unavailable. Please try again later." });
      return;
    }
    setBusy("google");
    setErrors({});
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      setErrors({ form: "Google sign-in didn't work. Please try again." });
      return;
    }
    if (result.redirected) return;
    setBusy(false);
    onOpenChange(false);
    toast.success("You're signed in.");
  };

  const validate = () => {
    const next: Errors = {};
    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(cleanEmail)) next.email = "Enter a valid email address.";
    if (mode === "signup") {
      if (!fullName.trim()) next.fullName = "Please enter your full name.";
      if (password.length < 8) next.password = "Use at least 8 characters.";
      else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
        next.password = "Include both letters and numbers.";
    } else if (!password) {
      next.password = "Enter your password.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!cloudConfigured) {
      setErrors({ form: "Sign-in services are temporarily unavailable. Please try again later." });
      return;
    }
    if (!validate()) return;

    const cleanEmail = email.trim().toLowerCase();
    setBusy("form");
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
          setErrors({ form: "An account with this email already exists. Please sign in instead." });
          setMode("signin");
          return;
        }
        if (!data.session) {
          setSentTo(cleanEmail);
          return;
        }
        toast.success("Welcome! Your account is ready.");
        onOpenChange(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) {
          if (/invalid login credentials/i.test(error.message)) {
            setErrors({ form: "That email or password is incorrect." });
            return;
          }
          if (/email not confirmed/i.test(error.message)) {
            setErrors({ form: "Please confirm your email first — check your inbox for the link." });
            return;
          }
          throw error;
        }
        toast.success("Welcome back.");
        onOpenChange(false);
      }
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  };

  const loading = busy !== false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-1.5rem)] overflow-y-auto rounded-xl p-0 sm:max-w-[420px]">
        <div className="flex items-center justify-center rounded-t-xl bg-header px-6 py-4">
          <KamazonLogo />
        </div>

        <div className="px-6 pb-6 pt-5">
          {sentTo ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent/15">
                <Mail className="size-6 text-accent" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-center text-xl">Check your inbox</DialogTitle>
                <DialogDescription className="text-center">
                  We sent a confirmation link to <strong className="text-foreground">{sentTo}</strong>. Click it to
                  activate your account, then sign in.
                </DialogDescription>
              </DialogHeader>
              <Button type="button" className="w-full" variant="outline" onClick={() => { setSentTo(null); setMode("signin"); }}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader className="space-y-1">
                <DialogTitle className="font-display text-xl">
                  {mode === "signup" ? "Create your account" : "Sign in"}
                </DialogTitle>
                <DialogDescription>
                  {mode === "signup"
                    ? "Save your details and delivery address so checkout is one tap next time."
                    : "Welcome back — your cart and saved address are waiting."}
                </DialogDescription>
              </DialogHeader>

              <Button
                type="button"
                variant="outline"
                className="mt-4 h-11 w-full gap-2 font-semibold"
                disabled={loading || !cloudConfigured}
                onClick={handleGoogle}
              >
                {busy === "google" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z" />
                    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8h-4v3.1A12 12 0 0 0 12 24Z" />
                    <path fill="#FBBC05" d="M5.4 14.3a7.1 7.1 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
                    <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z" />
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or use email <span className="h-px flex-1 bg-border" />
              </div>

              {errors.form ? (
                <p role="alert" className="mb-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errors.form}
                </p>
              ) : null}

              <form className="space-y-3" onSubmit={handleSubmit} noValidate>
                {mode === "signup" ? (
                  <Field
                    id="auth-name"
                    label="Full name"
                    icon={<UserIcon className="size-4" />}
                    value={fullName}
                    onChange={setFullName}
                    autoComplete="name"
                    error={errors.fullName}
                    disabled={loading}
                  />
                ) : null}
                <Field
                  id="auth-email"
                  label="Email"
                  type="email"
                  icon={<Mail className="size-4" />}
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                  error={errors.email}
                  disabled={loading || !cloudConfigured}
                />
                <Field
                  id="auth-password"
                  label="Password"
                  type="password"
                  icon={<Lock className="size-4" />}
                  value={password}
                  onChange={setPassword}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  error={errors.password}
                  disabled={loading || !cloudConfigured}
                  hint={mode === "signup" ? "At least 8 characters, with letters and numbers." : undefined}
                />

                <Button
                  type="submit"
                  className="h-11 w-full bg-cta text-base font-semibold text-cta-foreground hover:bg-cta/90"
                  disabled={loading || !cloudConfigured}
                >
                  {busy === "form" ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  {mode === "signup" ? "Create account" : "Sign in"}
                </Button>
              </form>

              <div className="mt-5 flex flex-col items-center gap-2 border-t border-border pt-4 text-sm sm:flex-row sm:justify-between">
                <button type="button" className="font-semibold text-primary hover:underline" onClick={switchMode} disabled={loading || !cloudConfigured}>
                  {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
                </button>
                {onSkip ? (
                  <button type="button" className="text-muted-foreground hover:underline" onClick={onSkip}>
                    Skip for now
                  </button>
                ) : null}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  icon,
  value,
  onChange,
  type = "text",
  autoComplete,
  error,
  disabled,
  hint,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  error?: string | undefined;
  disabled?: boolean;
  hint?: string | undefined;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete ?? "off"}
          disabled={disabled ?? false}
          aria-invalid={Boolean(error)}
          className={`h-11 pl-9 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
      </div>
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

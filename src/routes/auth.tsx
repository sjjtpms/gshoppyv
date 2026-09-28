import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — gshoppy" },
      { name: "description", content: "Sign in to your gshoppy account." },
      { property: "og:title", content: "Sign in — gshoppy" },
      { property: "og:description", content: "Sign in to your gshoppy account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/admin", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth` },
          });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "signup") toast.success("Check your email to confirm your account.");
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth` });
    if (res?.error) toast.error("Google sign-in failed");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-foreground">
        {mode === "signin" ? "Sign in" : "Create account"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Store staff access to the gshoppy dashboard.</p>
      <Button variant="outline" className="mt-6" onClick={google}>Continue with Google</Button>
      <div className="my-4 text-center text-xs text-muted-foreground">or</div>
      <form onSubmit={submit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>
      <button
        className="mt-4 text-sm text-muted-foreground underline"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin" ? "New here? Create an account" : "Have an account? Sign in"}
      </button>
    </div>
  );
}

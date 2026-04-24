import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "signin" | "signup";

const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [resending, setResending] = useState(false);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "confirmation_failed"
      ? "Confirmation link expired. Please sign in or request a new confirmation email."
      : null
  );
  const [success, setSuccess] = useState<string | null>(null);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setSuccess(null);
    setUnconfirmed(false);
  };

  const resendConfirmation = async () => {
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${SITE_URL}/auth/callback` },
    });
    setResending(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Confirmation email resent! Check your inbox.");
      setUnconfirmed(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${SITE_URL}/auth/callback`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`,
          },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setCheckEmail(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setError("Please confirm your email before signing in. Check your inbox for the confirmation link.");
          setUnconfirmed(true);
        } else {
          setError(error.message);
        }
      } else {
        navigate("/dashboard");
      }
    }

    setLoading(false);
  };

  const Logo = () => (
    <div className="flex justify-center mb-8">
      <a href="/">
        <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/40">
          <span className="absolute inset-1 rounded-full border border-primary/60" />
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
        </span>
      </a>
    </div>
  );

  // Check your email screen
  if (checkEmail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="absolute inset-0 dot-bg pointer-events-none opacity-40" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
             style={{ background: "radial-gradient(closest-side, hsl(188 95% 35% / 0.15), transparent 70%)" }} />

        <div className="relative w-full max-w-md">
          <Logo />
          <div className="card-glow rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
              </svg>
            </div>

            <h1 className="font-display text-2xl mb-2">Check your email</h1>
            <p className="text-foreground/60 text-sm leading-relaxed mb-1">
              We sent a confirmation link to
            </p>
            <p className="font-medium text-foreground mb-5">{email}</p>
            <p className="text-foreground/50 text-xs mb-6">
              Click the link in the email to verify your account. Once confirmed, you can sign in.
            </p>

            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            {success && <p className="text-sm text-green-500 mb-3">{success}</p>}

            <Button
              variant="outline"
              disabled={resending}
              onClick={resendConfirmation}
              className="w-full rounded-full h-10 text-sm bg-transparent border-foreground/20 hover:bg-foreground/5 disabled:opacity-50 mb-3"
            >
              {resending ? "Sending…" : "Resend confirmation email"}
            </Button>

            <button
              onClick={() => { setCheckEmail(false); switchMode("signin"); }}
              className="text-sm text-foreground/50 hover:text-foreground transition-colors"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 dot-bg pointer-events-none opacity-40" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(closest-side, hsl(188 95% 35% / 0.15), transparent 70%)" }} />

      <div className="relative w-full max-w-md">
        <Logo />

        <div className="card-glow rounded-2xl p-8">
          <h1 className="font-display text-2xl mb-1">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-foreground/60 mb-6">
            {mode === "signin"
              ? "Sign in to access your dashboard."
              : "Get started with your free account."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="Jane" value={firstName}
                      onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" value={lastName}
                      onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={phone}
                    onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            {error && (
              <div className="space-y-2">
                <p className="text-sm text-red-500">{error}</p>
                {unconfirmed && (
                  <button type="button" onClick={resendConfirmation} disabled={resending}
                    className="text-sm text-primary hover:underline disabled:opacity-50">
                    {resending ? "Sending…" : "Resend confirmation email"}
                  </button>
                )}
              </div>
            )}
            {success && <p className="text-sm text-green-500">{success}</p>}

            <Button type="submit" disabled={loading}
              className="w-full rounded-full h-11 text-sm font-semibold btn-gradient text-white border-0 disabled:opacity-60">
              {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-foreground/60 mt-6">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button className="text-primary hover:underline font-medium"
              onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}>
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

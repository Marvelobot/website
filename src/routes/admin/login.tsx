import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { User, Lock, Shield, Zap, ArrowRight, Eye, EyeOff } from "lucide-react";
import { adminLogin } from "@/lib/api/admin.functions";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "MARVELO — Agent Access Portal" },
      {
        name: "description",
        content: "Secure login for MARVELO Nexus Terminal administration.",
      },
      { property: "og:title", content: "MARVELO Admin — Agent Access" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Both fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin(username, password);
      localStorage.setItem("admin_token", res.token);
      toast.success("Access granted, Agent");
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#050508] overflow-hidden">
      <Toaster position="top-right" closeButton />

      {/* Left — Login Form */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        {/* Subtle radial glow behind form */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_70%)]" />

        <div className="relative w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#dc2626] to-[#f59e0b] shadow-lg shadow-red-900/40">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold tracking-[0.25em] text-foreground">
                MARVELO
              </h2>
              <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
                Nexus Terminal
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              <span className="text-gradient-hero">Welcome back</span>
              <span className="text-foreground">, Agent</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Authenticate to access the Nexus Terminal data core.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Agent Identity
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter agent codename"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 pl-10 bg-white/[0.03] border-white/[0.08] text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-[#e8866b]/40 focus-visible:border-[#e8866b]/50"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Security Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter security passphrase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10 bg-white/[0.03] border-white/[0.08] text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-[#e8866b]/40 focus-visible:border-[#e8866b]/50"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-gradient-to-r from-[#dc2626] to-[#e8866b] text-white font-display font-bold text-xs tracking-[0.2em] uppercase shadow-lg shadow-red-900/30 hover:shadow-red-900/50 hover:brightness-110 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Authenticating…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  ACCESS CORE
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer note */}
          <p className="text-center text-[10px] text-muted-foreground/50">
            Omega-Level clearance required. Unauthorized access is monitored.
          </p>
        </div>
      </div>

      {/* Right — Decorative Panel */}
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a12] via-[#0c0c14] to-[#050508]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(220,38,38,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(245,158,11,0.1),transparent_60%)]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Central decorative element */}
        <div className="relative flex flex-col items-center gap-8">
          {/* Glow ring */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-[#dc2626]/20 to-[#f59e0b]/20 blur-2xl" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#dc2626] to-[#f59e0b] shadow-2xl shadow-red-900/50">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-3">
            <h2 className="font-display text-2xl font-bold tracking-[0.15em] text-gradient-hero">
              S.H.I.E.L.D.
            </h2>
            <p className="font-display text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Data Operations System
            </p>
            <div className="mx-auto h-[1px] w-24 bg-gradient-to-r from-transparent via-[#e8866b]/40 to-transparent" />
            <p className="text-[10px] text-muted-foreground/50 max-w-[200px]">
              Secure infrastructure for Nexus-level data management and oversight
            </p>
          </div>

          {/* Floating decoration elements */}
          <div className="absolute -top-16 -right-12 h-2 w-2 rounded-full bg-[#e8866b]/60 animate-pulse" />
          <div className="absolute -bottom-8 -left-16 h-1.5 w-1.5 rounded-full bg-[#f59e0b]/50 animate-pulse delay-700" />
          <div className="absolute top-1/2 -right-20 h-1 w-1 rounded-full bg-[#56d4dd]/40 animate-pulse delay-1000" />
        </div>

        {/* Corner accents */}
        <div className="absolute top-6 left-6 h-12 w-12 border-t border-l border-white/[0.06] rounded-tl-lg" />
        <div className="absolute bottom-6 right-6 h-12 w-12 border-b border-r border-white/[0.06] rounded-br-lg" />
      </div>
    </div>
  );
}

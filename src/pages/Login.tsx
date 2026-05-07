import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Eye, EyeOff, Plane } from "lucide-react";

type Mode = "login" | "signup";

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [, navigate] = useLocation();

  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === "signup") {
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName.trim());
      if (error) {
        setError(error);
      } else {
        setSuccess(
          "Account created! Check your email to confirm, then log in."
        );
        setMode("login");
        setPassword("");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        navigate("/");
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-pink-200/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-amber-200/20 blur-[120px]" />

      {/* Dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1.5px 1.5px, #000 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/70 backdrop-blur-2xl border border-black/8 rounded-3xl shadow-2xl overflow-hidden">
          {/* Top brand strip */}
          <div className="bg-black px-8 pt-8 pb-7 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <div>
              <p
                className="text-white text-xs tracking-[0.2em] uppercase font-medium opacity-60"
              >
                Welcome to
              </p>
              <p
                className="text-white text-lg leading-none"
                style={{ fontFamily: "'Brittany Signature', cursive" }}
              >
                Runway Objects
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex border-b border-black/8">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 py-3.5 text-sm font-semibold tracking-wide transition-all ${
                  mode === m
                    ? "text-black border-b-2 border-black -mb-px"
                    : "text-black/35 hover:text-black/60"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-black/40 uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full h-11 rounded-xl border border-black/12 bg-white/80 px-4 text-sm text-black placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-black/40 uppercase tracking-widest mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full h-11 rounded-xl border border-black/12 bg-white/80 px-4 text-sm text-black placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-black/40 uppercase tracking-widest">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {/* future: forgot password */}}
                    className="text-xs text-black/35 hover:text-black transition"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-black/12 bg-white/80 px-4 pr-11 text-sm text-black placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-xs text-black/30 mt-1.5">
                  Minimum 6 characters
                </p>
              )}
            </div>

            {/* Error / success */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full bg-black text-white text-sm font-semibold tracking-wide hover:bg-black/80 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>

            <p className="text-center text-xs text-black/30 pt-1">
              {mode === "login" ? (
                <>
                  No account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
                    className="text-black/60 font-semibold hover:text-black transition"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                    className="text-black/60 font-semibold hover:text-black transition"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>

          {/* Footer note */}
          <div className="px-8 pb-6 text-center">
            <p className="text-[11px] text-black/20 leading-relaxed">
              By continuing you agree to our{" "}
              <a href="/terms-of-service.html" className="underline hover:text-black/40 transition">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy-policy.html" className="underline hover:text-black/40 transition">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

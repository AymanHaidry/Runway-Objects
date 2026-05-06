import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

export default function Login() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [, navigate] = useLocation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleEmail = async () => {
    if (!email) return;

    try {
      setLoading(true);
      await signInWithEmail(email);
      alert("Check your email for the magic link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF4F7] relative overflow-hidden">

      {/* Ambient background layers */}
      <div className="absolute w-[600px] h-[600px] bg-pink-200/30 blur-[140px] rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-200/20 blur-[160px] rounded-full bottom-[-220px] right-[-180px]" />

      {/* Floating glass portal */}
      <div
        className={`
          w-full max-w-md transition-all duration-700
          ${focused ? "scale-[1.02]" : "scale-100"}
        `}
      >
        <div className="relative">

          {/* outer glow ring */}
          <div className="absolute inset-0 rounded-3xl bg-white/40 blur-2xl animate-pulse" />

          {/* glass card */}
          <div className="relative bg-white/60 backdrop-blur-2xl border border-black/10 rounded-3xl p-8 shadow-2xl">

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-black/60 mt-1">
                Continue your Runway experience
              </p>
            </div>

            {/* Google auth */}
            <Button
              onClick={signInWithGoogle}
              className="w-full h-11 rounded-full bg-black text-white hover:bg-black/80 transition"
            >
              Continue with Google
            </Button>

            {/* divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-black/10 flex-1" />
              <span className="text-xs text-black/40">or</span>
              <div className="h-px bg-black/10 flex-1" />
            </div>

            {/* Email login */}
            <div className="space-y-3">

              <div className="relative">
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className={`
                    h-11 rounded-full px-4 bg-white/70 transition-all
                    ${focused ? "ring-2 ring-black/20 shadow-md" : ""}
                  `}
                />

                {/* subtle glow under input */}
                {focused && (
                  <div className="absolute inset-0 rounded-full bg-black/5 blur-xl -z-10" />
                )}
              </div>

              <Button
                onClick={handleEmail}
                disabled={loading}
                variant="outline"
                className="w-full h-11 rounded-full"
              >
                {loading ? "Sending magic link..." : "Continue with Email"}
              </Button>
            </div>

            {/* footer */}
            <p className="text-[11px] text-center text-black/40 mt-6">
              Secure login • encrypted session • instant access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

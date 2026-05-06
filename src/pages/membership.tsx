import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Check } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Runway Free",
    price: 0,
    features: [
      "Full store access",
      "Runway Passport QR",
      "Order tracking",
      "Community tier progress",
    ],
    cta: "Current Plan",
    highlight: false,
  },
  {
    id: "collector",
    name: "Collector",
    price: 9.99,
    features: [
      "Everything in Free",
      "5% member discount",
      "Early drop notifications",
      "Priority support",
      "Exclusive collector badge",
    ],
    cta: "Join Collector",
    highlight: false,
  },
  {
    id: "elite",
    name: "Elite",
    price: 24.99,
    features: [
      "Everything in Collector",
      "12% member discount",
      "First access to limited editions",
      "Dedicated WhatsApp line",
      "Annual collector certificate",
      "Private registry dashboard",
    ],
    cta: "Join Elite",
    highlight: true,
  },
];

export default function Membership() {
  const { user, profile, signInWithGoogle, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleJoin(planId: string) {
    if (!user) { signInWithGoogle(); return; }
    if (profile?.membership === planId) return;
    setLoading(planId);
    const { error } = await supabase.from("profiles").update({ membership: planId }).eq("id", user.id);
    if (!error) {
      await refreshProfile();
      toast({ title: `Welcome to ${PLANS.find((p) => p.id === planId)?.name}!` });
    }
    setLoading(null);
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-black/30 font-semibold mb-3">Membership</p>
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">Choose Your Altitude</h1>
          <p className="text-black/40 max-w-md mx-auto text-sm leading-relaxed">
            Unlock exclusive discounts, early access to limited editions, and a deeper connection to the Runway collective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = profile?.membership === plan.id || (!profile && plan.id === "free");
            return (
              <div
                key={plan.id}
                className={`relative p-7 rounded-3xl border transition-all ${
                  plan.highlight
                    ? "bg-black text-white border-black shadow-2xl scale-105"
                    : "bg-white/60 border-black/8 hover:border-black/20 hover:shadow-lg"
                }`}
                data-testid={`plan-${plan.id}`}
              >
                {plan.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black border-0 text-xs font-bold px-3">
                    Most Popular
                  </Badge>
                )}

                <h3 className={`text-lg font-black mb-1 ${plan.highlight ? "text-white" : "text-black"}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  {plan.price === 0 ? (
                    <span className={`text-3xl font-black ${plan.highlight ? "text-white" : "text-black"}`}>Free</span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-black ${plan.highlight ? "text-white" : "text-black"}`}>
                        ${plan.price}
                      </span>
                      <span className={`text-sm ${plan.highlight ? "text-white/50" : "text-black/40"}`}>/mo</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.highlight ? "text-amber-400" : "text-black/40"}`} />
                      <span className={plan.highlight ? "text-white/80" : "text-black/70"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleJoin(plan.id)}
                  disabled={isCurrent || loading === plan.id}
                  className={`w-full rounded-full font-semibold ${
                    plan.highlight
                      ? "bg-amber-400 text-black hover:bg-amber-300"
                      : isCurrent
                      ? "bg-black/10 text-black/40 cursor-default"
                      : "bg-black text-white hover:bg-black/80"
                  }`}
                  data-testid={`button-join-${plan.id}`}
                >
                  {loading === plan.id ? "Processing..." : isCurrent ? "Current Plan" : plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-black/30 mt-10">
          Payment processed via WhatsApp. Cancel anytime by contacting us.
        </p>
      </div>
    </div>
  );
}

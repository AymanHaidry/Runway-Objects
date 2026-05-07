import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { User, Save } from "lucide-react";

const TIER_LABELS: Record<string, { label: string; color: string; next?: string }> = {
  standard: { label: "Standard", color: "bg-gray-100 text-gray-800",   next: "Silver (5 orders)" },
  silver:   { label: "Silver",   color: "bg-gray-200 text-gray-800",   next: "Gold (15 orders)" },
  gold:     { label: "Gold",     color: "bg-amber-100 text-amber-800", next: "Platinum (30 orders)" },
  platinum: { label: "Platinum", color: "bg-purple-100 text-purple-800" },
};

export default function Account() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => { setName(profile?.full_name ?? ""); }, [profile]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] pt-24 flex flex-col items-center justify-center gap-6">
        <User className="h-16 w-16 text-black/15" />
        <div className="text-center">
          <h2 className="text-xl font-bold text-black mb-2">Sign in to access your account</h2>
          <p className="text-sm text-black/40 mb-6">View your orders, achievements, and collector tier.</p>
          <Button onClick={() => navigate("/login")} className="bg-black text-white rounded-full" data-testid="button-signin">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    if (!error) {
      await refreshProfile();
      toast({ title: "Profile updated" });
    }
    setSaving(false);
  }

  const tier = profile?.tier ?? "standard";
  const tierInfo = TIER_LABELS[tier];

  return (
    <div className="min-h-screen bg-[#FDF4F7] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-black text-black mb-8">My Account</h1>

        {/* Profile card */}
        <div className="p-6 rounded-3xl bg-white/60 border border-black/6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-black text-white text-xl">
                {profile?.full_name?.[0] ?? user.email?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-black text-lg">{profile?.full_name ?? "Collector"}</p>
              <p className="text-sm text-black/40">{user.email}</p>
              <span className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-semibold ${tierInfo.color}`}>
                {tierInfo.label} Tier
              </span>
            </div>
          </div>

          {tierInfo.next && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 mb-4">
              <p className="text-xs text-amber-700">
                Next tier: <strong>{tierInfo.next}</strong>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-xs uppercase tracking-wider text-black/40 font-semibold">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 rounded-xl border-black/10 bg-white/80"
                data-testid="input-name"
              />
            </div>
            <Button
              onClick={save}
              disabled={saving}
              className="bg-black text-white rounded-full"
              data-testid="button-save"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "My Orders",    path: "/orders" },
            { label: "Achievements", path: "/achievements" },
            { label: "Membership",   path: "/membership" },
            { label: "ROR Registry", path: "/registry" },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="p-5 rounded-2xl bg-white/60 border border-black/6 hover:border-black/20 transition-all text-left hover:shadow-md"
              data-testid={`button-nav-${label.toLowerCase().replace(/\s/g, "-")}`}
            >
              <p className="text-sm font-semibold text-black">{label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

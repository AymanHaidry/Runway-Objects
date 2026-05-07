// achievements.tsx
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Award, ArrowLeft, Lock } from "lucide-react";

const ALL_ACHIEVEMENTS = [
  { id: "pilots_dream",      name: "Pilot's Dream",       desc: "Chose your preferred aircraft type.",                    icon: "🛫", how: "Set a favourite aircraft type in your profile." },
  { id: "wingspan",          name: "Wingspan",             desc: "Owns 3+ aircraft from the same manufacturer.",           icon: "🦅", how: "Add 3+ aircraft from one maker to your collection." },
  { id: "cloud_nine",        name: "Cloud Nine",           desc: "Placed 9 orders with Runway Objects.",                   icon: "☁️", how: "Complete 9 purchases." },
  { id: "hangar_stories",    name: "Hangar Stories",       desc: "Left reviews on 5 or more products.",                    icon: "📖", how: "Review 5 products." },
  { id: "dreamliner_desk",   name: "Dreamliner Desk",      desc: "Owns 3+ Boeing 787 Dreamliner models.",                  icon: "✈️", how: "Purchase 3 Boeing 787 models." },
  { id: "airbase",           name: "Airbase",              desc: "Has a complete collection (10+ items).",                  icon: "🏗️", how: "Own 10+ collectibles." },
  { id: "aviary",            name: "Aviary",               desc: "Collected models from 5 different aircraft types.",      icon: "🪶", how: "Collect 5 distinct aircraft types." },
  { id: "jetset",            name: "Jetset",               desc: "Upgraded to Collector or Elite membership.",              icon: "🌍", how: "Join a paid membership tier." },
  { id: "terminal_one",      name: "Terminal One",         desc: "First ever purchase from Runway Objects.",               icon: "🎫", how: "Complete your first order." },
  { id: "runway_collective", name: "Runway Collective",    desc: "Referred a friend to Runway Objects.",                   icon: "🤝", how: "Share your referral link (coming soon)." },
  { id: "cockpit_objects",   name: "Cockpit Objects",      desc: "Reached Platinum collector tier.",                       icon: "🎖️", how: "Reach Platinum tier through purchases." },
];

export default function Achievements() {
  const { user, profile } = useAuth();
  const [, navigate] = useLocation();
  const earned = new Set(profile?.achievements ?? []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] pt-24 flex flex-col items-center justify-center gap-6">
        <Award className="h-16 w-16 text-black/15" />
        <div className="text-center">
          <h2 className="text-xl font-bold text-black mb-2">Sign in to view achievements</h2>
          <Button onClick={() => navigate("/login")} className="bg-black text-white rounded-full mt-4" data-testid="button-signin">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/account")} className="mb-6 rounded-full -ml-2" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" /> Account
        </Button>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-black/30 font-semibold mb-2">Your Wings</p>
            <h1 className="text-3xl font-black text-black">Achievements</h1>
          </div>
          <p className="text-sm text-black/40">{earned.size} / {ALL_ACHIEVEMENTS.length} unlocked</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {ALL_ACHIEVEMENTS.map((a) => {
            const unlocked = earned.has(a.id);
            return (
              <div
                key={a.id}
                className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${
                  unlocked ? "bg-white/80 border-amber-200 shadow-sm" : "bg-white/30 border-black/5 opacity-60"
                }`}
                data-testid={`achievement-${a.id}`}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${unlocked ? "bg-amber-50" : "bg-black/5"}`}>
                  {unlocked ? a.icon : <Lock className="h-5 w-5 text-black/20" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${unlocked ? "text-black" : "text-black/40"}`}>{a.name}</p>
                  <p className="text-xs text-black/40 mt-0.5">{a.desc}</p>
                  {!unlocked && <p className="text-xs text-black/30 mt-1 italic">{a.how}</p>}
                </div>
                {unlocked && <div className="text-amber-500 text-xs font-semibold shrink-0">Earned</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

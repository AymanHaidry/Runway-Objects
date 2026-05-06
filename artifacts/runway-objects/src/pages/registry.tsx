import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { RegistryEntry } from "@/lib/supabase";
import { Shield, Search, Lock, ChevronDown, ChevronUp } from "lucide-react";

export default function Registry() {
  const { user, profile, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [serviceTag, setServiceTag] = useState("");
  const [entry, setEntry] = useState<RegistryEntry | null>(null);
  const [searching, setSearching] = useState(false);
  const [myEntries, setMyEntries] = useState<RegistryEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("registry")
      .select("*")
      .eq("owner_id", user.id)
      .then(({ data }) => { if (data) setMyEntries(data as RegistryEntry[]); });
  }, [user]);

  async function searchByTag() {
    if (!serviceTag.trim()) return;
    setSearching(true);
    setEntry(null);
    const { data, error } = await supabase
      .from("registry")
      .select("*")
      .eq("service_tag", serviceTag.trim().toUpperCase())
      .single();
    if (error || !data) {
      toast({ title: "Not found", description: "No registry entry found for that service tag.", variant: "destructive" });
    } else {
      setEntry(data as RegistryEntry);
    }
    setSearching(false);
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-black/30 font-semibold">Secure</p>
              <h1 className="text-2xl font-black text-black leading-none">Runway Objects Registry</h1>
            </div>
          </div>
          <p className="text-sm text-black/40 max-w-md leading-relaxed">
            The ROR is a secure maintenance interface for verifying ownership, warranty status, and service history of Runway Objects collectibles.
          </p>
        </div>

        {/* Search */}
        <div className="p-6 rounded-3xl bg-white/60 border border-black/6 mb-8">
          <p className="text-sm font-semibold text-black mb-4">Search by Service Tag</p>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. RO-2024-A7X3"
              value={serviceTag}
              onChange={(e) => setServiceTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchByTag()}
              className="flex-1 rounded-full border-black/15 bg-white/80 font-mono text-sm"
              data-testid="input-service-tag"
            />
            <Button
              onClick={searchByTag}
              disabled={searching}
              className="bg-black text-white rounded-full px-5"
              data-testid="button-search-tag"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search result */}
        {entry && (
          <div className="mb-8 p-6 rounded-3xl bg-white border border-black/10 shadow-lg" data-testid="registry-entry">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-black/30 font-mono mb-1">{entry.service_tag}</p>
                <p className="font-bold text-black">Batch: {entry.batch_id}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-0 text-xs">Active</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Manufacturing Date", value: new Date(entry.manufacturing_date).toLocaleDateString() },
                { label: "Warranty Expires", value: new Date(entry.warranty_expires).toLocaleDateString() },
                { label: "Ownership Records", value: `${entry.ownership_history?.length ?? 0}` },
                { label: "Service Logs", value: `${entry.service_logs?.length ?? 0} entries` },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-black/3">
                  <p className="text-xs text-black/30 uppercase tracking-wider font-semibold mb-1">{label}</p>
                  <p className="text-sm font-semibold text-black">{value}</p>
                </div>
              ))}
            </div>

            {!user ? (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-black/3 text-sm text-black/40">
                <Lock className="h-4 w-4" />
                Sign in to view full service history and ownership details.
              </div>
            ) : (
              <>
                {entry.service_logs?.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-black/30 font-semibold mb-3">Service Logs</p>
                    <div className="space-y-2">
                      {entry.service_logs.map((log, i) => (
                        <div key={i} className="p-3 rounded-xl bg-black/3 text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold text-black">{log.type}</span>
                            <span className="text-black/30 text-xs">{new Date(log.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-black/50 text-xs">{log.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* My items */}
        {user ? (
          <div>
            <h2 className="text-lg font-bold text-black mb-4">My Registered Items</h2>
            {myEntries.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-white/40 border border-black/5">
                <p className="text-sm text-black/30">No registered items yet. Purchases are automatically registered.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myEntries.map((e) => (
                  <div key={e.id} className="p-5 rounded-2xl bg-white/60 border border-black/6" data-testid={`my-entry-${e.id}`}>
                    <button
                      className="w-full flex items-center justify-between"
                      onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                      data-testid={`button-expand-${e.id}`}
                    >
                      <div className="text-left">
                        <p className="font-mono text-sm font-semibold text-black">{e.service_tag}</p>
                        <p className="text-xs text-black/40">Batch: {e.batch_id}</p>
                      </div>
                      {expanded === e.id ? <ChevronUp className="h-4 w-4 text-black/30" /> : <ChevronDown className="h-4 w-4 text-black/30" />}
                    </button>
                    {expanded === e.id && (
                      <div className="mt-4 pt-4 border-t border-black/6 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-black/30">Manufactured:</span> <span className="font-semibold">{new Date(e.manufacturing_date).toLocaleDateString()}</span></div>
                          <div><span className="text-black/30">Warranty until:</span> <span className="font-semibold">{new Date(e.warranty_expires).toLocaleDateString()}</span></div>
                        </div>
                        {e.service_logs?.length > 0 && (
                          <div>
                            <p className="text-xs text-black/30 font-semibold uppercase tracking-wider mb-2">Service History</p>
                            {e.service_logs.map((log, i) => (
                              <div key={i} className="p-2 rounded-lg bg-black/3 text-xs mb-1">
                                <span className="font-semibold">{log.type}</span> · {new Date(log.date).toLocaleDateString()} · {log.notes}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-10 rounded-3xl bg-white/40 border border-black/6">
            <Lock className="h-10 w-10 text-black/15 mx-auto mb-4" />
            <p className="text-black/40 text-sm mb-4">Sign in to view your registered items and service history.</p>
            <Button onClick={signInWithGoogle} className="bg-black text-white rounded-full" data-testid="button-signin">
              Sign in with Google
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/supabase";
import { ArrowLeft, Globe, Plane, BookOpen } from "lucide-react";
import logoLight from "/logo-light.png";

export default function Passport() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from("products").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setProduct(data as Product);
    });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] pt-24 flex items-center justify-center">
        <div className="animate-pulse text-black/30 text-sm">Loading passport...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(`/product/${product.id}`)} className="mb-6 rounded-full -ml-2" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Product
        </Button>

        {/* Passport card */}
        <div className="rounded-3xl overflow-hidden border border-black/10 shadow-2xl bg-white">
          {/* Header */}
          <div className="bg-black p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)`,
              backgroundSize: "10px 10px",
            }} />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1 font-semibold">Runway Passport</p>
                <h1 className="text-xl font-black leading-tight">{product.name}</h1>
                <p className="text-white/50 text-sm mt-1">{product.aircraft_type} · {product.category}</p>
              </div>
              <img src={logoLight} alt="Runway Objects" className="h-12 w-auto opacity-80 invert" />
            </div>
          </div>

          {/* Hero image */}
          {product.images?.[0] && (
            <div className="aspect-video bg-gray-50">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Story */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-black/40" />
                <p className="text-xs uppercase tracking-widest text-black/40 font-semibold">The Story</p>
              </div>
              <p className="text-sm text-black/70 leading-relaxed">{product.description}</p>
            </div>

            {/* Edition lore */}
            {product.lore && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-amber-600" />
                  <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">Edition Lore</p>
                </div>
                <p className="text-sm text-black/70 leading-relaxed">{product.lore}</p>
                {product.edition && <p className="text-xs text-amber-600 font-semibold mt-2">{product.edition}</p>}
              </div>
            )}

            {/* Aircraft inspiration */}
            {product.inspiration && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="h-4 w-4 text-black/40" />
                  <p className="text-xs uppercase tracking-widest text-black/40 font-semibold">Aircraft Inspiration</p>
                </div>
                <p className="text-sm text-black/70 leading-relaxed">{product.inspiration}</p>
              </div>
            )}

            {/* Collectible identity */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Category", value: product.category },
                { label: "Aircraft Type", value: product.aircraft_type },
                { label: "Edition", value: product.edition ?? "Standard" },
                { label: "Warranty", value: `${product.warranty_months} months` },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl bg-black/3 border border-black/5">
                  <p className="text-xs text-black/30 uppercase tracking-wider font-semibold mb-1">{label}</p>
                  <p className="text-sm font-semibold text-black">{value}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-black/6 flex items-center justify-between">
              <p className="text-xs text-black/30 font-mono">Runway Passport · Public QR</p>
              <Button
                onClick={() => navigate(`/registry?tag=${product.batch_id ?? ""}`)}
                variant="outline"
                size="sm"
                className="rounded-full text-xs border-black/15"
                data-testid="button-view-ror"
              >
                View ROR Registry
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

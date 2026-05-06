import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/supabase";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["All", "Commercial", "Fighter", "Private", "Helicopter", "Concorde", "Space"];

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    async function load() {
      setLoading(true);
      let q = supabase.from("products").select("*").gt("stock", 0);
      if (category !== "All") q = q.eq("category", category);
      if (sort === "price-asc") q = q.order("price", { ascending: true });
      else if (sort === "price-desc") q = q.order("price", { ascending: false });
      else q = q.order("created_at", { ascending: false });

      const { data } = await q;
      let results = (data ?? []) as Product[];
      if (search.trim()) {
        const s = search.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.aircraft_type.toLowerCase().includes(s)
        );
      }
      setProducts(results);
      setLoading(false);
    }
    load();
  }, [category, sort, search]);

  return (
    <div className="min-h-screen bg-[#FDF4F7] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-black/30 font-semibold mb-2">The Collection</p>
          <h1 className="text-4xl font-black text-black">Runway Objects Store</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <Input
              placeholder="Search aircraft, editions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-full border-black/15 bg-white/80"
              data-testid="input-search"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-44 rounded-full border-black/15 bg-white/80" data-testid="select-sort">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-black/40" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-10">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              variant={category === c ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(c)}
              className={`rounded-full text-xs ${category === c ? "bg-black text-white" : "border-black/15 text-black/60 hover:border-black/40"}`}
              data-testid={`button-category-${c.toLowerCase()}`}
            >
              {c}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-black/5 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">✈</p>
            <p className="text-black/40 text-sm">No aircraft found. Try adjusting your search.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-black/30 mb-4">{products.length} items</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

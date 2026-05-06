import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Product, Review } from "@/lib/supabase";
import { ShoppingCart, Star, QrCode, ArrowLeft, Package } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { addItem } = useCart();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("products").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setProduct(data as Product);
    });
    supabase
      .from("reviews")
      .select("*, profiles(full_name, avatar_url)")
      .eq("product_id", id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setReviews(data as Review[]); });
  }, [id]);

  async function submitReview() {
    if (!user || !product) return;
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: product.id,
      user_id: user.id,
      rating: reviewRating,
      content: reviewText,
    });
    if (!error) {
      toast({ title: "Review submitted" });
      setReviewText("");
      setReviewRating(5);
      const { data } = await supabase
        .from("reviews")
        .select("*, profiles(full_name, avatar_url)")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });
      if (data) setReviews(data as Review[]);
    }
    setSubmitting(false);
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] pt-24 flex items-center justify-center">
        <div className="animate-pulse text-black/30">Loading...</div>
      </div>
    );
  }

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  return (
    <div className="min-h-screen bg-[#FDF4F7] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/store")} className="mb-6 rounded-full -ml-2" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Store
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-white/60 border border-black/6 mb-3">
              {product.images?.[activeImg] ? (
                <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-black/20 text-7xl">✈</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-black" : "border-transparent opacity-60"}`}
                    data-testid={`button-image-thumb-${i}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex gap-2 flex-wrap mb-3">
              <Badge className="bg-black/5 text-black/60 border-0 text-xs">{product.category}</Badge>
              <Badge className="bg-black/5 text-black/60 border-0 text-xs">{product.aircraft_type}</Badge>
              {product.edition && <Badge className="bg-amber-100 text-amber-800 border-0 text-xs">{product.edition}</Badge>}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-black mb-2">{product.name}</h1>

            {avgRating !== null && (
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-black/15"}`} />
                ))}
                <span className="text-sm text-black/40 ml-1">{avgRating.toFixed(1)} · {reviews.length} reviews</span>
              </div>
            )}

            <div className="text-3xl font-black text-black mb-6">${product.price.toFixed(2)}</div>

            {product.lore && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <p className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-1">Edition Lore</p>
                <p className="text-sm text-black/70 leading-relaxed">{product.lore}</p>
              </div>
            )}

            <p className="text-sm text-black/60 leading-relaxed mb-6">{product.description}</p>

            {product.inspiration && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-black/30 font-semibold mb-1">Aircraft Inspiration</p>
                <p className="text-sm text-black/60">{product.inspiration}</p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-black/15 rounded-full overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-black/60 hover:text-black text-lg" data-testid="button-qty-minus">−</button>
                <span className="px-2 text-sm font-semibold w-8 text-center" data-testid="text-qty">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-2 text-black/60 hover:text-black text-lg" data-testid="button-qty-plus">+</button>
              </div>
              <span className="text-xs text-black/30">{product.stock} in stock</span>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  addItem({ product_id: product.id, name: product.name, price: product.price, quantity: qty, image: product.images?.[0] ?? "" });
                  toast({ title: "Added to cart", description: `${qty}x ${product.name}` });
                }}
                disabled={product.stock === 0}
                className="flex-1 bg-black text-white hover:bg-black/80 rounded-full h-12 font-semibold"
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/passport/${product.id}`)}
                className="rounded-full border-black/15 h-12 px-4"
                data-testid="button-passport"
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white/60 border border-black/6">
              <div className="flex items-center gap-2 text-xs text-black/40">
                <Package className="h-3 w-3" />
                <span>Warranty: {product.warranty_months} months · Batch: {product.batch_id ?? "TBD"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <Separator className="my-12" />
        <div>
          <h2 className="text-xl font-bold text-black mb-6">Reviews ({reviews.length})</h2>

          {user && (
            <div className="mb-8 p-6 rounded-3xl bg-white/60 border border-black/6">
              <p className="text-sm font-semibold text-black mb-3">Leave a Review</p>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} onClick={() => setReviewRating(s)} data-testid={`button-star-${s}`}>
                    <Star className={`h-5 w-5 ${s <= reviewRating ? "fill-amber-400 text-amber-400" : "text-black/20"}`} />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Share your experience with this collectible..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="mb-3 rounded-xl border-black/10 bg-white/80"
                data-testid="input-review"
              />
              <Button
                onClick={submitReview}
                disabled={submitting || !reviewText.trim()}
                className="bg-black text-white rounded-full"
                data-testid="button-submit-review"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl bg-white/60 border border-black/6" data-testid={`review-${r.id}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={(r.profiles as any)?.avatar_url} />
                    <AvatarFallback className="bg-black text-white text-xs">
                      {(r.profiles as any)?.full_name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{(r.profiles as any)?.full_name ?? "Collector"}</p>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-black/15"}`} />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-black/30">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-black/60 leading-relaxed">{r.content}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-sm text-black/30 text-center py-8">No reviews yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

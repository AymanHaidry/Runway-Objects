import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/supabase";

interface ProductCardProps {
  product: Product;
  avgRating?: number;
  reviewCount?: number;
}

export function ProductCard({ product, avgRating, reviewCount }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] ?? "",
    });
    toast({ title: "Added to cart", description: product.name });
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className="group relative bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-black/6 hover:border-black/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black/20">
              <span className="text-5xl">✈</span>
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-semibold border-0">
              Featured
            </Badge>
          )}
          {product.edition && (
            <Badge className="absolute top-3 right-3 bg-black/80 text-white text-xs border-0 backdrop-blur-sm">
              {product.edition}
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-sm font-semibold text-black/50">Sold Out</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-black/40 uppercase tracking-wider mb-1 font-medium">{product.aircraft_type}</p>
          <h3 className="font-semibold text-sm text-black leading-tight mb-1 line-clamp-2">{product.name}</h3>

          {avgRating !== undefined && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-black/50">{avgRating.toFixed(1)} ({reviewCount})</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <span className="text-base font-bold text-black">${product.price.toFixed(2)}</span>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              size="sm"
              className="bg-black text-white hover:bg-black/80 rounded-full h-8 px-3 text-xs"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

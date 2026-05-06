import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { openWhatsApp } from "@/lib/whatsapp";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLocation } from "wouter";
import { Trash2, ArrowLeft, ShoppingBag, MessageCircle } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [placing, setPlacing] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;
    setPlacing(true);

    let orderId: string | undefined;

    if (user) {
      const { data } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          items,
          total,
          status: "pending",
          whatsapp_sent: true,
        })
        .select("id")
        .single();
      if (data) orderId = data.id;
    }

    openWhatsApp(items, total, orderId);
    clearCart();
    toast({ title: "Order sent to WhatsApp!", description: "We'll confirm your order shortly." });
    setPlacing(false);
    if (user) navigate("/orders");
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] pt-24 flex flex-col items-center justify-center gap-6">
        <ShoppingBag className="h-16 w-16 text-black/15" />
        <div className="text-center">
          <h2 className="text-xl font-bold text-black mb-2">Your cart is empty</h2>
          <p className="text-sm text-black/40">Start exploring the collection.</p>
        </div>
        <Button onClick={() => navigate("/store")} className="bg-black text-white rounded-full">
          Browse Store
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/store")} className="mb-6 rounded-full -ml-2" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
        </Button>
        <h1 className="text-3xl font-black text-black mb-8">Your Cart</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.product_id} className="flex gap-4 p-4 rounded-2xl bg-white/60 border border-black/6" data-testid={`cart-item-${item.product_id}`}>
              <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">✈</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black text-sm line-clamp-2">{item.name}</p>
                <p className="text-sm text-black/40 mt-0.5">${item.price.toFixed(2)} each</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center border border-black/15 rounded-full overflow-hidden text-sm">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="px-3 py-1 text-black/60 hover:text-black" data-testid={`button-minus-${item.product_id}`}>−</button>
                    <span className="px-2 font-semibold w-6 text-center" data-testid={`text-qty-${item.product_id}`}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="px-3 py-1 text-black/60 hover:text-black" data-testid={`button-plus-${item.product_id}`}>+</button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="font-bold text-black">${(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(item.product_id)} className="text-black/20 hover:text-red-500 transition-colors" data-testid={`button-remove-${item.product_id}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-3xl bg-white/60 border border-black/6">
          <div className="flex justify-between items-center mb-2 text-sm text-black/50">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-black">Total</span>
            <span className="font-black text-xl text-black">${total.toFixed(2)}</span>
          </div>
          <Separator className="mb-6" />
          <p className="text-xs text-black/40 mb-4 text-center">
            Payment is processed via WhatsApp. Our team will confirm your order and send payment instructions.
          </p>
          <Button
            onClick={handleCheckout}
            disabled={placing}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full h-12 text-base font-semibold"
            data-testid="button-checkout"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {placing ? "Processing..." : "Pay via WhatsApp"}
          </Button>
        </div>
      </div>
    </div>
  );
}

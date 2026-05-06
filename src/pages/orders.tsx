import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { openWhatsApp } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import type { Order } from "@/lib/supabase";
import { Package, MessageCircle, ArrowLeft } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function Orders() {
  const { user, signInWithGoogle } = useAuth();
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] pt-24 flex flex-col items-center justify-center gap-6">
        <Package className="h-16 w-16 text-black/15" />
        <div className="text-center">
          <h2 className="text-xl font-bold text-black mb-2">Sign in to view your orders</h2>
          <Button onClick={signInWithGoogle} className="bg-black text-white rounded-full mt-4" data-testid="button-signin">
            Sign in with Google
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
        <h1 className="text-3xl font-black text-black mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-black/5 animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <Package className="h-12 w-12 text-black/15 mx-auto mb-4" />
            <p className="text-black/40 text-sm">No orders yet.</p>
            <Button onClick={() => navigate("/store")} className="bg-black text-white rounded-full mt-4">
              Shop Now
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-5 rounded-2xl bg-white/60 border border-black/6" data-testid={`order-${order.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-black/30 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-black/40 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs border-0 ${STATUS_STYLES[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    {order.tracking_number && (
                      <span className="text-xs text-black/40 font-mono">{order.tracking_number}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-black/70">{item.name} ×{item.quantity}</span>
                      <span className="text-black/50">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-black/6">
                  <span className="font-bold text-black">${order.total.toFixed(2)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openWhatsApp(order.items, order.total, order.id)}
                    className="rounded-full border-green-200 text-green-700 hover:bg-green-50 text-xs"
                    data-testid={`button-whatsapp-${order.id}`}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" /> Contact Us
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

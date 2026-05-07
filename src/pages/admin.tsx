import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product, Order } from "@/lib/supabase";
import { Plus, Trash2, Edit2, Shield, Package, Users, BarChart3, Save } from "lucide-react";
import { useLocation } from "wouter";

function ProductForm({ product, onSaved, onCancel }: {
  product?: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    category: product?.category ?? "Commercial",
    aircraft_type: product?.aircraft_type ?? "",
    stock: product?.stock?.toString() ?? "0",
    edition: product?.edition ?? "",
    lore: product?.lore ?? "",
    inspiration: product?.inspiration ?? "",
    batch_id: product?.batch_id ?? "",
    manufacturing_date: product?.manufacturing_date ?? "",
    warranty_months: product?.warranty_months?.toString() ?? "12",
    images: product?.images?.join(", ") ?? "",
    featured: product?.featured ?? false,
  });
  const [saving, setSaving] = useState(false);

  function update(k: string, v: string | boolean) { setForm((f) => ({ ...f, [k]: v })); }

  async function save() {
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      aircraft_type: form.aircraft_type,
      stock: parseInt(form.stock),
      edition: form.edition || null,
      lore: form.lore || null,
      inspiration: form.inspiration || null,
      batch_id: form.batch_id || null,
      manufacturing_date: form.manufacturing_date || null,
      warranty_months: parseInt(form.warranty_months),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
    };
    const { error } = product?.id
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);
    if (!error) {
      toast({ title: product?.id ? "Product updated" : "Product created" });
      onSaved();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4 p-6 rounded-2xl bg-white/60 border border-black/6">
      <h3 className="font-bold text-black">{product ? "Edit Product" : "New Product"}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label className="text-xs">Name</Label>
          <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-1 rounded-xl" data-testid="input-product-name" />
        </div>
        <div>
          <Label className="text-xs">Price ($)</Label>
          <Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} className="mt-1 rounded-xl" data-testid="input-product-price" />
        </div>
        <div>
          <Label className="text-xs">Stock</Label>
          <Input type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} className="mt-1 rounded-xl" data-testid="input-product-stock" />
        </div>
        <div>
          <Label className="text-xs">Category</Label>
          <Select value={form.category} onValueChange={(v) => update("category", v)}>
            <SelectTrigger className="mt-1 rounded-xl" data-testid="select-category"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Commercial", "Fighter", "Private", "Helicopter", "Concorde", "Space"].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Aircraft Type</Label>
          <Input value={form.aircraft_type} onChange={(e) => update("aircraft_type", e.target.value)} className="mt-1 rounded-xl" placeholder="e.g. Boeing 747" data-testid="input-aircraft-type" />
        </div>
        <div>
          <Label className="text-xs">Edition</Label>
          <Input value={form.edition} onChange={(e) => update("edition", e.target.value)} className="mt-1 rounded-xl" placeholder="e.g. First Class" data-testid="input-edition" />
        </div>
        <div>
          <Label className="text-xs">Batch ID</Label>
          <Input value={form.batch_id} onChange={(e) => update("batch_id", e.target.value)} className="mt-1 rounded-xl" placeholder="e.g. RO-2024-A" data-testid="input-batch-id" />
        </div>
        <div>
          <Label className="text-xs">Warranty (months)</Label>
          <Input type="number" value={form.warranty_months} onChange={(e) => update("warranty_months", e.target.value)} className="mt-1 rounded-xl" data-testid="input-warranty" />
        </div>
        <div>
          <Label className="text-xs">Manufacturing Date</Label>
          <Input type="date" value={form.manufacturing_date} onChange={(e) => update("manufacturing_date", e.target.value)} className="mt-1 rounded-xl" data-testid="input-mfg-date" />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Description</Label>
          <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="mt-1 rounded-xl" rows={3} data-testid="input-description" />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Edition Lore</Label>
          <Textarea value={form.lore} onChange={(e) => update("lore", e.target.value)} className="mt-1 rounded-xl" rows={2} data-testid="input-lore" />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Aircraft Inspiration</Label>
          <Textarea value={form.inspiration} onChange={(e) => update("inspiration", e.target.value)} className="mt-1 rounded-xl" rows={2} data-testid="input-inspiration" />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Image URLs (comma-separated)</Label>
          <Input value={form.images} onChange={(e) => update("images", e.target.value)} className="mt-1 rounded-xl" placeholder="https://..." data-testid="input-images" />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} data-testid="checkbox-featured" />
          <Label htmlFor="featured" className="text-sm cursor-pointer">Featured product</Label>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={save} disabled={saving} className="bg-black text-white rounded-full" data-testid="button-save-product">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Product"}
        </Button>
        <Button variant="outline" onClick={onCancel} className="rounded-full" data-testid="button-cancel">Cancel</Button>
      </div>
    </div>
  );
}

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered"] as const;

export default function Admin() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 0 });
  const [editProduct, setEditProduct] = useState<Product | null | "new">(null);

  async function loadProducts() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data as Product[]);
  }

  async function loadOrders() {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50);
    if (data) setOrders(data as Order[]);
  }

  async function loadStats() {
    const [p, o, u] = await Promise.all([
      supabase.from("products").select("id", { count: "exact" }),
      supabase.from("orders").select("total"),
      supabase.from("profiles").select("id", { count: "exact" }),
    ]);
    setStats({
      products: p.count ?? 0,
      orders: o.count ?? 0,
      revenue: (o.data ?? []).reduce((s: number, r: any) => s + (r.total ?? 0), 0),
      users: u.count ?? 0,
    });
  }

 // TEMP: admin check disabled
// if (!profile?.is_admin) {
//   return (
//     <div className="min-h-screen bg-[#FDF4F7] pt-24 flex flex-col items-center justify-center gap-4">
//       <Shield className="h-16 w-16 text-black/15" />
//       <p className="text-black/40 text-sm">You don't have admin access.</p>
//       <Button onClick={() => navigate("/")} variant="outline" className="rounded-full">Go Home</Button>
//     </div>
//   );
// }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) { toast({ title: "Deleted" }); loadProducts(); }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    loadOrders();
    toast({ title: "Status updated" });
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-6 w-6 text-black" />
          <h1 className="text-3xl font-black text-black">Admin Panel</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: "Products", value: stats.products },
            { icon: BarChart3, label: "Orders", value: stats.orders },
            { icon: Users, label: "Users", value: stats.users },
            { icon: BarChart3, label: "Revenue", value: `$${stats.revenue.toFixed(2)}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-5 rounded-2xl bg-white/60 border border-black/6" data-testid={`stat-${label.toLowerCase()}`}>
              <Icon className="h-4 w-4 text-black/30 mb-2" />
              <p className="text-2xl font-black text-black">{value}</p>
              <p className="text-xs text-black/40 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6 bg-white/60 border border-black/6 rounded-full p-1">
            <TabsTrigger value="products" className="rounded-full text-sm" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-full text-sm" data-testid="tab-orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setEditProduct("new")} className="bg-black text-white rounded-full" data-testid="button-new-product">
                <Plus className="mr-2 h-4 w-4" /> New Product
              </Button>
            </div>

            {(editProduct === "new" || (editProduct && editProduct !== "new")) && (
              <div className="mb-6">
                <ProductForm
                  product={editProduct !== "new" ? editProduct : null}
                  onSaved={() => { setEditProduct(null); loadProducts(); loadStats(); }}
                  onCancel={() => setEditProduct(null)}
                />
              </div>
            )}

            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-black/6" data-testid={`admin-product-${p.id}`}>
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">✈</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-black truncate">{p.name}</p>
                    <p className="text-xs text-black/40">${p.price} · Stock: {p.stock} · {p.category}</p>
                  </div>
                  {p.featured && <Badge className="bg-amber-100 text-amber-800 border-0 text-xs">Featured</Badge>}
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => setEditProduct(p)} data-testid={`button-edit-${p.id}`}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-600" data-testid={`button-delete-${p.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="p-5 rounded-2xl bg-white/60 border border-black/6" data-testid={`admin-order-${order.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-xs text-black/30">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="font-bold text-black">${order.total.toFixed(2)}</p>
                      <p className="text-xs text-black/40">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v)}>
                      <SelectTrigger className="w-36 rounded-full text-xs h-8" data-testid={`select-status-${order.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-xs text-black/40 space-y-0.5">
                    {order.items?.map((item, i) => (
                      <p key={i}>{item.name} ×{item.quantity} — ${(item.price * item.quantity).toFixed(2)}</p>
                    ))}
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-sm text-black/30 py-12">No orders yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

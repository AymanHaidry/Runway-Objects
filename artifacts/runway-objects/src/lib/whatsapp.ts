import type { CartItem } from "./supabase";

const WHATSAPP_NUMBER = "1234567890";

export function buildWhatsAppUrl(items: CartItem[], total: number, orderId?: string): string {
  const itemLines = items
    .map((i) => `• ${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
    .join("\n");

  const message = [
    "✈️ *New Runway Objects Order*",
    orderId ? `Order ID: #${orderId}` : "",
    "",
    "*Items:*",
    itemLines,
    "",
    `*Total: $${total.toFixed(2)}*`,
    "",
    "Please confirm this order and provide payment details. Thank you!",
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(items: CartItem[], total: number, orderId?: string) {
  window.open(buildWhatsAppUrl(items, total, orderId), "_blank");
}

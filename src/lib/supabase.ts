import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  tier: "standard" | "silver" | "gold" | "platinum";
  membership: "free" | "collector" | "elite";
  achievements: string[];
  created_at: string;
  is_admin: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  aircraft_type: string;
  images: string[];
  stock: number;
  edition: string | null;
  lore: string | null;
  inspiration: string | null;
  batch_id: string | null;
  manufacturing_date: string | null;
  warranty_months: number;
  featured: boolean;
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  content: string;
  created_at: string;
  profiles?: UserProfile;
};

export type Order = {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  tracking_number: string | null;
  created_at: string;
  whatsapp_sent: boolean;
};

export type CartItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type RegistryEntry = {
  id: string;
  product_id: string;
  service_tag: string;
  owner_id: string | null;
  manufacturing_date: string;
  batch_id: string;
  warranty_expires: string;
  service_logs: ServiceLog[];
  ownership_history: OwnershipRecord[];
  created_at: string;
};

export type ServiceLog = {
  date: string;
  type: string;
  notes: string;
  technician: string;
};

export type OwnershipRecord = {
  user_id: string;
  transferred_at: string;
  notes: string;
};

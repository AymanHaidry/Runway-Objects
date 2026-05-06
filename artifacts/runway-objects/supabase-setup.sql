-- ============================================================
-- RUNWAY OBJECTS — Supabase Setup SQL
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  tier TEXT NOT NULL DEFAULT 'standard' CHECK (tier IN ('standard', 'silver', 'gold', 'platinum')),
  membership TEXT NOT NULL DEFAULT 'free' CHECK (membership IN ('free', 'collector', 'elite')),
  achievements TEXT[] NOT NULL DEFAULT '{}',
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Commercial',
  aircraft_type TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  edition TEXT,
  lore TEXT,
  inspiration TEXT,
  batch_id TEXT,
  manufacturing_date DATE,
  warranty_months INTEGER NOT NULL DEFAULT 12,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, user_id)
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered')),
  tracking_number TEXT,
  whatsapp_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- REGISTRY (Runway Objects Registry — ROR)
-- ============================================================
CREATE TABLE IF NOT EXISTS registry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  service_tag TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  manufacturing_date DATE NOT NULL DEFAULT NOW(),
  batch_id TEXT NOT NULL DEFAULT '',
  warranty_expires DATE NOT NULL DEFAULT (NOW() + INTERVAL '12 months'),
  service_logs JSONB NOT NULL DEFAULT '[]',
  ownership_history JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE registry ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Products: everyone can read, only admins can modify
CREATE POLICY "products_select_all" ON products FOR SELECT USING (TRUE);
CREATE POLICY "products_admin_insert" ON products FOR INSERT
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()));
CREATE POLICY "products_admin_update" ON products FOR UPDATE
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));
CREATE POLICY "products_admin_delete" ON products FOR DELETE
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Reviews: everyone can read, authenticated users can insert own
CREATE POLICY "reviews_select_all" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Orders: users can read/insert own, admins can read all
CREATE POLICY "orders_select_own" ON orders FOR SELECT
  USING (auth.uid() = user_id OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));
CREATE POLICY "orders_insert_own" ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_update" ON orders FOR UPDATE
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Registry: public service_tag lookup, owners see own, admins see all
CREATE POLICY "registry_select_public" ON registry FOR SELECT USING (TRUE);
CREATE POLICY "registry_admin_all" ON registry FOR ALL
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- ============================================================
-- SEED DATA (sample products)
-- ============================================================
INSERT INTO products (name, description, price, category, aircraft_type, stock, edition, lore, inspiration, batch_id, manufacturing_date, warranty_months, featured)
VALUES
(
  'Boeing 747-400 Heritage Edition',
  'The Queen of the Skies, immortalised in die-cast aluminium. This 1:200 scale collectible captures the iconic hump and four-engine silhouette of the most recognisable aircraft ever built.',
  189.00, 'Commercial', 'Boeing 747-400', 12,
  'Heritage',
  'Born from the vision of Joe Sutter and a team of 50,000 engineers, the 747 changed everything. This edition pays tribute to the original rollout in 1968 — serial number 001.',
  'Pan Am''s Clipper Young America, the first 747 in commercial service, January 22 1970.',
  'RO-2024-B747', '2024-01-15', 24, TRUE
),
(
  'Concorde Alpha Foxtrot',
  'Supersonic elegance frozen in time. The slender delta wing, drooping nose, and four Olympus engines in exquisite 1:144 scale. Machined from zinc alloy, finished in British Airways livery.',
  349.00, 'Concorde', 'Concorde', 5,
  'First Class',
  'G-BOAF was the last Concorde to fly commercially, touching down at Heathrow on 24 October 2003. This piece carries its spirit.',
  'British Airways Concorde G-BOAF — the last commercial supersonic flight.',
  'RO-2024-CONC', '2024-02-10', 24, TRUE
),
(
  'F-14 Tomcat Jolly Rogers',
  'The most recognisable fighter jet in history, in the legendary VF-84 Jolly Rogers black and white skull livery. Variable-sweep wings set in the swept position. 1:72 scale.',
  249.00, 'Fighter', 'F-14 Tomcat', 8,
  'Squadron Edition',
  'VF-84 flew from USS Nimitz from 1977 to 1995. Their skull-and-crossbones marking became the most feared symbol of American naval aviation.',
  'The F-14A Tomcat, bureau number 160399, displayed at the National Naval Aviation Museum.',
  'RO-2024-F14', '2024-03-01', 12, TRUE
),
(
  'Boeing 787-9 Dreamliner',
  'The aircraft that redefined long-haul travel, now in your hands. Carbon fibre-inspired finish, LED-illuminated cabin windows, and whisper-quiet electric motors for slow rotation display.',
  219.00, 'Commercial', 'Boeing 787', 20,
  'Standard',
  'The Dreamliner''s composite fuselage changed aviation forever. This piece is for those who dream in altitude.',
  'ANA''s first 787-9, JA830A, delivered September 2014.',
  'RO-2024-B787', '2024-01-20', 24, TRUE
),
(
  'SR-71 Blackbird Midnight Run',
  'The fastest air-breathing aircraft ever built, in stealth black with titanium-finish detailing. Runs at Mach 3.2 in your imagination, displayed on a museum-grade acrylic stand.',
  399.00, 'Fighter', 'SR-71 Blackbird', 3,
  'Black Label',
  'The SR-71 was retired in 1999 after setting a transcontinental speed record that still stands. This is the plane that disappeared before radars could catch it.',
  'SR-71A, serial 61-7972, the holder of the Los Angeles to Washington D.C. speed record.',
  'RO-2024-SR71', '2024-04-01', 24, FALSE
),
(
  'A380 Emirates First Class',
  'The world''s largest passenger aircraft in Emirates'' signature livery. Double-deck fuselage detail, all four engine nacelles individually finished, retractable landing gear.',
  279.00, 'Commercial', 'Airbus A380', 15,
  'First Class',
  'Emirates operates the largest A380 fleet in the world. Flight EK001 departs Dubai every day, and this piece carries that daily miracle.',
  'Emirates A6-EEA, the first A380 delivered to Emirates, July 28 2008.',
  'RO-2024-A380', '2024-02-28', 24, FALSE
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- MAKE YOUR ACCOUNT ADMIN
-- After signing in with Google, run this with your user ID:
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'your@email.com';
-- ============================================================

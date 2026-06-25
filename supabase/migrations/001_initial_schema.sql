-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- TABLES (all tables first, policies after)
-- ============================================================

-- PROFILES (auto-created from auth.users via trigger)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- VENUES
CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  address text,
  phone text,
  wifi_password text,
  logo_url text,
  cover_url text,
  active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  visible boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- MENU ITEMS
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2),
  old_price numeric(10,2),
  image_url text,
  visible boolean DEFAULT true NOT NULL,
  unavailable boolean DEFAULT false NOT NULL,
  is_new boolean DEFAULT false NOT NULL,
  is_featured boolean DEFAULT false NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- ITEM TRANSLATIONS
CREATE TABLE IF NOT EXISTS item_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES menu_items ON DELETE CASCADE NOT NULL,
  locale text NOT NULL,
  name text NOT NULL,
  description text,
  UNIQUE (item_id, locale)
);

-- STAFF MEMBERS
CREATE TABLE IF NOT EXISTS staff_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('editor', 'viewer')),
  invite_token text UNIQUE,
  invited_at timestamptz DEFAULT now() NOT NULL,
  accepted_at timestamptz
);

-- SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles NOT NULL,
  stripe_customer_id text UNIQUE NOT NULL,
  stripe_subscription_id text UNIQUE,
  plan text NOT NULL CHECK (plan IN ('trial', 'pro', 'chain')) DEFAULT 'trial',
  status text NOT NULL DEFAULT 'trialing',
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues          ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- profiles
CREATE POLICY "users can read own profile"
  ON profiles FOR SELECT USING (id = auth.uid());

CREATE POLICY "users can update own profile"
  ON profiles FOR UPDATE USING (id = auth.uid());

-- venues
CREATE POLICY "owners can manage their venues"
  ON venues FOR ALL
  USING (owner_id = auth.uid());

CREATE POLICY "staff can read assigned venues"
  ON venues FOR SELECT
  USING (
    id IN (
      SELECT venue_id FROM staff_members
      WHERE user_id = auth.uid()
      AND accepted_at IS NOT NULL
    )
  );

CREATE POLICY "public can read active venues"
  ON venues FOR SELECT
  USING (active = true);

-- categories
CREATE POLICY "owners can manage categories"
  ON categories FOR ALL
  USING (
    venue_id IN (SELECT id FROM venues WHERE owner_id = auth.uid())
  );

CREATE POLICY "staff editors can manage categories"
  ON categories FOR ALL
  USING (
    venue_id IN (
      SELECT venue_id FROM staff_members
      WHERE user_id = auth.uid() AND role = 'editor' AND accepted_at IS NOT NULL
    )
  );

CREATE POLICY "public can read visible categories"
  ON categories FOR SELECT
  USING (visible = true);

-- menu_items
CREATE POLICY "owners can manage menu items"
  ON menu_items FOR ALL
  USING (
    category_id IN (
      SELECT c.id FROM categories c
      JOIN venues v ON v.id = c.venue_id
      WHERE v.owner_id = auth.uid()
    )
  );

CREATE POLICY "staff editors can manage menu items"
  ON menu_items FOR ALL
  USING (
    category_id IN (
      SELECT c.id FROM categories c
      JOIN staff_members sm ON sm.venue_id = c.venue_id
      WHERE sm.user_id = auth.uid() AND sm.role = 'editor' AND sm.accepted_at IS NOT NULL
    )
  );

CREATE POLICY "public can read visible menu items"
  ON menu_items FOR SELECT
  USING (visible = true);

-- item_translations
CREATE POLICY "owners can manage translations"
  ON item_translations FOR ALL
  USING (
    item_id IN (
      SELECT mi.id FROM menu_items mi
      JOIN categories c ON c.id = mi.category_id
      JOIN venues v ON v.id = c.venue_id
      WHERE v.owner_id = auth.uid()
    )
  );

CREATE POLICY "public can read translations"
  ON item_translations FOR SELECT
  USING (true);

-- staff_members
CREATE POLICY "owners can manage staff"
  ON staff_members FOR ALL
  USING (
    venue_id IN (SELECT id FROM venues WHERE owner_id = auth.uid())
  );

CREATE POLICY "staff can read own membership"
  ON staff_members FOR SELECT
  USING (user_id = auth.uid());

-- subscriptions
CREATE POLICY "owners can read own subscription"
  ON subscriptions FOR SELECT
  USING (owner_id = auth.uid());

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

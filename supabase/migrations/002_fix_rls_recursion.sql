-- Fix infinite recursion in RLS policies.
--
-- Root cause: venues → staff_members → venues creates a cycle.
-- Solution: a SECURITY DEFINER function that reads venues bypassing RLS,
-- used wherever policies need to resolve "which venues does auth.uid() own?"

CREATE OR REPLACE FUNCTION get_my_venue_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT id FROM venues WHERE owner_id = auth.uid()
$$;

-- ----------------------------------------------------------------
-- staff_members: was querying venues, triggering venues RLS → cycle
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "owners can manage staff" ON staff_members;
CREATE POLICY "owners can manage staff"
  ON staff_members FOR ALL
  USING (venue_id IN (SELECT get_my_venue_ids()));

-- ----------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "owners can manage categories" ON categories;
CREATE POLICY "owners can manage categories"
  ON categories FOR ALL
  USING (venue_id IN (SELECT get_my_venue_ids()));

-- ----------------------------------------------------------------
-- menu_items
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "owners can manage menu items" ON menu_items;
CREATE POLICY "owners can manage menu items"
  ON menu_items FOR ALL
  USING (
    category_id IN (
      SELECT id FROM categories
      WHERE venue_id IN (SELECT get_my_venue_ids())
    )
  );

-- ----------------------------------------------------------------
-- item_translations
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "owners can manage translations" ON item_translations;
CREATE POLICY "owners can manage translations"
  ON item_translations FOR ALL
  USING (
    item_id IN (
      SELECT mi.id FROM menu_items mi
      JOIN categories c ON c.id = mi.category_id
      WHERE c.venue_id IN (SELECT get_my_venue_ids())
    )
  );

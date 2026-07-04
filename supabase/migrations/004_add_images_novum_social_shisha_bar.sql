-- Add category-representative images to Novum Social Shisha Bar's menu items.
--
-- Urban Legend's own dish photos are proprietary and can't be copied, so each
-- category gets one free-to-use stock photo (bundled in /public/menu/novum-social-shisha-bar/),
-- reused across the items in that category.

DO $$
DECLARE
  v_venue_id uuid;
BEGIN
  SELECT id INTO v_venue_id FROM venues WHERE slug = 'novum-social-shisha-bar';

  IF v_venue_id IS NULL THEN
    RAISE EXCEPTION 'Venue novum-social-shisha-bar not found — run migration 003 first.';
  END IF;

  UPDATE menu_items SET image_url = '/menu/novum-social-shisha-bar/fruity-hookah.jpg'
  WHERE category_id IN (SELECT id FROM categories WHERE venue_id = v_venue_id AND name = 'Наргиле - Плодови миксове');

  UPDATE menu_items SET image_url = '/menu/novum-social-shisha-bar/dessert-hookah.jpg'
  WHERE category_id IN (SELECT id FROM categories WHERE venue_id = v_venue_id AND name = 'Наргиле - Десертни миксове');

  UPDATE menu_items SET image_url = '/menu/novum-social-shisha-bar/fresh-mint-hookah.jpg'
  WHERE category_id IN (SELECT id FROM categories WHERE venue_id = v_venue_id AND name = 'Наргиле - Свежи и ментови миксове');

  UPDATE menu_items SET image_url = '/menu/novum-social-shisha-bar/cocktails.jpg'
  WHERE category_id IN (SELECT id FROM categories WHERE venue_id = v_venue_id AND name = 'Коктейли');

  UPDATE menu_items SET image_url = '/menu/novum-social-shisha-bar/lemonades.jpg'
  WHERE category_id IN (SELECT id FROM categories WHERE venue_id = v_venue_id AND name = 'Лимонади и студен чай');

  UPDATE menu_items SET image_url = '/menu/novum-social-shisha-bar/hot-drinks.jpg'
  WHERE category_id IN (SELECT id FROM categories WHERE venue_id = v_venue_id AND name = 'Топли напитки');
END $$;

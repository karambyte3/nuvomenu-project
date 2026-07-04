-- Seed venue: Novum Social Shisha Bar
--
-- Menu content curated from https://urbanlegend.bg/menu/ (hookah flavor
-- catalog + bar menu), condensed into a practical set of categories/items
-- rather than importing the full 334-flavor catalog verbatim.
--
-- Owner is resolved by email at migration time. Change the email below
-- if the venue should belong to a different account.

DO $$
DECLARE
  v_owner_id uuid;
  v_venue_id uuid;
  v_cat_id uuid;
BEGIN
  SELECT id INTO v_owner_id FROM auth.users WHERE email = 'stefankalenderov@gmail.com' LIMIT 1;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'No auth.users row found for the given email — update the email in this migration before running it.';
  END IF;

  -- ============================================================
  -- VENUE
  -- ============================================================
  INSERT INTO venues (owner_id, name, slug, description, active)
  VALUES (
    v_owner_id,
    'Novum Social Shisha Bar',
    'novum-social-shisha-bar',
    'A social hookah lounge with premium shisha blends, cocktails, and coffee.',
    true
  )
  RETURNING id INTO v_venue_id;

  -- ============================================================
  -- CATEGORY: Наргиле - Плодови миксове (Fruity hookah mixes)
  -- ============================================================
  INSERT INTO categories (venue_id, name, position)
  VALUES (v_venue_id, 'Наргиле - Плодови миксове', 0)
  RETURNING id INTO v_cat_id;

  INSERT INTO menu_items (category_id, name, description, price, position, is_featured) VALUES
  (v_cat_id, 'Candy Crush Saga', 'Свеж и сладък candy микс с доминиращ лайм вкус и мек кремообразен завършек. Лайм, кисел бонбон, ягода, крем, близалка, карамел.', 32.00, 0, true),
  (v_cat_id, 'Summer Lemonade', 'Сочен микс с ярък грейпфрут, сладка малина, киселинност от киви и мек прасковен послевкус.', 32.00, 1, false),
  (v_cat_id, 'Kiwi Berry Smoothie', 'Нежен смути микс: сладък банан, сочна ягода и лека свежест от киви.', 32.00, 2, false),
  (v_cat_id, 'Double Apple by Darkside', 'Сочен микс от сладка червена и свежа зелена ябълка с лека киселинност. Без анасон.', 30.00, 3, true),
  (v_cat_id, 'Berry Citrus Rush', 'Освежаващ микс с ярка киселинност на цитруси и сладостта на плодове. Лимон, лайм, ягода, лимонада, грейпфрут, малина.', 32.00, 4, false),
  (v_cat_id, 'Skittle Paradise Punch', 'Вкус на сладко-кисел горски плод със приятна нотка на ананас и череша.', 34.00, 5, false);

  -- ============================================================
  -- CATEGORY: Наргиле - Десертни миксове (Dessert hookah mixes)
  -- ============================================================
  INSERT INTO categories (venue_id, name, position)
  VALUES (v_venue_id, 'Наргиле - Десертни миксове', 1)
  RETURNING id INTO v_cat_id;

  INSERT INTO menu_items (category_id, name, description, price, position, is_featured) VALUES
  (v_cat_id, 'Chocolate Orange Brownie', 'Плътен десертен микс с богат шоколадов вкус и лека цитрусова свежест.', 33.00, 0, false),
  (v_cat_id, 'Nesquik', 'Нежен десертен микс с наситено какао, мека ванилия и сладки нотки на карамел.', 32.00, 1, false),
  (v_cat_id, 'Caramel Dream', 'Нежен десертен микс: кремообразен чийзкейк, меки нотки на Baileys и сладък карамел.', 34.00, 2, true),
  (v_cat_id, 'The Best Dessert in City', 'Сладко десертно, за всеки ценител на "диабетните" наргилета. Мляко, бисквитка, брауни, шоколад, крем, ванилия.', 34.00, 3, false),
  (v_cat_id, 'Cheesecake Dream', 'Нежен микс от кремообразен cheesecake, богат карамел и мека ванилия — сладко и плътно изживяване с десертен завършек.', 34.00, 4, true);

  -- ============================================================
  -- CATEGORY: Наргиле - Свежи и ментови миксове (Fresh / mint hookah mixes)
  -- ============================================================
  INSERT INTO categories (venue_id, name, position)
  VALUES (v_venue_id, 'Наргиле - Свежи и ментови миксове', 2)
  RETURNING id INTO v_cat_id;

  INSERT INTO menu_items (category_id, name, description, price, position, is_featured) VALUES
  (v_cat_id, 'Леко, за ценители', 'Свеж микс, за пушачи, които обичат дименето и лекия вкус. Диня, пъпеш, праскова.', 30.00, 0, false),
  (v_cat_id, 'Pomelow Garden', 'Освежаващ микс с ярка цитрусова свежест на помело и нотки на босилек — лек и необичаен.', 32.00, 1, false),
  (v_cat_id, 'Green Fusion', 'Киви и помело се съчетават с фин нюанс на босилек за свеж, екзотичен и ароматен вкус.', 32.00, 2, false),
  (v_cat_id, 'Пушиш и ревеш', 'За любители на ментата. Тръстикова мента, мента.', 28.00, 3, false),
  (v_cat_id, 'Old School - Grape with Black Currant', 'Само ценителите и "старите пушачи" ще го разберат. По избор може да се добави мента или айс.', 30.00, 4, false);

  -- ============================================================
  -- CATEGORY: Коктейли (Cocktails)
  -- ============================================================
  INSERT INTO categories (venue_id, name, position)
  VALUES (v_venue_id, 'Коктейли', 3)
  RETURNING id INTO v_cat_id;

  INSERT INTO menu_items (category_id, name, description, price, position, is_new, is_featured) VALUES
  (v_cat_id, 'Novum Cloud', 'Signature house cocktail, light and citrus-forward.', 14.00, 0, true, true),
  (v_cat_id, 'Pinko', 'Best seller — fruity and refreshing.', 15.50, 1, false, true),
  (v_cat_id, 'Viola Gin', 'Best seller — floral gin serve.', 15.50, 2, false, false),
  (v_cat_id, 'Gin Tonic', 'Classic gin and tonic.', 16.50, 3, true, false),
  (v_cat_id, 'Berry Gin', 'Gin with mixed berries.', 16.50, 4, true, false),
  (v_cat_id, 'Aloe and Cucumber Gin', 'Gin with aloe vera and cucumber.', 16.50, 5, true, false),
  (v_cat_id, 'Strawberry Spritz', 'Light strawberry spritz.', 14.00, 6, false, false),
  (v_cat_id, 'Aperol Spritz', 'Classic Aperol spritz.', 14.00, 7, false, false),
  (v_cat_id, 'Hugo Spritz', 'Elderflower and mint spritz.', 14.00, 8, false, false),
  (v_cat_id, 'Urban Sangria', 'House sangria.', 14.00, 9, false, false);

  -- ============================================================
  -- CATEGORY: Лимонади и студен чай (Lemonades & iced tea)
  -- ============================================================
  INSERT INTO categories (venue_id, name, position)
  VALUES (v_venue_id, 'Лимонади и студен чай', 4)
  RETURNING id INTO v_cat_id;

  INSERT INTO menu_items (category_id, name, description, price, position) VALUES
  (v_cat_id, 'Лимонада по избор (400 мл)', 'Homemade lemonade, choice of flavor.', 8.00, 0),
  (v_cat_id, 'Лимонада по избор (1200 мл)', 'Homemade lemonade, choice of flavor, family size.', 17.50, 1),
  (v_cat_id, 'Домашен студен чай - Ябълка и Круша', 'Homemade iced tea, apple and pear.', 7.00, 2),
  (v_cat_id, 'Домашен студен чай - Бери Бленд', 'Homemade iced tea, berry blend.', 7.00, 3),
  (v_cat_id, 'Домашна Грейпфрутада', 'Homemade grapefruit lemonade.', 7.50, 4),
  (v_cat_id, 'Домашна Оранжада', 'Homemade orangeade.', 7.50, 5),
  (v_cat_id, 'Домашна Цитронада', 'Homemade citronade.', 7.50, 6);

  -- ============================================================
  -- CATEGORY: Топли напитки (Hot drinks)
  -- ============================================================
  INSERT INTO categories (venue_id, name, position)
  VALUES (v_venue_id, 'Топли напитки', 5)
  RETURNING id INTO v_cat_id;

  INSERT INTO menu_items (category_id, name, description, price, position) VALUES
  (v_cat_id, 'Еспресо', '100% Arabica.', 4.00, 0),
  (v_cat_id, 'Капучино', 'Classic cappuccino.', 5.50, 1),
  (v_cat_id, 'Лате', 'Classic latte.', 7.00, 2),
  (v_cat_id, 'Лате с вкус', 'Flavored latte.', 8.00, 3),
  (v_cat_id, 'Виенско кафе', 'Vienna-style coffee with whipped cream.', 5.50, 4),
  (v_cat_id, 'Горещ шоколад', 'Rich hot chocolate.', 8.00, 5),
  (v_cat_id, 'Био чай', 'Organic tea selection.', 6.50, 6),
  (v_cat_id, 'Грог', 'Warm rum-based winter drink.', 11.50, 7);

  RAISE NOTICE 'Seeded venue Novum Social Shisha Bar (id: %) with slug novum-social-shisha-bar', v_venue_id;
END $$;

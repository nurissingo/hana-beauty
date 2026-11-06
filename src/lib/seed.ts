import type { DatabaseSync } from "node:sqlite";
import { buildSearch } from "./search";

const categories = [
  { slug: "serums", ru: "Сыворотки и ампулы", kz: "Сарысулар мен ампулалар" },
  { slug: "cleansing", ru: "Очищение", kz: "Тазарту" },
  { slug: "toners", ru: "Тонеры и эссенции", kz: "Тонерлер мен эссенциялар" },
  { slug: "creams", ru: "Кремы", kz: "Кремдер" },
  { slug: "sun", ru: "Солнцезащита", kz: "Күннен қорғау" },
  { slug: "masks", ru: "Маски", kz: "Маскалар" },
  { slug: "body", ru: "Тело и волосы", kz: "Дене мен шаш" },
  { slug: "inner-beauty", ru: "INNER BEAUTY", kz: "INNER BEAUTY" },
  { slug: "kids-vitamins", ru: "Детские витамины", kz: "Балалар витаминдері" },
];

type SeedProduct = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  volume: string;
  shortDesc: string;
  description: string;
  usage: string;
  ingredients: string;
  skinType: string;
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  shape: string;
  tone: string;
};

const products: SeedProduct[] = [
  {
    slug: "arencia-vitamin-c-booster-shot",
    name: "Vitamin C Booster Shot",
    brand: "Arencia",
    category: "serums",
    price: 12900,
    oldPrice: 14900,
    volume: "30 мл",
    shortDesc: "Бустер с витамином C и глутатионом — ровный тон и сияние.",
    description:
      "Концентрированный бустер с комплексом витамина C (5%) и глутатионом. Выравнивает тон, уменьшает заметность пигментации и возвращает коже здоровое сияние. Лёгкая текстура быстро впитывается и не оставляет липкости.",
    usage: "После тонера нанесите 1–2 капли на лицо, распределите похлопывающими движениями. Утром обязательно используйте SPF.",
    ingredients: "Ascorbic Acid Complex (5%), Glutathione, Niacinamide, Panthenol, Centella Asiatica Extract.",
    skinType: "Для всех типов кожи, особенно тусклой",
    stock: 24,
    featured: true,
    isNew: true,
    shape: "tube",
    tone: "lime",
  },
  {
    slug: "arencia-green-rice-mochi-cleanser",
    name: "Fresh Green Rice Mochi Cleanser",
    brand: "Arencia",
    category: "cleansing",
    price: 11500,
    volume: "120 г",
    shortDesc: "Пенка-моти с рисом и зелёным чаем для мягкого очищения.",
    description:
      "Необычная тянущаяся текстура моти очищает поры, не стягивая кожу. Рисовый экстракт и зелёный чай успокаивают и выравнивают микрорельеф.",
    usage: "Вспеньте небольшое количество с водой, помассируйте влажную кожу 30 секунд и смойте.",
    ingredients: "Oryza Sativa (Rice) Extract, Camellia Sinensis Leaf Extract, Glycerin, Mugwort Extract.",
    skinType: "Для нормальной и комбинированной кожи",
    stock: 15,
    shape: "jar",
    tone: "sage",
  },
  {
    slug: "anua-heartleaf-77-soothing-toner",
    name: "Heartleaf 77% Soothing Toner",
    brand: "Anua",
    category: "toners",
    price: 10900,
    oldPrice: 12500,
    volume: "250 мл",
    shortDesc: "Успокаивающий тонер с 77% экстракта хауттюйнии.",
    description:
      "Бестселлер из Кореи. Мягко снимает покраснения, увлажняет и подготавливает кожу к следующим шагам ухода. Подходит для ежедневного использования утром и вечером.",
    usage: "Нанесите на ватный диск или ладони и распределите по лицу после умывания.",
    ingredients: "Houttuynia Cordata Extract (77%), Water, Butylene Glycol, Betaine, Panthenol.",
    skinType: "Для чувствительной и проблемной кожи",
    stock: 32,
    featured: true,
    shape: "pump",
    tone: "ivory",
  },
  {
    slug: "beauty-of-joseon-relief-sun-spf50",
    name: "Relief Sun: Rice + Probiotics SPF50+",
    brand: "Beauty of Joseon",
    category: "sun",
    price: 8900,
    volume: "50 мл",
    shortDesc: "Лёгкий солнцезащитный крем без белых следов.",
    description:
      "Органический санскрин с рисовым экстрактом и пробиотиками. Ложится как увлажняющий крем, не утяжеляет макияж и подходит для ежедневного использования.",
    usage: "Нанесите последним шагом утреннего ухода за 15 минут до выхода на улицу. Обновляйте каждые 2–3 часа.",
    ingredients: "Oryza Sativa (Rice) Extract 30%, Lactobacillus Ferment, Niacinamide, Adenosine.",
    skinType: "Для всех типов кожи",
    stock: 40,
    featured: true,
    shape: "tube",
    tone: "honey",
  },
  {
    slug: "cosrx-advanced-snail-96-mucin-essence",
    name: "Advanced Snail 96 Mucin Power Essence",
    brand: "COSRX",
    category: "toners",
    price: 9900,
    volume: "100 мл",
    shortDesc: "Эссенция с 96% муцина улитки для восстановления.",
    description:
      "Легендарная эссенция, которая восстанавливает, увлажняет и придаёт коже упругость. Помогает быстрее заживлять постакне и снимает чувство сухости.",
    usage: "После тонера нанесите 2–3 нажатия и вбейте подушечками пальцев.",
    ingredients: "Snail Secretion Filtrate (96%), Betaine, Butylene Glycol, Sodium Hyaluronate.",
    skinType: "Для обезвоженной и чувствительной кожи",
    stock: 28,
    featured: true,
    shape: "pump",
    tone: "ivory",
  },
  {
    slug: "torriden-dive-in-hyaluronic-serum",
    name: "DIVE-IN Low Molecular Hyaluronic Acid Serum",
    brand: "Torriden",
    category: "serums",
    price: 10500,
    volume: "50 мл",
    shortDesc: "Сыворотка с 5 видами гиалуроновой кислоты.",
    description:
      "Глубокое увлажнение на всех уровнях кожи. Лёгкая водянистая текстура мгновенно впитывается и оставляет ощущение свежести.",
    usage: "Нанесите 2–3 капли после тонера, затем закрепите кремом.",
    ingredients: "Sodium Hyaluronate (5 типов), D-Panthenol, Allantoin, Madecassoside.",
    skinType: "Для сухой и обезвоженной кожи",
    stock: 18,
    featured: true,
    shape: "dropper",
    tone: "sage",
  },
  {
    slug: "round-lab-1025-dokdo-cleanser",
    name: "1025 Dokdo Cleanser",
    brand: "Round Lab",
    category: "cleansing",
    price: 6900,
    volume: "150 мл",
    shortDesc: "Мягкая пенка с морской водой острова Токто.",
    description: "Очищает от загрязнений и излишков себума, сохраняя естественный барьер кожи. Слабокислотная формула без ощущения стянутости.",
    usage: "Вспеньте в ладонях, нанесите на влажное лицо, смойте тёплой водой.",
    ingredients: "Sea Water, Glycerin, Panthenol, Allantoin, Betaine.",
    skinType: "Для всех типов кожи",
    stock: 36,
    shape: "tube",
    tone: "ivory",
  },
  {
    slug: "medicube-zero-pore-pad",
    name: "Zero Pore Pad 2.0",
    brand: "Medicube",
    category: "toners",
    price: 13900,
    volume: "70 шт",
    shortDesc: "Пэды с AHA и BHA для гладкой кожи и чистых пор.",
    description: "Двусторонние пэды мягко отшелушивают ороговевшие клетки, сужают поры и выравнивают текстуру кожи.",
    usage: "Протрите лицо рельефной стороной, затем гладкой. Используйте вечером 3–4 раза в неделю.",
    ingredients: "Lactic Acid (AHA), Salicylic Acid (BHA), Tranexamic Acid, Niacinamide.",
    skinType: "Для жирной и комбинированной кожи",
    stock: 12,
    isNew: true,
    shape: "jar",
    tone: "blush",
  },
  {
    slug: "skin1004-madagascar-centella-ampoule",
    name: "Madagascar Centella Ampoule",
    brand: "SKIN1004",
    category: "serums",
    price: 11900,
    volume: "100 мл",
    shortDesc: "100% экстракт центеллы азиатской с Мадагаскара.",
    description: "Успокаивающая ампула, которая снимает раздражение, укрепляет защитный барьер и подходит даже очень чувствительной коже.",
    usage: "Нанесите несколько капель на очищенную кожу, распределите похлопывающими движениями.",
    ingredients: "Centella Asiatica Extract (100%).",
    skinType: "Для чувствительной кожи",
    stock: 20,
    featured: true,
    shape: "dropper",
    tone: "honey",
  },
  {
    slug: "beauty-of-joseon-glow-serum",
    name: "Glow Serum: Propolis + Niacinamide",
    brand: "Beauty of Joseon",
    category: "serums",
    price: 8500,
    volume: "30 мл",
    shortDesc: "Сыворотка с прополисом для сияния и ровного тона.",
    description: "60% экстракта прополиса и 2% ниацинамида питают кожу, уменьшают воспаления и придают здоровое сияние.",
    usage: "Нанесите 2–3 капли после тонера утром и вечером.",
    ingredients: "Propolis Extract (60%), Niacinamide (2%), Turmeric Root Extract, Honey Extract.",
    skinType: "Для тусклой и проблемной кожи",
    stock: 22,
    isNew: true,
    shape: "dropper",
    tone: "honey",
  },
  {
    slug: "isntree-hyaluronic-watery-sun-gel",
    name: "Hyaluronic Acid Watery Sun Gel SPF50+",
    brand: "Isntree",
    category: "sun",
    price: 8200,
    volume: "50 мл",
    shortDesc: "Солнцезащитный гель с гиалуроновой кислотой.",
    description: "Невесомый гель-санскрин увлажняет и защищает от UVA/UVB лучей, не оставляя белого налёта и жирного блеска.",
    usage: "Нанесите достаточное количество на лицо утром последним шагом ухода.",
    ingredients: "Sodium Hyaluronate, Hyaluronic Acid, Centella Asiatica Extract, Ethylhexyl Triazone.",
    skinType: "Для жирной и комбинированной кожи",
    stock: 26,
    shape: "tube",
    tone: "lime",
  },
  {
    slug: "dr-jart-ceramidin-cream",
    name: "Ceramidin Cream",
    brand: "Dr.Jart+",
    category: "creams",
    price: 19900,
    oldPrice: 22900,
    volume: "50 мл",
    shortDesc: "Насыщенный крем с церамидами для защитного барьера.",
    description: "Пять видов церамидов восстанавливают барьер кожи, интенсивно питают и надолго удерживают влагу. Идеален для холодного сезона.",
    usage: "Нанесите последним шагом ухода утром и вечером.",
    ingredients: "Ceramide NP, Panthenol, Shea Butter, Squalane, Glycerin.",
    skinType: "Для сухой кожи",
    stock: 9,
    featured: true,
    shape: "jar",
    tone: "ivory",
  },
  {
    slug: "mixsoon-bean-essence",
    name: "Bean Essence",
    brand: "Mixsoon",
    category: "toners",
    price: 12400,
    volume: "50 мл",
    shortDesc: "Ферментированная эссенция из бобов для гладкости.",
    description: "Мягко отшелушивает, выравнивает текстуру и делает кожу сияющей. Тянущаяся текстура равномерно распределяется.",
    usage: "После тонера нанесите 2–3 капли, мягко помассируйте до впитывания.",
    ingredients: "Fermented Soybean Extract, Lactobacillus Ferment, Panthenol.",
    skinType: "Для всех типов кожи",
    stock: 14,
    isNew: true,
    shape: "pump",
    tone: "blush",
  },
  {
    slug: "mediheal-teatree-essential-mask",
    name: "Teatree Essential Mask (10 шт)",
    brand: "Mediheal",
    category: "masks",
    price: 7900,
    volume: "10 × 24 мл",
    shortDesc: "Тканевые маски с чайным деревом против воспалений.",
    description: "Набор из 10 масок, которые успокаивают, снимают покраснения и подсушивают воспаления. Удобно брать в поездки.",
    usage: "Наложите маску на очищенное лицо на 15–20 минут, остатки эссенции вбейте в кожу.",
    ingredients: "Melaleuca Alternifolia (Tea Tree) Leaf Extract, Centella Asiatica, Allantoin.",
    skinType: "Для проблемной кожи",
    stock: 30,
    shape: "pouch",
    tone: "lime",
  },
  {
    slug: "abib-heartleaf-sticker-mask",
    name: "Mild Acidic pH Sheet Mask Heartleaf Fit (5 шт)",
    brand: "Abib",
    category: "masks",
    price: 4900,
    volume: "5 × 30 мл",
    shortDesc: "Слабокислотные маски для мгновенного успокоения.",
    description: "Тонкая плотно прилегающая основа и эссенция с хауттюйнией быстро восстанавливают комфорт кожи.",
    usage: "Наложите на 15–20 минут, затем снимите и вбейте остатки эссенции.",
    ingredients: "Houttuynia Cordata Extract, Panthenol, Glycerin.",
    skinType: "Для чувствительной кожи",
    stock: 25,
    shape: "pouch",
    tone: "sage",
  },
  {
    slug: "illiyoon-ceramide-ato-cream",
    name: "Ceramide Ato Concentrate Cream",
    brand: "Illiyoon",
    category: "body",
    price: 12900,
    volume: "500 мл",
    shortDesc: "Крем для тела с церамидами для очень сухой кожи.",
    description: "Большой объём для всей семьи. Глубоко увлажняет, успокаивает и укрепляет кожный барьер. Подходит даже для детей.",
    usage: "Нанесите на чистую кожу тела после душа.",
    ingredients: "Ceramide NP, Glycerin, Squalane, Panthenol.",
    skinType: "Для сухой и атопичной кожи",
    stock: 11,
    shape: "pump",
    tone: "ivory",
  },
  {
    slug: "some-by-mi-aha-bha-pha-miracle-cream",
    name: "AHA BHA PHA 30 Days Miracle Cream",
    brand: "Some By Mi",
    category: "creams",
    price: 9500,
    volume: "60 г",
    shortDesc: "Лёгкий крем-гель против несовершенств.",
    description: "Сочетание кислот и экстракта чайного дерева борется с высыпаниями, а лёгкая текстура не забивает поры.",
    usage: "Нанесите тонким слоем вечером последним шагом ухода.",
    ingredients: "AHA, BHA, PHA, Tea Tree Water (10 000 ppm), Niacinamide.",
    skinType: "Для проблемной кожи",
    stock: 17,
    shape: "jar",
    tone: "lime",
  },
  {
    slug: "manyo-pure-cleansing-oil",
    name: "Pure Cleansing Oil",
    brand: "Ma:nyo",
    category: "cleansing",
    price: 10900,
    volume: "200 мл",
    shortDesc: "Гидрофильное масло растворяет макияж и чёрные точки.",
    description: "Лёгкое масло на основе растительных масел мягко удаляет стойкий макияж и санскрин, не оставляя плёнки.",
    usage: "Нанесите 2–3 нажатия на сухое лицо, помассируйте, эмульгируйте водой и смойте.",
    ingredients: "Olive Fruit Oil, Grape Seed Oil, Jojoba Seed Oil, Vitamin E.",
    skinType: "Для всех типов кожи",
    stock: 19,
    featured: true,
    shape: "pump",
    tone: "honey",
  },
  {
    slug: "nutree-collagen-ampoule",
    name: "Marine Collagen Ampoule Drink",
    brand: "Nutree",
    category: "inner-beauty",
    price: 18900,
    oldPrice: 21900,
    volume: "30 шт × 20 мл",
    shortDesc: "Питьевой коллаген для упругости кожи и суставов.",
    description: "Жидкий морской коллаген из Кореи. Поддерживает упругость кожи, ногтей и волос, удобен для ежедневного приёма.",
    usage: "1 ампула в день, можно разбавить водой.",
    ingredients: "Fish Collagen Peptide, Vitamin C, Hyaluronic Acid, Elastin.",
    skinType: "Для взрослых",
    stock: 20,
    featured: true,
    isNew: true,
    shape: "ampoule",
    tone: "blush",
  },
  {
    slug: "gnm-vitamin-c-1000",
    name: "Vitamin C 1000",
    brand: "GNM Nature's Quality",
    category: "inner-beauty",
    price: 9900,
    volume: "90 таблеток",
    shortDesc: "Витамин C для иммунитета и сияния кожи изнутри.",
    description: "Высокая дозировка витамина C в удобных таблетках. Поддерживает иммунитет и антиоксидантную защиту.",
    usage: "1 таблетка в день во время еды.",
    ingredients: "Ascorbic Acid 1000 mg, Rose Hip Extract.",
    skinType: "Для взрослых",
    stock: 28,
    featured: true,
    shape: "jar",
    tone: "honey",
  },
  {
    slug: "bb-lab-glutathione",
    name: "Glutathione White Film",
    brand: "BB Lab",
    category: "inner-beauty",
    price: 15900,
    volume: "30 саше",
    shortDesc: "Глутатион для ровного тона и антиоксидантной поддержки.",
    description: "Популярный корейский INNER BEAUTY продукт с глутатионом. Помогает поддерживать сияние и ровный тон кожи.",
    usage: "1 саше в день, растворить в воде.",
    ingredients: "Glutathione, Vitamin C, Niacinamide.",
    skinType: "Для взрослых",
    stock: 16,
    isNew: true,
    shape: "pouch",
    tone: "ivory",
  },
  {
    slug: "kids-vita-jelly",
    name: "Kids Multi Vita Jelly",
    brand: "Chong Kun Dang",
    category: "kids-vitamins",
    price: 11900,
    volume: "60 желейных конфет",
    shortDesc: "Мультивитамины в форме желе для детей.",
    description: "Вкусные желейные витамины из Кореи с комплексом для роста, энергии и иммунитета.",
    usage: "Детям от 3 лет — 1–2 конфеты в день.",
    ingredients: "Vitamin A, C, D, B-complex, Zinc.",
    skinType: "Для детей от 3 лет",
    stock: 22,
    featured: true,
    isNew: true,
    shape: "jar",
    tone: "lime",
  },
  {
    slug: "kids-immune-lacto",
    name: "Kids Immune Lacto",
    brand: "Chong Kun Dang",
    category: "kids-vitamins",
    price: 13900,
    volume: "30 стиков",
    shortDesc: "Пробиотики и витамины для детского иммунитета.",
    description: "Корейская формула с лактобактериями и витаминами для поддержки пищеварения и иммунитета ребёнка.",
    usage: "1 стик в день, можно смешать с водой или йогуртом.",
    ingredients: "Lactobacillus, Vitamin D, Zinc, FOS.",
    skinType: "Для детей от 1 года",
    stock: 18,
    featured: true,
    shape: "pouch",
    tone: "sage",
  },
  {
    slug: "kids-omega-gummy",
    name: "Kids Omega-3 Gummies",
    brand: "Natural Plus",
    category: "kids-vitamins",
    price: 12900,
    volume: "60 шт",
    shortDesc: "Омега-3 в форме мармеладок для внимания и зрения.",
    description: "Детские омега-3 из Кореи с приятным вкусом. Поддерживают развитие мозга, зрения и концентрацию.",
    usage: "Детям от 4 лет — 1–2 мармеладки в день.",
    ingredients: "Fish Oil DHA/EPA, Vitamin E.",
    skinType: "Для детей от 4 лет",
    stock: 14,
    isNew: true,
    shape: "jar",
    tone: "honey",
  },
];

function ensureExtra(db: DatabaseSync) {
  const extras = categories.filter((c) => c.slug === "inner-beauty" || c.slug === "kids-vitamins");
  const insertCategory = db.prepare(
    "INSERT OR IGNORE INTO categories (slug, name_ru, name_kz, sort) VALUES (?, ?, ?, ?)",
  );
  extras.forEach((c, i) => insertCategory.run(c.slug, c.ru, c.kz, 100 + i));

  const idOf = (slug: string) =>
    (db.prepare("SELECT id FROM categories WHERE slug = ?").get(slug) as { id: number } | undefined)?.id;

  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (slug, name, brand, category_id, price, old_price, volume, short_desc,
      description, usage, ingredients, skin_type, stock, is_featured, is_new, shape, tone, search)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of products.filter((x) => x.category === "inner-beauty" || x.category === "kids-vitamins")) {
    const categoryId = idOf(p.category);
    if (!categoryId) continue;
    insertProduct.run(
      p.slug, p.name, p.brand, categoryId, p.price, p.oldPrice ?? null,
      p.volume, p.shortDesc, p.description, p.usage, p.ingredients, p.skinType, p.stock,
      p.featured ? 1 : 0, p.isNew ? 1 : 0, p.shape, p.tone,
      buildSearch(p.name, p.brand, p.shortDesc),
    );
  }
}

export function seed(db: DatabaseSync) {
  const row = db.prepare("SELECT COUNT(*) AS n FROM categories").get() as { n: number };
  if (row.n === 0 && process.env.SEED !== "false") {
    db.exec("BEGIN");
    try {
      const insertCategory = db.prepare(
        "INSERT INTO categories (slug, name_ru, name_kz, sort) VALUES (?, ?, ?, ?)",
      );
      const ids = new Map<string, number>();
      categories.forEach((c, i) => {
        const res = insertCategory.run(c.slug, c.ru, c.kz, i);
        ids.set(c.slug, Number(res.lastInsertRowid));
      });

      const insertProduct = db.prepare(`
        INSERT INTO products (slug, name, brand, category_id, price, old_price, volume, short_desc,
          description, usage, ingredients, skin_type, stock, is_featured, is_new, shape, tone, search)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const p of products) {
        insertProduct.run(
          p.slug, p.name, p.brand, ids.get(p.category) ?? null, p.price, p.oldPrice ?? null,
          p.volume, p.shortDesc, p.description, p.usage, p.ingredients, p.skinType, p.stock,
          p.featured ? 1 : 0, p.isNew ? 1 : 0, p.shape, p.tone,
          buildSearch(p.name, p.brand, p.shortDesc),
        );
      }
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
    return;
  }

  if (process.env.SEED !== "false") ensureExtra(db);
}

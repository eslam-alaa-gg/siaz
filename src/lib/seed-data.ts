type SeedColor = {
  name: string;
  hex: string;
  image: string;
  stock: number[]; // XS, S, M, L, XL
};

type SeedProduct = {
  slug: string;
  name: string;
  category: string;
  collection: string;
  tagline: string;
  description: string;
  material: string;
  price: number;
  isNew?: boolean;
  isBestseller?: boolean;
  colors: SeedColor[];
};

const img = (f: string) => `/images/products/${f}.jpg`;

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    slug: "heavy-oversized-tee",
    name: "Heavy Oversized Tee",
    category: "t-shirts",
    collection: "essentials",
    tagline: "Dropped shoulder, boxy fall",
    description:
      "A dense 240gsm jersey tee cut generously through the body with a dropped shoulder and a clean, ribbed crew neck. Garment washed for a soft hand and a quiet, lived-in drape.",
    material: "100% organic cotton, 240gsm. Garment washed. Machine wash cold.",
    price: 58,
    isNew: true,
    isBestseller: true,
    colors: [
      { name: "Black", hex: "#1f1f1f", image: img("tee-black"), stock: [4, 12, 15, 9, 5] },
      { name: "Chalk", hex: "#f2f1ec", image: img("tee-white"), stock: [3, 10, 14, 8, 0] },
    ],
  },
  {
    slug: "studio-basic-tee",
    name: "Studio Basic Tee",
    category: "t-shirts",
    collection: "essentials",
    tagline: "The everyday standard",
    description:
      "Our premium everyday tee in a refined mid-weight combed cotton. A slightly relaxed straight fit, a close collar and a soft, matte finish make it the simplest layer in the collection.",
    material: "100% combed cotton, 180gsm. Machine wash cold.",
    price: 42,
    isBestseller: true,
    colors: [
      { name: "Ivory", hex: "#f4f1ea", image: img("basic-white"), stock: [6, 14, 18, 12, 6] },
    ],
  },
  {
    slug: "boxy-heavyweight-tee",
    name: "Boxy Heavyweight Tee",
    category: "t-shirts",
    collection: "street",
    tagline: "Structured and cropped slightly short",
    description:
      "A structured boxy tee with a wide, shortened body and a substantial heavyweight feel. Pairs with wide trousers or cargos for a considered, relaxed silhouette.",
    material: "100% cotton, 260gsm. Pre-shrunk. Machine wash cold.",
    price: 64,
    isNew: true,
    colors: [
      { name: "Cocoa", hex: "#6b5d52", image: img("boxy-cocoa"), stock: [2, 8, 10, 7, 3] },
      { name: "Sand", hex: "#cdbba0", image: img("boxy-sand"), stock: [0, 6, 9, 5, 2] },
    ],
  },
  {
    slug: "essential-hoodie",
    name: "Essential Hoodie",
    category: "hoodies",
    collection: "street",
    tagline: "Brushed fleece, relaxed fit",
    description:
      "A full-bodied pullover hoodie in brushed-back fleece with a double-layer hood, flat drawcords and a kangaroo pocket. Relaxed through the shoulder and finished with a subtle embroidered mark.",
    material: "80% cotton, 20% recycled polyester fleece, 380gsm.",
    price: 128,
    isBestseller: true,
    isNew: true,
    colors: [
      { name: "Black", hex: "#1f1f1f", image: img("hoodie-black"), stock: [3, 9, 12, 8, 4] },
      { name: "Sand", hex: "#cdbba0", image: img("hoodie-sand"), stock: [2, 7, 10, 6, 1] },
    ],
  },
  {
    slug: "colour-block-crewneck",
    name: "Colour-Block Crewneck",
    category: "sweatshirts",
    collection: "street",
    tagline: "An asymmetric statement piece",
    description:
      "A funnel-neck sweatshirt cut from loopback jersey with an asymmetric heather-grey panel across the shoulder and sleeve. A quiet, graphic layer with a soft interior.",
    material: "100% cotton loopback jersey, 340gsm.",
    price: 118,
    isNew: true,
    colors: [
      { name: "Black / Grey", hex: "#2b2b2b", image: img("crew-colorblock"), stock: [2, 6, 8, 6, 2] },
    ],
  },
  {
    slug: "linen-mandarin-shirt",
    name: "Linen Mandarin Shirt",
    category: "shirts",
    collection: "tailored-ease",
    tagline: "Washed European linen",
    description:
      "A relaxed shirt in washed European linen with a mandarin collar and a short placket fastened with natural buttons. Breathable, light and softened by wear.",
    material: "100% European linen. Machine wash cold, line dry.",
    price: 138,
    colors: [
      { name: "Natural", hex: "#ddd5c5", image: img("linen-natural"), stock: [2, 5, 7, 5, 2] },
    ],
  },
  {
    slug: "camp-collar-shirt",
    name: "Camp Collar Shirt",
    category: "shirts",
    collection: "tailored-ease",
    tagline: "Short sleeve, soft drape",
    description:
      "A short-sleeve camp collar shirt in a fluid textured weave with a boxy body, open revere collar and a concealed placket. Wear it open over a tee or buttoned alone.",
    material: "55% linen, 45% viscose. Machine wash cold.",
    price: 98,
    colors: [
      { name: "Black", hex: "#1f1f1f", image: img("shirt-black"), stock: [3, 8, 11, 7, 3] },
    ],
  },
  {
    slug: "nylon-bomber-jacket",
    name: "Nylon Bomber Jacket",
    category: "jackets",
    collection: "shadow",
    tagline: "Matte technical nylon",
    description:
      "A clean-lined bomber in matte garment-washed nylon with a ribbed collar, cuffs and hem, hidden side pockets and a lightly padded interior. Cut roomy to layer over knitwear.",
    material: "100% recycled nylon shell, recycled polyester wadding.",
    price: 248,
    isNew: true,
    isBestseller: true,
    colors: [
      { name: "Black", hex: "#1f1f1f", image: img("bomber-black"), stock: [2, 6, 8, 6, 3] },
      { name: "Olive", hex: "#4a5237", image: img("bomber-olive"), stock: [1, 5, 7, 4, 2] },
    ],
  },
  {
    slug: "stone-coach-jacket",
    name: "Stone Coach Jacket",
    category: "jackets",
    collection: "shadow",
    tagline: "Lightweight cotton twill",
    description:
      "A lightweight coach jacket in dry-hand cotton twill with a point collar, snap-button front and welted pockets. An easy transitional layer in a soft stone tone.",
    material: "100% cotton twill, unlined. Dry clean or gentle wash.",
    price: 198,
    colors: [
      { name: "Stone", hex: "#c8bfa9", image: img("coach-stone"), stock: [2, 5, 6, 4, 2] },
    ],
  },
  {
    slug: "utility-cargo-trouser",
    name: "Utility Cargo Trouser",
    category: "trousers",
    collection: "shadow",
    tagline: "Relaxed leg, flap pockets",
    description:
      "Relaxed cargo trousers in a crisp cotton ripstop with articulated knees, flap cargo pockets and a straight, easy leg. Designed to sit just above the shoe.",
    material: "98% cotton, 2% elastane ripstop. Machine wash cold.",
    price: 158,
    isNew: true,
    colors: [
      { name: "Black", hex: "#1f1f1f", image: img("cargo-black"), stock: [2, 7, 10, 7, 3] },
    ],
  },
  {
    slug: "pleated-wide-trouser",
    name: "Pleated Wide Trouser",
    category: "trousers",
    collection: "tailored-ease",
    tagline: "Double pleat, fluid wide leg",
    description:
      "A double-pleated wide-leg trouser in a fluid wool-blend suiting with a high rise, concealed hook closure and a long, graceful break. Tailored ease for every day.",
    material: "60% recycled wool, 40% polyester. Dry clean.",
    price: 168,
    isBestseller: true,
    colors: [
      { name: "Stone", hex: "#c9bfab", image: img("trouser-stone"), stock: [3, 8, 9, 6, 2] },
      { name: "Charcoal", hex: "#4a4a4a", image: img("trouser-charcoal"), stock: [3, 7, 9, 6, 0] },
    ],
  },
];

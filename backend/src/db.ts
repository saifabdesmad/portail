import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'way3d.db');
const db = new Database(DB_PATH);

// Enable foreign keys and WAL for performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT    NOT NULL,
    description    TEXT,
    price          REAL    NOT NULL,
    original_price REAL,
    category_slug  TEXT    NOT NULL,
    stock          INTEGER NOT NULL DEFAULT 0,
    rating         REAL    DEFAULT 0,
    review_count   INTEGER DEFAULT 0,
    images         TEXT,   -- JSON array
    tags           TEXT,   -- JSON array
    material       TEXT,
    colors         TEXT,   -- JSON array
    is_new         INTEGER DEFAULT 0,
    is_bestseller  INTEGER DEFAULT 0,
    is_active      INTEGER DEFAULT 1,
    created_at     TEXT    DEFAULT (datetime('now')),
    updated_at     TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS clients (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    phone      TEXT,
    address    TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id       INTEGER NOT NULL,
    status          TEXT    NOT NULL DEFAULT 'pending'
                    CHECK(status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
    total_amount    REAL    NOT NULL,
    shipping_amount REAL    NOT NULL DEFAULT 7,
    promo_code      TEXT,
    discount_amount REAL    DEFAULT 0,
    notes           TEXT,
    created_at      TEXT    DEFAULT (datetime('now')),
    updated_at      TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES clients(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id     INTEGER NOT NULL,
    product_id   INTEGER NOT NULL,
    product_name TEXT    NOT NULL,
    quantity     INTEGER NOT NULL DEFAULT 1,
    unit_price   REAL    NOT NULL,
    color        TEXT,
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

// ── Seed categories ──────────────────────────────────────────────────────────

const seedCategories = db.prepare(`
  INSERT OR IGNORE INTO categories (slug, name) VALUES (?, ?)
`);

const catData = [
  ['home-decor', 'Décoration maison'],
  ['jewelry',    'Bijoux & Accessoires'],
  ['tech',       'Accessoires Tech'],
  ['figurines',  'Figurines & Art'],
  ['organizers', 'Organisateurs'],
  ['keychains',  'Porte-clés'],
  ['custom',     'Personnalisé'],
];

const seedAllCategories = db.transaction(() => {
  catData.forEach(([slug, name]) => seedCategories.run(slug, name));
});
seedAllCategories();

// ── Seed products (only if table is empty) ───────────────────────────────────

const productCount = (db.prepare('SELECT COUNT(*) as cnt FROM products').get() as { cnt: number }).cnt;

if (productCount === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products
      (name, description, price, original_price, category_slug, stock, rating, review_count,
       images, tags, material, colors, is_new, is_bestseller)
    VALUES
      (@name, @description, @price, @original_price, @category_slug, @stock, @rating, @review_count,
       @images, @tags, @material, @colors, @is_new, @is_bestseller)
  `);

  const seedProducts = db.transaction(() => {
    const rows = [
      { name: 'Vase Géométrique Moderne',       description: 'Vase élégant imprimé en 3D avec un design géométrique moderne. Parfait pour décorer votre intérieur avec style.', price: 45.000, original_price: 60.000, category_slug: 'home-decor', stock: 10, rating: 4.8, review_count: 124, images: JSON.stringify(['/Produits/DECO/1/2025-11-18_4e2e3008af2718.webp','/Produits/DECO/1/2025-11-18_fc807149f6f17.webp']), tags: JSON.stringify(['vase','décoration','géométrique','moderne']), material: 'PLA Premium', colors: JSON.stringify(['#F5C842','#4ECDC4','#FF6B6B','#ffffff']), is_new: 0, is_bestseller: 1 },
      { name: 'Lampe LED Hexagonale',            description: 'Lampe décorative avec structure hexagonale imprimée en 3D. Crée une ambiance chaleureuse et moderne.', price: 120.000, original_price: 150.000, category_slug: 'home-decor', stock: 5, rating: 4.8, review_count: 94, images: JSON.stringify(['/Produits/DECO/2/79b0c855324e5174.webp','/Produits/DECO/2/7f3d30554ddee5d0.webp']), tags: JSON.stringify(['lampe','LED','hexagonal','ambiance']), material: 'PETG Translucide', colors: JSON.stringify(['#ffffff','#F5C842','#1a1a2e']), is_new: 1, is_bestseller: 0 },
      { name: 'Pot de Plante Suspendu',          description: 'Pot de plante design à suspendre, imprimé en 3D avec motifs inspirés de la nature.', price: 30.000, original_price: null, category_slug: 'home-decor', stock: 0, rating: 4.6, review_count: 198, images: JSON.stringify(['/Produits/DECO/3/2025-04-22_415e8b3f5b7c38.webp','/Produits/DECO/3/2025-04-22_aedb852824d2c8.webp']), tags: JSON.stringify(['pot','plante','suspendu','nature']), material: 'PLA Biodégradable', colors: JSON.stringify(['#F5C842','#4ECDC4','#ffffff','#1a1a2e']), is_new: 0, is_bestseller: 0 },
      { name: 'Bague Géométrique Personnalisée', description: 'Bague élégante au design géométrique, personnalisable avec votre taille et initiales.', price: 35.000, original_price: null, category_slug: 'jewelry', stock: 15, rating: 4.6, review_count: 203, images: JSON.stringify(['/Produits/BIJOUX/1/2025-07-29_a9dd4a4f2b84f8.webp','/Produits/BIJOUX/1/2025-07-29_d017775caf95.webp']), tags: JSON.stringify(['bague','bijou','géométrique','élégant']), material: 'Résine UV', colors: JSON.stringify(['#C0C0C0','#FFD700','#F5C842','#4ECDC4']), is_new: 0, is_bestseller: 0 },
      { name: 'Collier Pendentif Minimaliste',   description: 'Pendentif au design minimaliste et épuré. Impression résine haute précision.', price: 42.000, original_price: 55.000, category_slug: 'jewelry', stock: 8, rating: 4.7, review_count: 145, images: JSON.stringify(['/Produits/BIJOUX/2/2023-11-29_489ca32446eef.webp','/Produits/BIJOUX/2/2024-03-22_0c1203dc146b1.webp']), tags: JSON.stringify(['collier','pendentif','minimaliste','bijou']), material: 'Résine UV', colors: JSON.stringify(['#C0C0C0','#FFD700','#F5C842']), is_new: 0, is_bestseller: 0 },
      { name: 'Bracelet Tressé 3D',              description: 'Bracelet au motif tressé unique, entièrement imprimé en 3D en une seule pièce.', price: 28.000, original_price: null, category_slug: 'jewelry', stock: 12, rating: 4.5, review_count: 78, images: JSON.stringify(['/Produits/BIJOUX/3/2025-02-14_ebc190a554d3a.jpg','/Produits/BIJOUX/3/2025-02-19_6a8c5cd2fecbe.jpg']), tags: JSON.stringify(['bracelet','bijou','tressé','flexible']), material: 'TPU Flexible', colors: JSON.stringify(['#F5C842','#4ECDC4','#1a1a2e','#FF6B6B','#C0C0C0']), is_new: 1, is_bestseller: 0 },
      { name: 'Coque iPhone Personnalisée',      description: 'Coque de protection pour iPhone imprimée en 3D avec votre prénom ou design personnalisé.', price: 25.000, original_price: null, category_slug: 'tech', stock: 20, rating: 4.9, review_count: 287, images: JSON.stringify(['https://images.unsplash.com/photo-1601593346740-925612772716?w=500&q=80','https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80']), tags: JSON.stringify(['coque','iphone','personnalisé','protection']), material: 'TPU Flexible', colors: JSON.stringify(['#1a1a2e','#F5C842','#4ECDC4','#FF6B6B']), is_new: 1, is_bestseller: 1 },
      { name: 'Support Téléphone Voiture',       description: 'Support magnétique pour smartphone en voiture. Design aérodynamique.', price: 28.000, original_price: null, category_slug: 'tech', stock: 14, rating: 4.5, review_count: 178, images: JSON.stringify(['/Produits/ACCESSOIRES%20TECH/1/2024-07-10_1ef9b7bdf739.webp','/Produits/ACCESSOIRES%20TECH/1/2024-07-10_7429bc52f1964.webp']), tags: JSON.stringify(['support','voiture','téléphone','magnétique']), material: 'ABS Renforcé', colors: JSON.stringify(['#1a1a2e','#ffffff']), is_new: 0, is_bestseller: 0 },
      { name: 'Station de Charge Bureau',        description: 'Station de charge multi-appareils imprimée en 3D.', price: 55.000, original_price: 70.000, category_slug: 'tech', stock: 6, rating: 4.7, review_count: 52, images: JSON.stringify(['/Produits/ACCESSOIRES%20TECH/2/2025-10-17_77cfe8167b874.webp','/Produits/ACCESSOIRES%20TECH/2/2025-10-17_ba6d61b4b03188.webp']), tags: JSON.stringify(['station','charge','bureau','tech']), material: 'PETG', colors: JSON.stringify(['#1a1a2e','#ffffff','#F5C842']), is_new: 1, is_bestseller: 0 },
      { name: 'Figurine Dragon Articulée',       description: "Dragon fantastique entièrement articulé imprimé en une seule pièce. Chaque écaille est détaillée avec précision.", price: 85.000, original_price: 110.000, category_slug: 'figurines', stock: 4, rating: 5.0, review_count: 89, images: JSON.stringify(['/Produits/ART/1/2025-09-29_0e76fc4d870108.webp','/Produits/ART/1/2025-09-29_5ef929c7632408.webp']), tags: JSON.stringify(['dragon','figurine','articulé','fantaisie']), material: 'PLA+', colors: JSON.stringify(['#1a1a2e','#FF6B6B','#4ECDC4','#F5C842']), is_new: 0, is_bestseller: 1 },
      { name: 'Figurine Félin Articulée',        description: 'Chat articulé imprimé en 3D en une seule pièce sans aucun assemblage.', price: 65.000, original_price: null, category_slug: 'figurines', stock: 3, rating: 4.8, review_count: 41, images: JSON.stringify(['/Produits/ART/2/2025-07-29_db2061ab40778.webp','/Produits/ART/2/2025-08-22_c1921085c102e.webp']), tags: JSON.stringify(['chat','figurine','articulé','collection']), material: 'PLA+', colors: JSON.stringify(['#F5C842','#ffffff','#1a1a2e','#FF6B6B']), is_new: 1, is_bestseller: 0 },
      { name: 'Organisateur de Bureau Modulaire',description: "Système d'organisation de bureau modulaire et personnalisable.", price: 55.000, original_price: null, category_slug: 'organizers', stock: 9, rating: 4.7, review_count: 156, images: JSON.stringify(['/Produits/ORGANISATEURS/1/2024-02-18_6m3fj544d8o0.webp','/Produits/ORGANISATEURS/1/2024-02-18_ep2uyj46gk1p.webp']), tags: JSON.stringify(['bureau','organisateur','modulaire','fonctionnel']), material: 'PETG', colors: JSON.stringify(['#ffffff','#F5C842','#1a1a2e','#4ECDC4']), is_new: 1, is_bestseller: 0 },
      { name: 'Range-Câbles Mural',              description: 'Organisateur de câbles à fixer au mur. Compatible tous types de câbles.', price: 22.000, original_price: null, category_slug: 'organizers', stock: 18, rating: 4.4, review_count: 63, images: JSON.stringify(['/Produits/ORGANISATEURS/2/2025-08-18_6m8o3vvti9j0.webp','/Produits/ORGANISATEURS/2/2025-08-18_wn5xnew561kv.webp']), tags: JSON.stringify(['câbles','organisateur','mural','bureau']), material: 'PLA Premium', colors: JSON.stringify(['#ffffff','#1a1a2e','#F5C842']), is_new: 1, is_bestseller: 0 },
      { name: 'Porte-clés Prénom 3D',            description: 'Porte-clés avec votre prénom en relief 3D. Cadeau idéal et personnalisé.', price: 15.000, original_price: null, category_slug: 'keychains', stock: 50, rating: 4.9, review_count: 512, images: JSON.stringify(['/Produits/PORTE%20CLE/422011c7e3fc3cb3.webp','/Produits/PORTE%20CLE/c7b53efc00fce2e9.webp']), tags: JSON.stringify(['porte-clés','prénom','cadeau','personnalisé']), material: 'PLA Premium', colors: JSON.stringify(['#F5C842','#4ECDC4','#FF6B6B','#1a1a2e','#ffffff']), is_new: 0, is_bestseller: 1 },
      { name: 'Plaque Prénom Chambre Enfant',    description: 'Décoration murale avec prénom de votre enfant en 3D.', price: 40.000, original_price: null, category_slug: 'custom', stock: 7, rating: 5.0, review_count: 67, images: JSON.stringify(['/Produits/PERSONNALISE/1/4e2595cc19d41b2c.webp','/Produits/PERSONNALISE/1/c73fb47030d80945.webp']), tags: JSON.stringify(['prénom','enfant','chambre','décoration']), material: 'PLA Premium', colors: JSON.stringify(['#F5C842','#4ECDC4','#FF6B6B','#9B59B6']), is_new: 1, is_bestseller: 0 },
      { name: 'Statuette Buste Personnalisé',    description: 'Créez votre propre statuette à partir d\'une photo ! Scannez votre visage ou celui d\'un proche.', price: 200.000, original_price: null, category_slug: 'custom', stock: 2, rating: 4.9, review_count: 43, images: JSON.stringify(['/Produits/PERSONNALISE/2/2025-06-03_05155b4609766.webp','/Produits/PERSONNALISE/2/2025-06-03_5dae64896e7c1.webp']), tags: JSON.stringify(['statuette','buste','personnalisé','portrait']), material: 'Résine Premium', colors: JSON.stringify(['#C0C0C0','#F5C842','#ffffff']), is_new: 0, is_bestseller: 1 },
    ];
    rows.forEach(r => insertProduct.run(r));
  });
  seedProducts();

  // Seed mock clients
  const insertClient = db.prepare(
    'INSERT OR IGNORE INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)'
  );
  const seedClients = db.transaction(() => {
    [
      ['Ahmed Ben Salah', 'ahmed@mail.tn',   '+216 22 111 222', 'Rue de la Liberté, Tunis'],
      ['Sarra Trabelsi',  'sarra@mail.tn',   '+216 55 333 444', 'Avenue Habib Bourguiba, Sfax'],
      ['Mohamed Karray',  'med@mail.tn',     '+216 98 555 666', 'Route de Sousse, Monastir'],
      ['Fatma Chaari',    'fatma@mail.tn',   '+216 71 777 888', 'Cité El Intilaka, Nabeul'],
      ['Youssef Hamdi',   'youssef@mail.tn', '+216 27 999 000', 'Rue Ibn Khaldoun, Sousse'],
      ['Nour Jebali',     'nour@mail.tn',    '+216 52 001 002', 'Avenue de la Paix, Bizerte'],
      ['Rim Belhaj',      'rim@mail.tn',     '+216 99 112 233', 'Centre Ville, Gabès'],
      ['Karim Mansouri',  'karim@mail.tn',   '+216 28 445 566', 'Cité Olympique, Tunis'],
    ].forEach(([n, e, p, a]) => insertClient.run(n, e, p, a));
  });
  seedClients();

  // Seed mock orders
  const insertOrder = db.prepare(
    'INSERT INTO orders (client_id, status, total_amount, shipping_amount, notes) VALUES (?, ?, ?, ?, ?)'
  );
  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, color) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const seedOrders = db.transaction(() => {
    const o1 = insertOrder.run(1, 'delivered', 89.500, 0, null);
    insertItem.run(o1.lastInsertRowid, 1, 'Vase Géométrique Moderne', 1, 45.000, 'Noir');
    insertItem.run(o1.lastInsertRowid, 14, 'Porte-clés Prénom 3D', 2, 22.250, null);

    const o2 = insertOrder.run(2, 'shipped', 45.000, 7, null);
    insertItem.run(o2.lastInsertRowid, 4, 'Bague Géométrique Personnalisée', 1, 45.000, 'Or');

    const o3 = insertOrder.run(3, 'processing', 134.000, 0, null);
    insertItem.run(o3.lastInsertRowid, 12, 'Organisateur de Bureau Modulaire', 1, 65.000, null);
    insertItem.run(o3.lastInsertRowid, 8, 'Support Téléphone Voiture', 1, 38.000, null);
    insertItem.run(o3.lastInsertRowid, 14, 'Porte-clés Prénom 3D', 2, 15.500, null);

    const o4 = insertOrder.run(4, 'confirmed', 67.500, 7, 'Livraison le soir SVP');
    insertItem.run(o4.lastInsertRowid, 2, 'Lampe LED Hexagonale', 1, 67.500, null);

    const o5 = insertOrder.run(5, 'pending', 29.000, 7, null);
    insertItem.run(o5.lastInsertRowid, 14, 'Porte-clés Prénom 3D', 2, 14.500, null);

    const o6 = insertOrder.run(6, 'cancelled', 55.000, 7, null);
    insertItem.run(o6.lastInsertRowid, 5, 'Collier Pendentif Minimaliste', 1, 55.000, null);
  });
  seedOrders();
}

export default db;

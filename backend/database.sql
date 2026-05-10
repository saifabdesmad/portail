-- ============================================================
--  WAY3D — Database Schema
--  Run this file once to create all tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS way3d CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE way3d;

-- ------------------------------------------------------------
--  Categories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  slug       VARCHAR(50)  NOT NULL UNIQUE,
  name       VARCHAR(100) NOT NULL
);

INSERT IGNORE INTO categories (slug, name) VALUES
  ('all',         'Tous les produits'),
  ('deco',        'Décoration'),
  ('figurines',   'Art & Figurines'),
  ('organizers',  'Organisateurs'),
  ('tech',        'Accessoires Tech'),
  ('jewelry',     'Bijoux'),
  ('personalized','Personnalisé'),
  ('keychains',   'Porte-clés');

-- ------------------------------------------------------------
--  Products
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(200)   NOT NULL,
  description   TEXT,
  price         DECIMAL(10,3)  NOT NULL,          -- TND
  original_price DECIMAL(10,3) DEFAULT NULL,       -- before discount
  category_id   INT            NOT NULL,
  stock         INT            NOT NULL DEFAULT 0,
  rating        DECIMAL(3,2)   DEFAULT 0.00,
  review_count  INT            DEFAULT 0,
  images        JSON,                              -- array of image paths/URLs
  tags          JSON,                              -- e.g. ["new","bestseller"]
  material      VARCHAR(100),
  colors        JSON,                              -- available color options
  is_active     BOOLEAN        DEFAULT TRUE,
  created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ------------------------------------------------------------
--  Clients (basic — you will expand with auth later)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(200) NOT NULL UNIQUE,
  phone      VARCHAR(30),
  address    TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
--  Orders (Commandes)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  client_id       INT           NOT NULL,
  status          ENUM('pending','confirmed','processing','shipped','delivered','cancelled')
                  NOT NULL DEFAULT 'pending',
  total_amount    DECIMAL(10,3) NOT NULL,          -- TND
  shipping_amount DECIMAL(10,3) NOT NULL DEFAULT 7.000,
  promo_code      VARCHAR(50)   DEFAULT NULL,
  discount_amount DECIMAL(10,3) DEFAULT 0.000,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- ------------------------------------------------------------
--  Order Items
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_id    INT            NOT NULL,
  product_id  INT            NOT NULL,
  product_name VARCHAR(200)  NOT NULL,             -- snapshot at order time
  quantity    INT            NOT NULL DEFAULT 1,
  unit_price  DECIMAL(10,3)  NOT NULL,             -- snapshot at order time
  color       VARCHAR(50)    DEFAULT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ------------------------------------------------------------
--  Indexes
-- ------------------------------------------------------------
CREATE INDEX idx_products_category  ON products(category_id);
CREATE INDEX idx_orders_client      ON orders(client_id);
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_order_items_order  ON order_items(order_id);

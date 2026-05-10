import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// ── GET /api/products ────────────────────────────────────────
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, search, page = '1', limit = '20' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params: unknown[] = [];
    let where = 'WHERE p.is_active = 1';

    if (category && category !== 'all') {
      where += ' AND p.category_slug = ?';
      params.push(category);
    }
    if (search) {
      where += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const rows = db.prepare(`
      SELECT p.*, c.name AS category_name
      FROM products p
      JOIN categories c ON c.slug = p.category_slug
      ${where}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).all([...params, Number(limit), offset]);

    const total = (db.prepare(`
      SELECT COUNT(*) as cnt FROM products p ${where}
    `).get(params) as { cnt: number }).cnt;

    res.json({
      data: rows.map(parseProduct),
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ── GET /api/products/:id ────────────────────────────────────
router.get('/:id', (req: Request, res: Response) => {
  try {
    const row = db.prepare(`
      SELECT p.*, c.name AS category_name
      FROM products p
      JOIN categories c ON c.slug = p.category_slug
      WHERE p.id = ? AND p.is_active = 1
    `).get(req.params.id);

    if (!row) { res.status(404).json({ error: 'Product not found' }); return; }
    res.json(parseProduct(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ── POST /api/products ───────────────────────────────────────
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, description, price, original_price, category_slug, stock, images, tags, material, colors, is_new, is_bestseller } = req.body;
    if (!name || !price || !category_slug) {
      res.status(400).json({ error: 'name, price, and category_slug are required' }); return;
    }
    const result = db.prepare(`
      INSERT INTO products (name, description, price, original_price, category_slug, stock, images, tags, material, colors, is_new, is_bestseller)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, description ?? null, price, original_price ?? null,
      category_slug, stock ?? 0,
      images ? JSON.stringify(images) : null,
      tags   ? JSON.stringify(tags)   : null,
      material ?? null,
      colors ? JSON.stringify(colors) : null,
      is_new ? 1 : 0, is_bestseller ? 1 : 0
    );
    res.status(201).json({ id: result.lastInsertRowid, message: 'Product created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// ── PUT /api/products/:id ────────────────────────────────────
router.put('/:id', (req: Request, res: Response) => {
  try {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as Record<string, unknown> | undefined;
    if (!existing) { res.status(404).json({ error: 'Product not found' }); return; }

    const { name, description, price, original_price, category_slug, stock, images, tags, material, colors, is_new, is_bestseller, is_active } = req.body;

    db.prepare(`
      UPDATE products SET
        name           = ?,
        description    = ?,
        price          = ?,
        original_price = ?,
        category_slug  = ?,
        stock          = ?,
        images         = ?,
        tags           = ?,
        material       = ?,
        colors         = ?,
        is_new         = ?,
        is_bestseller  = ?,
        is_active      = ?,
        updated_at     = datetime('now')
      WHERE id = ?
    `).run(
      name          ?? existing.name,
      description   ?? existing.description,
      price         ?? existing.price,
      original_price !== undefined ? original_price : existing.original_price,
      category_slug ?? existing.category_slug,
      stock         ?? existing.stock,
      images        ? JSON.stringify(images) : existing.images,
      tags          ? JSON.stringify(tags)   : existing.tags,
      material      ?? existing.material,
      colors        ? JSON.stringify(colors) : existing.colors,
      is_new        !== undefined ? (is_new ? 1 : 0)        : existing.is_new,
      is_bestseller !== undefined ? (is_bestseller ? 1 : 0) : existing.is_bestseller,
      is_active     !== undefined ? (is_active ? 1 : 0)     : existing.is_active,
      req.params.id,
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ── DELETE /api/products/:id (soft delete) ───────────────────
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const result = db.prepare("UPDATE products SET is_active = 0, updated_at = datetime('now') WHERE id = ?").run(req.params.id);
    if (result.changes === 0) { res.status(404).json({ error: 'Product not found' }); return; }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

function parseProduct(row: unknown): unknown {
  const r = row as Record<string, unknown>;
  return {
    ...r,
    images:       safeJson(r.images, []),
    tags:         safeJson(r.tags,   []),
    colors:       safeJson(r.colors, []),
    inStock:      Number(r.stock) > 0,
    isNew:        Boolean(r.is_new),
    isBestSeller: Boolean(r.is_bestseller),
    isActive:     Boolean(r.is_active),
  };
}

function safeJson(val: unknown, fallback: unknown): unknown {
  if (!val) return fallback;
  try { return JSON.parse(val as string); } catch { return fallback; }
}

export default router;

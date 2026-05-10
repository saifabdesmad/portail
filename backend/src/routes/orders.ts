import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

const ALLOWED_STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled'];

// ── GET /api/orders ──────────────────────────────────────────
router.get('/', (req: Request, res: Response) => {
  try {
    const { status, page = '1', limit = '50' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params: unknown[] = [];
    let where = '';

    if (status && status !== 'all') { where = 'WHERE o.status = ?'; params.push(status); }

    const orders = db.prepare(`
      SELECT o.*, cl.name AS client_name, cl.email AS client_email, cl.phone AS client_phone, cl.address AS client_address
      FROM orders o
      JOIN clients cl ON cl.id = o.client_id
      ${where}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `).all([...params, Number(limit), offset]) as Record<string, unknown>[];

    const orderIds = orders.map(o => o.id as number);
    let items: Record<string, unknown>[] = [];
    if (orderIds.length > 0) {
      items = db.prepare(`
        SELECT oi.* FROM order_items oi WHERE oi.order_id IN (${orderIds.map(() => '?').join(',')})
      `).all(orderIds) as Record<string, unknown>[];
    }

    const ordersWithItems = orders.map(o => ({
      ...o,
      items: items.filter(i => i.order_id === o.id),
    }));

    const total = (db.prepare(`SELECT COUNT(*) as cnt FROM orders o ${where}`).get(params) as { cnt: number }).cnt;

    res.json({
      data: ordersWithItems,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ── GET /api/orders/:id ──────────────────────────────────────
router.get('/:id', (req: Request, res: Response) => {
  try {
    const order = db.prepare(`
      SELECT o.*, cl.name AS client_name, cl.email AS client_email,
             cl.phone AS client_phone, cl.address AS client_address
      FROM orders o JOIN clients cl ON cl.id = o.client_id
      WHERE o.id = ?
    `).get(req.params.id);

    if (!order) { res.status(404).json({ error: 'Order not found' }); return; }
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(req.params.id);
    res.json({ ...order as object, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ── POST /api/orders ─────────────────────────────────────────
router.post('/', (req: Request, res: Response) => {
  try {
    const { client_id, items, notes, promo_code, discount_amount = 0, shipping_amount = 7 } = req.body;

    if (!client_id || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'client_id and items[] are required' }); return;
    }

    const total_amount = items.reduce(
      (sum: number, i: { quantity: number; unit_price: number }) => sum + i.quantity * i.unit_price, 0
    ) + Number(shipping_amount) - Number(discount_amount);

    const insertOrder = db.prepare(`
      INSERT INTO orders (client_id, total_amount, shipping_amount, promo_code, discount_amount, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, color)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const productIds = items.map((i: { product_id: number }) => i.product_id);
    const productRows = db.prepare(
      `SELECT id, name FROM products WHERE id IN (${productIds.map(() => '?').join(',')})`
    ).all(productIds) as { id: number; name: string }[];
    const productMap: Record<number, string> = {};
    productRows.forEach(p => { productMap[p.id] = p.name; });

    const createOrder = db.transaction(() => {
      const orderResult = insertOrder.run(
        client_id, total_amount, shipping_amount, promo_code ?? null, discount_amount, notes ?? null
      );
      const orderId = orderResult.lastInsertRowid;
      for (const item of items) {
        insertItem.run(orderId, item.product_id, productMap[item.product_id] ?? '', item.quantity, item.unit_price, item.color ?? null);
      }
      return orderId;
    });

    const orderId = createOrder();
    res.status(201).json({ id: orderId, message: 'Order created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// ── PATCH /api/orders/:id/status ─────────────────────────────
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!ALLOWED_STATUSES.includes(status)) {
      res.status(400).json({ error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` }); return;
    }
    const result = db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, req.params.id);
    if (result.changes === 0) { res.status(404).json({ error: 'Order not found' }); return; }
    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;

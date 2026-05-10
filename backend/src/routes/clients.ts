import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// ── GET /api/clients ─────────────────────────────────────────
router.get('/', (_req: Request, res: Response) => {
  try {
    const clients = db.prepare(`
      SELECT c.*,
        COUNT(o.id)       AS order_count,
        COALESCE(SUM(o.total_amount), 0) AS total_spent
      FROM clients c
      LEFT JOIN orders o ON o.client_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// ── GET /api/clients/:id ─────────────────────────────────────
router.get('/:id', (req: Request, res: Response) => {
  try {
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
    if (!client) { res.status(404).json({ error: 'Client not found' }); return; }

    const orders = db.prepare(
      'SELECT id, status, total_amount, created_at FROM orders WHERE client_id = ? ORDER BY created_at DESC'
    ).all(req.params.id);

    res.json({ ...client as object, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// ── POST /api/clients ────────────────────────────────────────
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email) { res.status(400).json({ error: 'name and email are required' }); return; }

    const result = db.prepare(
      'INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)'
    ).run(name, email, phone ?? null, address ?? null);

    res.status(201).json({ id: result.lastInsertRowid, message: 'Client created' });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Email already exists' }); return;
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

export default router;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/products';
import orderRoutes   from './routes/orders';
import clientRoutes  from './routes/clients';
import db from './db';

dotenv.config();

const app = express();

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL  || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/clients',  clientRoutes);

// ── Stats ────────────────────────────────────────────────────
app.get('/api/stats', (_req, res) => {
  try {
    const products   = db.prepare('SELECT COUNT(*) as cnt FROM products WHERE is_active = 1').get() as { cnt: number };
    const inStock    = db.prepare("SELECT COUNT(*) as cnt FROM products WHERE is_active = 1 AND stock > 0").get() as { cnt: number };
    const orders     = db.prepare('SELECT COUNT(*) as cnt FROM orders').get() as { cnt: number };
    const pending    = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status = 'pending'").get() as { cnt: number };
    const clients    = db.prepare('SELECT COUNT(*) as cnt FROM clients').get() as { cnt: number };
    const revenue    = db.prepare("SELECT COALESCE(SUM(total_amount),0) as total FROM orders WHERE status NOT IN ('cancelled','pending')").get() as { total: number };
    const byStatus   = db.prepare("SELECT status, COUNT(*) as cnt FROM orders GROUP BY status").all();
    const recentOrders = db.prepare(`
      SELECT o.id, o.status, o.total_amount, o.created_at,
             c.name AS client_name
      FROM orders o JOIN clients c ON c.id = o.client_id
      ORDER BY o.created_at DESC LIMIT 5
    `).all();

    res.json({
      products:      products.cnt,
      inStock:       inStock.cnt,
      orders:        orders.cnt,
      pendingOrders: pending.cnt,
      clients:       clients.cnt,
      revenue:       revenue.total,
      byStatus,
      recentOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 fallback ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;

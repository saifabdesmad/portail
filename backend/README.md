# WAY3D — Backend API

Node.js + Express + TypeScript + MySQL REST API for the WAY3D e-commerce platform.

## Quick Start

### 1. Set up the database
```bash
# Import the schema into MySQL
mysql -u root -p < database.sql
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

### 3. Install & run
```bash
npm install
npm run dev      # development (hot-reload)
npm run build    # compile TypeScript
npm start        # run compiled build
```

Server starts on **http://localhost:3000**

---

## API Reference

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server status |

---

### Products `/api/products`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (supports `?category=deco`, `?search=vase`, `?page=1&limit=20`) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Add a new product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Soft-delete a product |

**POST / PUT body example:**
```json
{
  "name": "Vase Géométrique",
  "description": "Vase imprimé en 3D ...",
  "price": 45.000,
  "original_price": 55.000,
  "category_id": 2,
  "stock": 10,
  "images": ["/Produits/DECO/1/photo.webp"],
  "tags": ["new", "bestseller"],
  "material": "PLA",
  "colors": ["Blanc", "Noir", "Or"]
}
```

---

### Orders `/api/orders`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List all orders (supports `?status=pending`, `?page=1&limit=20`) |
| GET | `/api/orders/:id` | Get single order with items |
| POST | `/api/orders` | Create a new order |
| PATCH | `/api/orders/:id/status` | Update order status |

**POST body example:**
```json
{
  "client_id": 1,
  "shipping_amount": 7,
  "promo_code": "WELCOME10",
  "discount_amount": 5,
  "notes": "Livraison rapide SVP",
  "items": [
    { "product_id": 1, "quantity": 2, "unit_price": 45.000, "color": "Noir" }
  ]
}
```

**PATCH status values:** `pending` | `confirmed` | `processing` | `shipped` | `delivered` | `cancelled`

---

### Clients `/api/clients`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List all clients |
| GET | `/api/clients/:id` | Get client + their orders |
| POST | `/api/clients` | Create a new client |

---

## Project Structure
```
backend/
├── src/
│   ├── server.ts          # Entry point
│   ├── app.ts             # Express app & middleware
│   ├── db.ts              # MySQL connection pool
│   └── routes/
│       ├── products.ts    # Product CRUD
│       ├── orders.ts      # Order management
│       └── clients.ts     # Client management
├── database.sql           # MySQL schema
├── .env.example           # Environment template
├── tsconfig.json
└── package.json
```

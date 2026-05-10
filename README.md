# Backend & Admin Panel — Nassim Mansour

Hey, this is my part of the **Way3D** project.

I took care of everything related to data: the server, the database, and the admin panel that uses them. So basically the "behind the scenes" part of the app.

## What I built

### Backend (Node + Express + SQLite)

- REST API server (`server.ts`, `app.ts`)
- Database setup with `better-sqlite3` (`db.ts`) and the SQL schema (`database.sql`)
- Routes for **products**, **orders** and **clients** (full CRUD)
- CORS, env config and a small README for how to run it

### Admin panel (frontend)

- **Admin login** page (protected access)
- **Dashboard** with stats and overview
- **Manage Products** (create / edit / delete)
- **Manage Orders** (view, update status)
- **Manage Clients**
- Shared **AdminLayout** (sidebar + topbar)
- **AdminContext** to handle admin auth state
- The **API client** (`src/api/index.ts`) used by both the storefront and the admin panel to talk to my backend

## Tech I used

- Node.js + Express 5
- SQLite (`better-sqlite3`)
- TypeScript
- React + TypeScript for the admin UI

## File structure

```
nassim-mansour-backend-admin/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   ├── db.ts
│   │   └── routes/
│   │       ├── products.ts
│   │       ├── orders.ts
│   │       └── clients.ts
│   ├── database.sql
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
└── src/
    ├── api/
    │   └── index.ts
    ├── context/
    │   └── AdminContext.tsx
    └── pages/
        └── admin/
            ├── AdminLayout.tsx
            ├── AdminLogin.tsx
            ├── AdminDashboard.tsx
            ├── AdminProducts.tsx
            ├── AdminOrders.tsx
            └── AdminClients.tsx
```

## How to run it

### Backend

```bash
cd backend
cp .env.example .env       # then fill in your values
npm install
npm run dev
```

The API will start on the port set in `.env` (default `3001`).

### Admin panel

It runs as part of the main React app:

```bash
npm install
npm run dev
```

Then go to `http://localhost:5173/admin/login`.

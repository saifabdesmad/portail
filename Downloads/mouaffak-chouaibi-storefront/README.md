# Storefront — Mouaffak Chouaibi

Hey, this is my part of the **Way3D** project.

I worked on the customer-facing side of the shop — basically everything a visitor sees and clicks on before checking out. I focused a lot on the look-and-feel and the shopping flow.

## What I built

- **Home page** with the hero section and featured products
- **Products listing** page with filters
- **Product detail** page
- **Cart** (the slide-in sidebar)
- **Checkout** flow
- **About** and **Contact** pages
- **Navbar** and **Footer** (shared across the whole app)
- **Cart state management** (`CartContext`)
- All the static assets (icons, product images in `public/Produits/`, favicon)
- Tailwind, Vite and TypeScript configuration

## Tech I used

- React 19 + TypeScript
- Vite (dev server and bundler)
- TailwindCSS for styling
- React Router for navigation
- Framer Motion / GSAP for some of the animations

## File structure

```
mouaffak-chouaibi-storefront/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartSidebar.tsx
│   │   ├── AuthModal.tsx
│   │   └── MessageComponent.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Checkout.tsx
│   │   └── NotFound.tsx
│   ├── context/
│   │   └── CartContext.tsx
│   ├── data/
│   │   └── products.ts
│   └── utils/
│       └── format.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## How to run it

From the project root:

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

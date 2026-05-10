import React, { useState, useMemo } from 'react';
import {
  Database, Download, BarChart2, Table2, Code2,
  Search, ArrowUp, ArrowDown, ArrowUpDown,
  FileJson, FileText, TrendingUp, Package, Star, Layers,
} from 'lucide-react';
import { products, categories } from '../data/products';
import { formatPrice } from '../utils/format';
import type { Product } from '../data/products';

// ── Derived stats ────────────────────────────────────────────────────────────

const totalProducts = products.length;
const inStockCount  = products.filter(p => p.inStock).length;
const avgPrice      = products.reduce((s, p) => s + p.price, 0) / totalProducts;
const totalReviews  = products.reduce((s, p) => s + p.reviews, 0);
const avgRating     = +(products.reduce((s, p) => s + p.rating, 0) / totalProducts).toFixed(2);
const bestSellerCount = products.filter(p => p.isBestSeller).length;
const newArrivalCount = products.filter(p => p.isNew).length;

const categoryCounts = categories
  .filter(c => c.id !== 'all')
  .map(c => ({ ...c, count: products.filter(p => p.category === c.id).length }))
  .sort((a, b) => b.count - a.count);

const priceRanges = [
  { label: '< 30 TND',    min: 0,   max: 30         },
  { label: '30–60 TND',   min: 30,  max: 60         },
  { label: '60–100 TND',  min: 60,  max: 100        },
  { label: '> 100 TND',   min: 100, max: Infinity   },
];
const priceData = priceRanges.map(r => ({
  ...r,
  count: products.filter(p => p.price >= r.min && p.price < r.max).length,
}));

const materialMap = products.reduce<Record<string, number>>((acc, p) => {
  acc[p.material] = (acc[p.material] ?? 0) + 1;
  return acc;
}, {});
const materialData = Object.entries(materialMap)
  .map(([material, count]) => ({ material, count }))
  .sort((a, b) => b.count - a.count);

// ── Exports ──────────────────────────────────────────────────────────────────

const downloadBlob = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const exportCSV = () => {
  const headers = ['ID','Nom','Catégorie','Prix (TND)','Note','Avis','En stock','Matière','Temps impression','Tags'];
  const rows = products.map(p => [
    p.id,
    `"${p.name}"`,
    p.category,
    p.price.toFixed(3),
    p.rating,
    p.reviews,
    p.inStock ? 'Oui' : 'Non',
    `"${p.material}"`,
    `"${p.printTime}"`,
    `"${p.tags.join(', ')}"`,
  ].join(','));
  downloadBlob([headers.join(','), ...rows].join('\n'), 'way3d-produits.csv', 'text/csv;charset=utf-8;');
};

const exportJSON = () => {
  const data = products.map(({ id, name, category, price, rating, reviews, inStock, material, printTime, tags }) =>
    ({ id, name, category, price, rating, reviews, inStock, material, printTime, tags })
  );
  downloadBlob(JSON.stringify(data, null, 2), 'way3d-produits.json', 'application/json');
};

// ── Sub-components ────────────────────────────────────────────────────────────

/** Horizontal bar chart */
const HBar: React.FC<{ label: string; icon?: string; value: number; max: number; color: string }> = ({
  label, icon, value, max, color,
}) => (
  <div className="flex items-center gap-3 group">
    <div className="w-40 flex-shrink-0 flex items-center gap-1.5">
      {icon && <span className="text-base">{icon}</span>}
      <span className="text-xs font-medium text-ink-secondary truncate">{label}</span>
    </div>
    <div className="flex-1 h-7 bg-surface-100 rounded-lg overflow-hidden relative">
      <div
        className="h-full rounded-lg transition-all duration-700 ease-out"
        style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
      />
      <span className="absolute inset-0 flex items-center pl-3 text-xs font-bold text-ink mix-blend-multiply">
        {value}
      </span>
    </div>
  </div>
);

/** Vertical bar (price ranges) */
const VBar: React.FC<{ label: string; value: number; max: number; color: string }> = ({
  label, value, max, color,
}) => (
  <div className="flex flex-col items-center gap-1.5 flex-1">
    <span className="text-sm font-bold text-ink">{value}</span>
    <div className="w-full flex items-end h-28 bg-surface-100 rounded-xl overflow-hidden">
      <div
        className="w-full rounded-xl transition-all duration-700 ease-out"
        style={{ height: `${(value / max) * 100}%`, backgroundColor: color }}
      />
    </div>
    <span className="text-xs text-ink-muted text-center leading-tight">{label}</span>
  </div>
);

/** Donut segment */
const DonutChart: React.FC<{ inStock: number; total: number }> = ({ inStock, total }) => {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const pct = inStock / total;
  const dash = circ * pct;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f0f0f0" strokeWidth="16" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke="#4ECDC4" strokeWidth="16"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke="#F5C842" strokeWidth="16"
        strokeDasharray={`${circ - dash} ${dash}`}
        strokeDashoffset={circ / 4 - dash}
        strokeLinecap="round"
        opacity="0.7"
      />
      <text x="70" y="66" textAnchor="middle" className="font-bold" fontSize="18" fill="#1a1a2e" fontWeight="800">
        {Math.round(pct * 100)}%
      </text>
      <text x="70" y="82" textAnchor="middle" fontSize="10" fill="#666">en stock</text>
    </svg>
  );
};

// ── Sort helpers ─────────────────────────────────────────────────────────────

type SortKey = 'name' | 'price' | 'rating' | 'reviews';
type SortDir = 'asc' | 'desc';

const SortIcon: React.FC<{ col: SortKey; active: SortKey; dir: SortDir }> = ({ col, active, dir }) => {
  if (col !== active) return <ArrowUpDown size={13} className="text-ink-faint" />;
  return dir === 'asc'
    ? <ArrowUp size={13} className="text-brand-teal" />
    : <ArrowDown size={13} className="text-brand-teal" />;
};

// ── Mock API endpoints ────────────────────────────────────────────────────────

const API_BASE = 'https://api.way3d.tn/v1';
const endpoints = [
  { method: 'GET',    path: '/products',           desc: 'Liste tous les produits du catalogue' },
  { method: 'GET',    path: '/products/:id',        desc: 'Détail d\'un produit par identifiant' },
  { method: 'GET',    path: '/products?category=',  desc: 'Filtre les produits par catégorie' },
  { method: 'GET',    path: '/categories',          desc: 'Liste des catégories disponibles' },
  { method: 'GET',    path: '/stats/overview',      desc: 'Statistiques agrégées du catalogue' },
  { method: 'GET',    path: '/stats/by-category',   desc: 'Décompte des produits par catégorie' },
  { method: 'GET',    path: '/stats/price-ranges',  desc: 'Distribution des prix' },
  { method: 'POST',   path: '/orders',              desc: 'Soumettre une nouvelle commande' },
  { method: 'GET',    path: '/orders/:id',          desc: 'Statut d\'une commande' },
];

const methodColor: Record<string, string> = {
  GET:  'bg-emerald-100 text-emerald-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT:  'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-600',
};

// ── Main component ─────────────────────────────────────────────────────────────

const DataPortal: React.FC = () => {
  const [search,  setSearch]  = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('reviews');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [activeTab, setActiveTab] = useState<'charts' | 'table' | 'api'>('charts');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let list: Product[] = [...products];
    if (catFilter !== 'all') list = list.filter(p => p.category === catFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    }
    list.sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      if (typeof av === 'number' && typeof bv === 'number')
        return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return list;
  }, [search, catFilter, sortKey, sortDir]);

  const catMax = Math.max(...categoryCounts.map(c => c.count));
  const priceMax = Math.max(...priceData.map(d => d.count));

  const chartColors = ['#4ECDC4', '#F5C842', '#FF6B6B', '#9B59B6', '#3498DB', '#2ECC71', '#E67E22'];

  const tabs = [
    { id: 'charts', label: 'Visualisations', icon: BarChart2 },
    { id: 'table',  label: 'Explorateur',    icon: Table2    },
    { id: 'api',    label: 'API Reference',  icon: Code2     },
  ] as const;

  return (
    <div className="min-h-screen bg-surface-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-ink text-white pt-14 pb-10">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-semibold mb-4">
                <Database size={12} />
                Portail de Données Ouvertes
              </div>
              <h1 className="font-display font-black text-4xl md:text-5xl mb-3">
                WAY<span className="text-brand-yellow">3D</span> Data Portal
              </h1>
              <p className="text-white/60 text-sm max-w-lg leading-relaxed">
                Explorez les données du catalogue WAY3D en toute transparence — statistiques,
                visualisations interactives, export CSV/JSON et référence API.
              </p>
            </div>

            {/* Quick stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Produits',    value: totalProducts,             icon: Package,    color: 'text-brand-yellow' },
                { label: 'Catégories', value: categoryCounts.length,     icon: Layers,     color: 'text-brand-teal'   },
                { label: 'Prix moy.',  value: `${avgPrice.toFixed(0)} TND`, icon: TrendingUp, color: 'text-emerald-400' },
                { label: 'Note moy.',  value: `${avgRating} ★`,          icon: Star,       color: 'text-amber-400'   },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-2xl p-4 min-w-[100px]">
                  <s.icon size={16} className={`mb-2 ${s.color}`} />
                  <p className="font-black text-xl">{s.value}</p>
                  <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-ink-border sticky top-16 z-30">
        <div className="container-wide">
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-ink text-white'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface-100'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wide py-10 space-y-10">

        {/* ══ CHARTS TAB ═════════════════════════════════════════════════════ */}
        {activeTab === 'charts' && (
          <>
            {/* Top stats row */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'En stock',       value: inStockCount,     total: totalProducts, unit: 'produits',   color: '#4ECDC4' },
                { label: 'Best-sellers',   value: bestSellerCount,  total: totalProducts, unit: 'produits',   color: '#F5C842' },
                { label: 'Nouveautés',     value: newArrivalCount,  total: totalProducts, unit: 'produits',   color: '#FF6B6B' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-ink-border p-5">
                  <p className="text-ink-muted text-xs font-semibold uppercase tracking-wider mb-3">{s.label}</p>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="font-black text-3xl text-ink">{s.value}</span>
                    <span className="text-ink-faint text-sm mb-1">/ {s.total}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(s.value / s.total) * 100}%`, backgroundColor: s.color }}
                    />
                  </div>
                  <p className="text-xs text-ink-faint mt-1.5">{Math.round((s.value / s.total) * 100)}% du catalogue</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

              {/* Produits par catégorie */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-ink-border p-6">
                <h3 className="font-bold text-ink mb-5 flex items-center gap-2">
                  <BarChart2 size={16} className="text-brand-teal" />
                  Produits par catégorie
                </h3>
                <div className="space-y-3">
                  {categoryCounts.map((c, i) => (
                    <HBar
                      key={c.id}
                      label={c.label}
                      icon={c.icon}
                      value={c.count}
                      max={catMax}
                      color={chartColors[i % chartColors.length]}
                    />
                  ))}
                </div>
              </div>

              {/* Disponibilité stock donut */}
              <div className="bg-white rounded-2xl border border-ink-border p-6 flex flex-col items-center justify-center gap-4">
                <h3 className="font-bold text-ink flex items-center gap-2 self-start">
                  <Package size={16} className="text-brand-yellow" />
                  Disponibilité
                </h3>
                <DonutChart inStock={inStockCount} total={totalProducts} />
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-brand-teal inline-block" />
                    En stock ({inStockCount})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-brand-yellow opacity-70 inline-block" />
                    Rupture ({totalProducts - inStockCount})
                  </span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">

              {/* Distribution prix */}
              <div className="bg-white rounded-2xl border border-ink-border p-6">
                <h3 className="font-bold text-ink mb-6 flex items-center gap-2">
                  <TrendingUp size={16} className="text-brand-yellow" />
                  Distribution des prix
                </h3>
                <div className="flex items-end gap-3 h-40">
                  {priceData.map((d, i) => (
                    <VBar key={d.label} label={d.label} value={d.count} max={priceMax} color={chartColors[i]} />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-ink-border flex gap-6 text-xs text-ink-muted">
                  <span>Prix min : <strong className="text-ink">{formatPrice(Math.min(...products.map(p => p.price)))}</strong></span>
                  <span>Prix max : <strong className="text-ink">{formatPrice(Math.max(...products.map(p => p.price)))}</strong></span>
                  <span>Moyenne : <strong className="text-ink">{formatPrice(avgPrice)}</strong></span>
                </div>
              </div>

              {/* Matières */}
              <div className="bg-white rounded-2xl border border-ink-border p-6">
                <h3 className="font-bold text-ink mb-5 flex items-center gap-2">
                  <Layers size={16} className="text-purple-500" />
                  Matières d'impression
                </h3>
                <div className="space-y-3">
                  {materialData.map((m, i) => (
                    <HBar
                      key={m.material}
                      label={m.material}
                      value={m.count}
                      max={materialData[0].count}
                      color={chartColors[i % chartColors.length]}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Total reviews highlight */}
            <div className="bg-ink text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">Engagement communautaire</p>
                <p className="font-black text-4xl">{totalReviews.toLocaleString('fr-FR')}</p>
                <p className="text-white/60 text-sm mt-1">avis clients cumulés sur l'ensemble du catalogue</p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="font-black text-3xl text-brand-yellow">{avgRating}</p>
                  <p className="text-white/50 text-xs mt-0.5">Note moyenne</p>
                </div>
                <div className="text-center">
                  <p className="font-black text-3xl text-brand-teal">{Math.round(totalReviews / totalProducts)}</p>
                  <p className="text-white/50 text-xs mt-0.5">Avis / produit</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ TABLE TAB ══════════════════════════════════════════════════════ */}
        {activeTab === 'table' && (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher par nom, matière, tag…"
                  className="w-full pl-10 pr-4 py-2.5 border border-ink-border rounded-xl text-sm focus:outline-none focus:border-brand-teal bg-white"
                />
              </div>
              <select
                value={catFilter}
                onChange={e => setCatFilter(e.target.value)}
                className="px-3 py-2.5 border border-ink-border rounded-xl text-sm bg-white focus:outline-none focus:border-brand-teal min-w-[180px]"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-ink text-white rounded-xl text-sm font-medium hover:bg-ink/80 transition-colors flex-shrink-0"
              >
                <FileText size={14} />
                CSV
              </button>
              <button
                onClick={exportJSON}
                className="flex items-center gap-2 px-4 py-2.5 border border-ink-border text-ink rounded-xl text-sm font-medium hover:bg-surface-100 transition-colors flex-shrink-0"
              >
                <FileJson size={14} />
                JSON
              </button>
            </div>

            <div className="text-xs text-ink-muted">{filtered.length} produit{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}</div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-ink-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-50 border-b border-ink-border text-xs text-ink-muted uppercase tracking-wider">
                      <th className="px-4 py-3 text-left font-semibold">ID</th>
                      <th
                        className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-ink select-none"
                        onClick={() => toggleSort('name')}
                      >
                        <span className="flex items-center gap-1">
                          Nom <SortIcon col="name" active={sortKey} dir={sortDir} />
                        </span>
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">Catégorie</th>
                      <th
                        className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-ink select-none"
                        onClick={() => toggleSort('price')}
                      >
                        <span className="flex items-center justify-end gap-1">
                          Prix <SortIcon col="price" active={sortKey} dir={sortDir} />
                        </span>
                      </th>
                      <th
                        className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-ink select-none"
                        onClick={() => toggleSort('rating')}
                      >
                        <span className="flex items-center justify-end gap-1">
                          Note <SortIcon col="rating" active={sortKey} dir={sortDir} />
                        </span>
                      </th>
                      <th
                        className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-ink select-none"
                        onClick={() => toggleSort('reviews')}
                      >
                        <span className="flex items-center justify-end gap-1">
                          Avis <SortIcon col="reviews" active={sortKey} dir={sortDir} />
                        </span>
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">Stock</th>
                      <th className="px-4 py-3 text-left font-semibold">Matière</th>
                      <th className="px-4 py-3 text-left font-semibold">Temps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-border/60">
                    {filtered.map(p => {
                      const cat = categories.find(c => c.id === p.category);
                      return (
                        <tr key={p.id} className="hover:bg-surface-50 transition-colors">
                          <td className="px-4 py-3 text-ink-faint font-mono text-xs">{String(p.id).padStart(3, '0')}</td>
                          <td className="px-4 py-3 font-medium text-ink">
                            <div className="flex items-center gap-2">
                              {p.name}
                              <div className="flex gap-1">
                                {p.isBestSeller && (
                                  <span className="text-2xs px-1.5 py-0.5 bg-brand-yellow/20 text-amber-700 rounded-full font-semibold">Best</span>
                                )}
                                {p.isNew && (
                                  <span className="text-2xs px-1.5 py-0.5 bg-brand-teal/20 text-teal-700 rounded-full font-semibold">New</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-ink-secondary">
                            <span className="flex items-center gap-1">
                              {cat?.icon} {cat?.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-ink tabular-nums">
                            {formatPrice(p.price)}
                          </td>
                          <td className="px-4 py-3 text-right text-amber-600 font-medium tabular-nums">
                            {p.rating} ★
                          </td>
                          <td className="px-4 py-3 text-right text-ink-secondary tabular-nums">{p.reviews}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block w-2 h-2 rounded-full ${p.inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          </td>
                          <td className="px-4 py-3 text-ink-secondary text-xs">{p.material}</td>
                          <td className="px-4 py-3 text-ink-faint text-xs font-mono">{p.printTime}</td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-ink-muted">
                          Aucun produit ne correspond à votre recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-3 border-t border-ink-border bg-surface-50 flex items-center justify-between text-xs text-ink-muted">
                <span>{filtered.length} / {totalProducts} produits</span>
                <div className="flex gap-3">
                  <button onClick={exportCSV} className="flex items-center gap-1.5 hover:text-ink transition-colors">
                    <Download size={12} /> Exporter CSV
                  </button>
                  <button onClick={exportJSON} className="flex items-center gap-1.5 hover:text-ink transition-colors">
                    <Download size={12} /> Exporter JSON
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ API TAB ════════════════════════════════════════════════════════ */}
        {activeTab === 'api' && (
          <>
            <div className="bg-white rounded-2xl border border-ink-border overflow-hidden">
              <div className="px-6 py-5 border-b border-ink-border bg-surface-50 flex items-center gap-3">
                <Code2 size={18} className="text-brand-teal" />
                <div>
                  <h3 className="font-bold text-ink">API Référence — WAY3D Data API v1</h3>
                  <p className="text-xs text-ink-muted mt-0.5">Base URL : <code className="font-mono bg-surface-100 px-1.5 py-0.5 rounded">{API_BASE}</code></p>
                </div>
              </div>
              <div className="divide-y divide-ink-border/60">
                {endpoints.map((ep, i) => (
                  <div key={i} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-surface-50 transition-colors">
                    <span className={`self-start sm:self-auto flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg ${methodColor[ep.method] ?? 'bg-gray-100 text-gray-600'}`}>
                      {ep.method}
                    </span>
                    <code className="font-mono text-sm text-ink flex-1">{API_BASE}{ep.path}</code>
                    <span className="text-xs text-ink-muted sm:text-right">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample response */}
            <div className="bg-ink rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-white/60">GET {API_BASE}/stats/overview</span>
                <span className="text-xs text-emerald-400 font-medium">200 OK</span>
              </div>
              <pre className="px-5 py-5 text-xs font-mono text-white/80 overflow-x-auto leading-relaxed">
{JSON.stringify({
  totalProducts,
  totalCategories: categoryCounts.length,
  inStockCount,
  outOfStockCount: totalProducts - inStockCount,
  avgPrice: +avgPrice.toFixed(3),
  avgRating,
  totalReviews,
  bestSellers: bestSellerCount,
  newArrivals: newArrivalCount,
  updatedAt: new Date().toISOString(),
}, null, 2)}
              </pre>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
              <strong>Note :</strong> L'API WAY3D Data est actuellement en cours de développement. Les endpoints ci-dessus sont documentés à des fins de référence. Pour toute intégration, contactez <a href="mailto:api@way3d.tn" className="underline">api@way3d.tn</a>.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataPortal;

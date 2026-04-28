import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List, ChevronDown, X, Search, Star, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance',  label: 'Pertinence' },
  { value: 'newest',     label: 'Nouveautés' },
  { value: 'price-asc',  label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating',     label: 'Mieux notés' },
];

const materials = ['PLA Premium', 'PETG', 'Résine UV', 'TPU Flexible', 'ABS Renforcé'];

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view,       setView]       = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort,        setSort]       = useState<SortOption>('relevance');
  const [priceMax,    setPriceMax]   = useState(300);
  const [inStock,     setInStock]    = useState(false);
  const [minRating,   setMinRating]  = useState(0);
  const [selMaterials, setSelMaterials] = useState<string[]>([]);
  const [searchQ,     setSearchQ]    = useState(searchParams.get('search') || '');

  const activeCat = searchParams.get('category') || 'all';
  const setCat = (id: string) => setSearchParams(id === 'all' ? {} : { category: id });

  const toggleMaterial = (m: string) =>
    setSelMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const filtered = useMemo(() => {
    let r = [...products];
    if (activeCat !== 'all') r = r.filter(p => p.category === activeCat);
    if (searchQ) {
      const q = searchQ.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
    }
    r = r.filter(p => p.price <= priceMax);
    if (inStock) r = r.filter(p => p.inStock);
    if (minRating > 0) r = r.filter(p => p.rating >= minRating);
    if (selMaterials.length) r = r.filter(p => selMaterials.includes(p.material));
    switch (sort) {
      case 'price-asc':  r.sort((a, b) => a.price - b.price); break;
      case 'price-desc': r.sort((a, b) => b.price - a.price); break;
      case 'rating':     r.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     r.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }
    return r;
  }, [activeCat, searchQ, priceMax, inStock, minRating, selMaterials, sort]);

  const resetFilters = () => {
    setPriceMax(300); setInStock(false); setMinRating(0);
    setSelMaterials([]); setSearchQ(''); setSort('relevance'); setSearchParams({});
  };

  const activeFilterCount = [priceMax < 300, inStock, minRating > 0, selMaterials.length > 0, activeCat !== 'all', !!searchQ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-ink-border">
        <div className="container-wide py-10">
          <h1 className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight mb-1">Tous les Produits</h1>
          <p className="text-ink-muted text-sm">
            {filtered.length} produit{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
            {activeCat !== 'all' && <> dans <strong className="text-ink">{categories.find(c => c.id === activeCat)?.label}</strong></>}
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        {/* ── Search ── */}
        <div className="relative mb-6">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder="Rechercher par nom, tag, description…"
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-ink-border rounded-2xl text-sm focus:outline-none focus:border-brand-teal transition-colors shadow-sm"
          />
          {searchQ && (
            <button onClick={() => setSearchQ('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Category Pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCat(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-150 ${
                activeCat === cat.id
                  ? 'bg-ink text-white shadow-sm'
                  : 'bg-white border border-ink-border text-ink-secondary hover:border-ink-muted hover:text-ink'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* ── Sidebar Filters ── */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-3xl border border-ink-border p-6 sticky top-24 space-y-7">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-ink">Filtres</h3>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium">
                    <X size={12} />Réinitialiser
                  </button>
                )}
              </div>

              {/* Price */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-ink">Prix max</span>
                  <span className="text-sm font-bold text-brand-teal">{priceMax} TND</span>
                </div>
                <input
                  type="range" min={10} max={300} value={priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-ink-border accent-brand-teal cursor-pointer"
                  style={{ background: `linear-gradient(to right, #4ECDC4 0%, #4ECDC4 ${(priceMax / 300) * 100}%, #E5E5E5 ${(priceMax / 300) * 100}%, #E5E5E5 100%)` }}
                />
                <div className="flex justify-between text-2xs text-ink-faint mt-1">
                  <span>0 TND</span><span>300 TND</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-sm font-semibold text-ink mb-3">Note minimale</p>
                <div className="space-y-1">
                  {[0, 3, 4, 4.5].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r === minRating ? 0 : r)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                        minRating === r ? 'bg-brand-yellow-light text-ink font-semibold' : 'hover:bg-surface-50 text-ink-secondary'
                      }`}
                    >
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={11} className={s <= r ? 'text-brand-yellow fill-brand-yellow' : 'text-ink-border fill-ink-border'} />
                        ))}
                      </div>
                      <span className="text-xs">{r === 0 ? 'Toutes' : `${r}+`}</span>
                      {minRating === r && <Check size={12} className="ml-auto text-brand-teal" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">En stock seulement</span>
                <button
                  onClick={() => setInStock(s => !s)}
                  className={`relative w-10 h-5.5 rounded-full transition-colors ${inStock ? 'bg-brand-teal' : 'bg-ink-border'}`}
                  style={{ height: '1.375rem' }}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${inStock ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Materials */}
              <div>
                <p className="text-sm font-semibold text-ink mb-3">Matériaux</p>
                <div className="space-y-2">
                  {materials.map(m => (
                    <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        onClick={() => toggleMaterial(m)}
                        className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer
                          ${selMaterials.includes(m) ? 'bg-brand-teal border-brand-teal' : 'border-ink-border group-hover:border-ink-muted'}`}
                        style={{ width: '1.125rem', height: '1.125rem' }}
                      >
                        {selMaterials.includes(m) && <Check size={10} className="text-white" />}
                      </div>
                      <span className="text-sm text-ink-secondary group-hover:text-ink transition-colors">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setFiltersOpen(s => !s)}
                className={`lg:hidden btn-md btn-ghost text-sm gap-2 ${activeFilterCount ? 'border-brand-teal text-brand-teal' : ''}`}
              >
                <SlidersHorizontal size={15} />
                Filtres
                {activeFilterCount > 0 && <span className="w-5 h-5 bg-brand-teal text-white text-2xs rounded-full flex items-center justify-center">{activeFilterCount}</span>}
              </button>

              <div className="ml-auto flex items-center gap-2">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value as SortOption)}
                    className="appearance-none pl-4 pr-8 py-2 text-sm font-medium text-ink bg-white border border-ink-border rounded-xl focus:outline-none focus:border-brand-teal cursor-pointer transition-colors"
                  >
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" />
                </div>

                {/* View toggle */}
                <div className="flex bg-white border border-ink-border rounded-xl overflow-hidden">
                  {(['grid', 'list'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`p-2.5 transition-colors ${view === v ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink hover:bg-surface-50'}`}
                    >
                      {v === 'grid' ? <Grid3X3 size={15} /> : <List size={15} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {activeCat !== 'all' && (
                  <span className="badge bg-ink text-white gap-1.5">
                    {categories.find(c => c.id === activeCat)?.label}
                    <button onClick={() => setCat('all')}><X size={10} /></button>
                  </span>
                )}
                {inStock && <span className="badge badge-teal gap-1.5">En stock<button onClick={() => setInStock(false)}><X size={10} /></button></span>}
                {minRating > 0 && <span className="badge badge-yellow gap-1.5">{minRating}★+<button onClick={() => setMinRating(0)}><X size={10} /></button></span>}
                {priceMax < 300 && <span className="badge bg-surface-200 text-ink-secondary gap-1.5">≤{priceMax} TND<button onClick={() => setPriceMax(300)}><X size={10} /></button></span>}
                {selMaterials.map(m => (
                  <span key={m} className="badge bg-surface-200 text-ink-secondary gap-1.5">{m}<button onClick={() => toggleMaterial(m)}><X size={10} /></button></span>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-surface-100 rounded-3xl flex items-center justify-center text-3xl mb-5">🔍</div>
                <h3 className="font-display font-bold text-xl text-ink mb-2">Aucun résultat</h3>
                <p className="text-ink-muted text-sm mb-6 max-w-xs">Essayez d'autres termes ou modifiez vos filtres</p>
                <button onClick={resetFilters} className="btn-md btn-primary">Réinitialiser les filtres</button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(p => <ProductCard key={p.id} product={p} view="grid" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(p => <ProductCard key={p.id} product={p} view="list" />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, X, Check, AlertTriangle, Package, Loader } from 'lucide-react';
import { productsApi, type ApiProduct } from '../../api';
import { categories } from '../../data/products';
import { formatPrice } from '../../utils/format';

type ProductForm = {
  name: string; description: string; price: number; original_price: number | '';
  category_slug: string; stock: number; material: string; images: string[];
};

const emptyForm = (): ProductForm => ({
  name: '', description: '', price: 0, original_price: '',
  category_slug: 'home-decor', stock: 10, material: 'PLA Premium', images: [''],
});

const AdminProducts: React.FC = () => {
  const [productList, setProductList] = useState<ApiProduct[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');
  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState('all');
  const [showModal,   setShowModal]   = useState(false);
  const [editing,     setEditing]     = useState<ApiProduct | null>(null);
  const [form,        setForm]        = useState<ProductForm>(emptyForm());
  const [deleteId,    setDeleteId]    = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    productsApi.list({ limit: 100 })
      .then(r => setProductList(r.data))
      .catch(() => setError('Impossible de charger les produits'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Auto-open the "add product" modal if redirected from the dashboard.
  const location = useLocation();
  useEffect(() => {
    const state = location.state as { openAdd?: boolean } | null;
    if (state?.openAdd) {
      setEditing(null); setForm(emptyForm()); setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const visibleCategories = categories.filter(c => c.id !== 'all');

  const filtered = productList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === 'all' || p.category_slug === catFilter;
    return matchSearch && matchCat;
  });

  const openAdd = () => { setEditing(null); setForm(emptyForm()); setShowModal(true); };
  const openEdit = (p: ApiProduct) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, price: p.price,
      original_price: p.original_price ?? '',
      category_slug: p.category_slug, stock: p.stock,
      material: p.material, images: p.images.length ? p.images : [''],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      const body = {
        ...form,
        original_price: form.original_price === '' ? null : Number(form.original_price),
        images: form.images.filter(Boolean),
      };
      if (editing) {
        await productsApi.update(editing.id, body as Partial<ApiProduct>);
      } else {
        await productsApi.create(body as Partial<ApiProduct>);
      }
      setShowModal(false);
      load();
    } catch {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productsApi.delete(id);
      setDeleteId(null);
      load();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Produits</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {productList.length} produits au total
          </p>
        </div>
        <button onClick={openAdd}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-black hover:opacity-90"
                style={{ backgroundColor: '#F5C842' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Rechercher un produit..."
                 className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
                 style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <option value="all">Toutes catégories</option>
          {visibleCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size={24} className="animate-spin" style={{ color: '#F5C842' }} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Produit', 'Catégorie', 'Prix', 'Stock', 'Note', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'rgba(255,255,255,0.3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name}
                             className="w-11 h-11 rounded-xl object-cover shrink-0"
                             style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                             onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=60'; }} />
                        <div>
                          <div className="font-medium text-white">{p.name}</div>
                          <div className="text-xs mt-0.5 line-clamp-1 max-w-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: 'rgba(245,200,66,0.1)', color: '#F5C842' }}>
                        {p.category_name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{formatPrice(p.price)}</div>
                      {p.original_price && (
                        <div className="text-xs line-through mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {formatPrice(p.original_price)}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: p.stock > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                              color: p.stock > 0 ? '#10B981' : '#EF4444',
                            }}>
                        <span className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: p.stock > 0 ? '#10B981' : '#EF4444', display: 'inline-block' }} />
                        {p.stock > 0 ? `${p.stock} en stock` : 'Rupture'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <span style={{ color: '#F5C842' }}>★</span>
                        <span className="text-white font-medium">{p.rating}</span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>({p.review_count})</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                style={{ color: 'rgba(255,255,255,0.5)' }}>
                          <Pencil size={15} />
                        </button>
                        {deleteId === p.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleDelete(p.id)}
                                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400">
                              <Check size={15} />
                            </button>
                            <button onClick={() => setDeleteId(null)}
                                    className="p-2 rounded-lg hover:bg-white/10"
                                    style={{ color: 'rgba(255,255,255,0.4)' }}>
                              <X size={15} />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteId(p.id)}
                                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <Package size={40} className="mb-3 opacity-30" />
                <p>Aucun produit trouvé</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl overflow-hidden"
               style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4"
                 style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-semibold text-white">{editing ? 'Modifier' : 'Ajouter un produit'}</h3>
              <button onClick={() => setShowModal(false)}
                      className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {[
                { label: 'Nom *',                key: 'name',           type: 'text',   ph: 'Vase Géométrique' },
                { label: 'Prix TND *',           key: 'price',          type: 'number', ph: '0.000' },
                { label: 'Prix original TND',    key: 'original_price', type: 'number', ph: '0.000' },
                { label: 'Stock (unités)',        key: 'stock',          type: 'number', ph: '10' },
                { label: 'Matière',              key: 'material',       type: 'text',   ph: 'PLA Premium' },
                { label: 'Image URL principale', key: 'images',         type: 'text',   ph: '/Produits/...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph}
                         value={f.key === 'images'
                           ? form.images[0]
                           : String((form as Record<string, unknown>)[f.key] ?? '')}
                         onChange={e => {
                           if (f.key === 'images') { setForm(p => ({ ...p, images: [e.target.value] })); }
                           else { setForm(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })); }
                         }}
                         className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                         style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Description</label>
                <textarea rows={3} value={form.description}
                          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none resize-none"
                          style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Catégorie</label>
                <select value={form.category_slug}
                        onChange={e => setForm(p => ({ ...p, category_slug: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                        style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {visibleCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              {(!form.name || !form.price) && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
                     style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
                  <AlertTriangle size={14} /> Le nom et le prix sont obligatoires
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4"
                 style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10"
                      style={{ color: 'rgba(255,255,255,0.5)' }}>Annuler</button>
              <button onClick={handleSave} disabled={!form.name || !form.price || saving}
                      className="px-5 py-2 rounded-xl text-sm font-semibold text-black hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
                      style={{ backgroundColor: '#F5C842' }}>
                {saving && <Loader size={14} className="animate-spin" />}
                {editing ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

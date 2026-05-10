import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart, Heart, Share2, Star, Truck, Shield,
  RefreshCw, ChevronRight, Minus, Plus, Check, Printer, ArrowLeft
} from 'lucide-react';
import { products } from '../data/products';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const { addItem, openCart } = useCart();

  const [selColor, setSelColor] = useState(product?.colors?.[0]);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [wishlisted, setWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-5">🖨️</div>
        <h2 className="font-display font-bold text-2xl text-ink mb-3">Produit introuvable</h2>
        <Link to="/products" className="btn-md btn-primary">Retour aux produits</Link>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product, selColor);
    setAdded(true);
    setTimeout(() => { setAdded(false); openCart(); }, 1000);
  };

  const reviews = [
    { name: 'Sarra B.',   rating: 5, date: '15 Mars 2025',  comment: 'Produit magnifique, exactement comme sur les photos. Livraison rapide !' },
    { name: 'Ahmed K.',   rating: 4, date: '2 Avril 2025',   comment: 'Très bonne qualité d\'impression. Je suis satisfait de mon achat.' },
    { name: 'Nour T.',    rating: 5, date: '20 Avril 2025',  comment: 'Cadeau parfait ! Mon ami était ravi. Je recommande vivement.' },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-ink-border">
        <div className="container-wide py-3.5 flex items-center gap-2 text-xs text-ink-faint">
          <Link to="/" className="hover:text-ink transition-colors">Accueil</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-ink transition-colors">Produits</Link>
          <ChevronRight size={12} />
          <span className="text-ink font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="container-wide py-10">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors mb-8">
          <ArrowLeft size={15} /> Retour aux produits
        </Link>

        <div className="grid lg:grid-cols-2 gap-14 mb-16">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-white rounded-4xl overflow-hidden border border-ink-border mb-3 shadow-card">
              <img
                src={product.images[imgIdx]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=60'; }}
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.isNew && <span className="badge badge-teal">Nouveau</span>}
                {product.isBestSeller && <span className="badge badge-yellow">⭐ Bestseller</span>}
              </div>
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="badge bg-ink text-white text-sm px-5 py-2">Rupture de stock</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-18 h-18 rounded-2xl overflow-hidden border-2 transition-all ${imgIdx === i ? 'border-ink shadow-sm' : 'border-transparent hover:border-ink-border'}`}
                    style={{ width: '4.5rem', height: '4.5rem' }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=60'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Category & badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="eyebrow">{product.category.replace(/-/g, ' ')}</span>
            </div>

            <h1 className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-brand-yellow fill-brand-yellow' : 'text-ink-border fill-ink-border'} />
                ))}
              </div>
              <span className="text-sm font-semibold text-ink">{product.rating}</span>
              <span className="text-sm text-ink-faint">({product.reviews} avis)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-7">
              <span className="font-display font-black text-4xl text-ink">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-ink-faint line-through text-xl">{formatPrice(product.originalPrice)}</span>
                  <span className="badge badge-red text-sm">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Color */}
            {product.colors && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-ink mb-3">Couleur</p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelColor(c)}
                      title={c}
                      className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${selColor === c ? 'ring-2 ring-offset-2 ring-ink' : 'ring-1 ring-ink-border/40'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="mb-7">
              <p className="text-sm font-semibold text-ink mb-3">Quantité</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-ink-border rounded-xl overflow-hidden bg-white">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-surface-100 transition-colors text-ink-secondary">
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center font-bold text-ink select-none">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-surface-100 transition-colors text-ink-secondary">
                    <Plus size={15} />
                  </button>
                </div>
                <span className="text-sm text-ink-muted">
                  Total : <strong className="text-ink">{formatPrice(product.price * qty)}</strong>
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 mb-7">
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-1 btn-lg transition-all duration-200 ${
                  !product.inStock ? 'bg-surface-100 text-ink-faint cursor-not-allowed'
                  : added ? 'btn-teal'
                  : 'btn-dark'
                }`}
              >
                {added ? <><Check size={18} />Ajouté !</> : <><ShoppingCart size={18} />{product.inStock ? 'Ajouter au panier' : 'Épuisé'}</>}
              </button>
              <button
                onClick={() => setWishlisted(w => !w)}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${wishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-ink-border hover:border-ink-muted text-ink-secondary'}`}
              >
                <Heart size={18} className={wishlisted ? 'fill-red-500' : ''} />
              </button>
              <button className="w-14 h-14 rounded-2xl border border-ink-border hover:border-ink-muted flex items-center justify-center text-ink-secondary transition-colors">
                <Share2 size={18} />
              </button>
            </div>

            {/* Quick specs grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: Printer,   label: 'Matériau',     value: product.material },
                { icon: Shield,    label: 'Précision',    value: '0.1 mm' },
                { icon: Truck,     label: 'Livraison',    value: '24–48 h' },
                { icon: RefreshCw, label: 'Retours',      value: '7 jours' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-ink-border">
                  <s.icon size={16} className="text-brand-teal flex-shrink-0" />
                  <div>
                    <p className="text-2xs text-ink-faint uppercase tracking-wider">{s.label}</p>
                    <p className="text-sm font-semibold text-ink">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl border border-ink-border overflow-hidden mb-16 shadow-card">
          <div className="flex border-b border-ink-border">
            {(['description', 'specs', 'reviews'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-semibold transition-all capitalize ${
                  tab === t ? 'text-ink border-b-2 border-ink' : 'text-ink-muted hover:text-ink-secondary'
                }`}
              >
                {t === 'description' ? 'Description' : t === 'specs' ? 'Spécifications' : `Avis (${reviews.length})`}
              </button>
            ))}
          </div>
          <div className="p-8">
            {tab === 'description' && (
              <div className="max-w-2xl">
                <p className="text-ink-secondary leading-relaxed">{product.description}</p>
                <div className="mt-6 p-5 bg-surface-50 rounded-2xl border border-ink-border">
                  <p className="font-semibold text-ink mb-3">Pourquoi choisir WAY3D ?</p>
                  <ul className="space-y-2.5">
                    {['Précision 0.1 mm avec des imprimantes pro', 'Matériaux certifiés et testés', 'Personnalisation complète', 'Contrôle qualité avant expédition'].map(item => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-ink-secondary">
                        <Check size={14} className="text-brand-teal flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 mt-5">
                  {product.tags.map(t => (
                    <span key={t} className="px-3 py-1.5 bg-surface-100 text-ink-muted text-xs font-medium rounded-full border border-ink-border/50">#{t}</span>
                  ))}
                </div>
              </div>
            )}
            {tab === 'specs' && (
              <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                {[
                  ['Matériau', product.material],
                  ["Temps d'impression", product.printTime],
                  ['Disponibilité', product.inStock ? 'En stock ✓' : 'Rupture de stock'],
                  ['Couleurs', `${product.colors?.length ?? 1} coloris`],
                  ['Catégorie', product.category.replace(/-/g, ' ')],
                  ['Note', `${product.rating}/5 (${product.reviews} avis)`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-ink-border">
                    <span className="text-sm text-ink-muted">{label}</span>
                    <span className="text-sm font-semibold text-ink">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'reviews' && (
              <div className="space-y-6 max-w-2xl">
                {reviews.map((r, i) => (
                  <div key={i} className={`${i < reviews.length - 1 ? 'pb-6 border-b border-ink-border' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-ink font-bold text-sm flex-shrink-0">
                        {r.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-ink text-sm">{r.name}</h4>
                          <span className="text-xs text-ink-faint">{r.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(5)].map((_, s) => <Star key={s} size={12} className={s < r.rating ? 'text-brand-yellow fill-brand-yellow' : 'text-ink-border'} />)}
                        </div>
                        <p className="text-sm text-ink-secondary leading-relaxed">{r.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <div className="section-line mb-4" />
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display font-black text-2xl md:text-3xl text-ink tracking-tight">Vous aimerez aussi</h2>
              <Link to="/products" className="btn-md btn-ghost text-sm">Voir plus →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

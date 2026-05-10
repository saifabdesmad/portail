import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ArrowUpRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, formatDiscount } from '../utils/format';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, view = 'grid' }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!product.inStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWishlisted(w => !w);
  };

  /* ── LIST VIEW ─────────────────────────────────── */
  const navigate = useNavigate();

  if (view === 'list') {
    return (
      <div
        role="link"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/products/${product.id}`); }}
        onClick={() => navigate(`/products/${product.id}`)}
        className="group flex gap-5 p-4 bg-white rounded-2xl border border-ink-border hover:border-brand-yellow hover:shadow-card transition-all duration-200 cursor-pointer"
      >
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-surface-100 flex-shrink-0">
          <img
            src={product.images[0]} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=60'; }}
          />
          {!product.inStock && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><span className="text-2xs font-semibold text-ink-muted">Épuisé</span></div>}
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-semibold text-ink text-sm group-hover:text-brand-teal transition-colors truncate">{product.name}</h3>
            <p className="text-ink-muted text-xs mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={11} className={i < Math.floor(product.rating) ? 'text-brand-yellow fill-brand-yellow' : 'text-ink-border fill-ink-border'} />)}
              <span className="text-2xs text-ink-faint ml-1">({product.reviews})</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-ink">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-ink-faint line-through text-xs">{formatPrice(product.originalPrice)}</span>}
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`btn-sm text-xs ${product.inStock ? added ? 'btn-teal' : 'btn-primary' : 'bg-surface-100 text-ink-faint cursor-not-allowed'}`}
            >
              {added ? '✓ Ajouté' : product.inStock ? 'Ajouter' : 'Épuisé'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── GRID VIEW ─────────────────────────────────── */
  return (
    <div
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/products/${product.id}`); }}
      onClick={() => navigate(`/products/${product.id}`)}
      className="group block bg-white rounded-3xl overflow-hidden border border-ink-border hover:border-transparent hover:shadow-card-hover transition-all duration-300 ease-spring cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-surface-100" style={{ aspectRatio: '1/1' }}>
        <img
          src={product.images[hovered && product.images[1] ? 1 : 0]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60'; }}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <span className="badge badge-teal">Nouveau</span>}
          {product.isBestSeller && <span className="badge badge-yellow">⭐ Bestseller</span>}
          {product.originalPrice && (
            <span className="badge badge-red">-{formatDiscount(product.originalPrice, product.price)}%</span>
          )}
          {!product.inStock && <span className="badge bg-ink/70 text-white">Épuisé</span>}
        </div>

        {/* Wishlist — top right */}
        <button
          onClick={handleWish}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart size={15} className={wishlisted ? 'text-red-500 fill-red-500' : 'text-ink-secondary'} />
        </button>

        {/* Quick-add — bottom, slides up */}
        <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-spring">
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150
              ${!product.inStock
                ? 'bg-white/60 text-ink-faint cursor-not-allowed'
                : added
                ? 'bg-brand-teal text-white'
                : 'bg-white text-ink hover:bg-brand-yellow'
              }`}
          >
            {added ? (
              <>✓ Ajouté au panier</>
            ) : product.inStock ? (
              <><ShoppingCart size={15} />Ajouter au panier</>
            ) : 'Rupture de stock'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Category */}
        <p className="eyebrow text-2xs mb-1.5">{product.category.replace(/-/g, ' ')}</p>

        {/* Name */}
        <h3 className="font-semibold text-ink text-sm leading-snug line-clamp-1 group-hover:text-brand-teal transition-colors duration-200 mb-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className={i < Math.floor(product.rating) ? 'text-brand-yellow fill-brand-yellow' : 'text-ink-border fill-ink-border'} />
            ))}
          </div>
          <span className="text-2xs text-ink-faint">{product.rating} ({product.reviews})</span>
        </div>

        {/* Color swatches */}
        {product.colors && (
          <div className="flex items-center gap-1 mb-4">
            {product.colors.slice(0, 5).map(c => (
              <div key={c} className="w-3.5 h-3.5 rounded-full border border-ink-border/50 hover:scale-125 transition-transform cursor-pointer" style={{ backgroundColor: c }} />
            ))}
            {product.colors.length > 5 && <span className="text-2xs text-ink-faint">+{product.colors.length - 5}</span>}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-ink price-tag">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-ink-faint line-through text-xs">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <Link
            to={`/products/${product.id}`}
            onClick={e => e.stopPropagation()}
            className="w-8 h-8 rounded-full bg-surface-100 group-hover:bg-brand-yellow flex items-center justify-center transition-colors duration-200"
          >
            <ArrowUpRight size={14} className="text-ink-muted group-hover:text-ink" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

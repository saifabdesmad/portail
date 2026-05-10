import React from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { Link } from 'react-router-dom';

const CartSidebar: React.FC = () => {
  const { state, closeCart, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  if (!state.isOpen) return null;

  const shippingFree = totalPrice >= 100;
  const shippingCost = 7;
  const orderTotal = totalPrice + (shippingFree ? 0 : shippingCost);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 z-50 animate-fade-in"
        style={{ backdropFilter: 'blur(4px)' }}
        onClick={closeCart}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white z-50 flex flex-col shadow-modal animate-slide-right">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ink rounded-xl flex items-center justify-center">
              <ShoppingBag size={17} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-ink">Panier</h2>
              <p className="text-xs text-ink-faint">{totalItems} article{totalItems !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors"
          >
            <X size={17} className="text-ink-secondary" />
          </button>
        </div>

        {/* Free shipping progress */}
        {!shippingFree && totalItems > 0 && (
          <div className="px-6 py-3 bg-brand-teal-light border-b border-brand-teal/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Tag size={13} className="text-teal-700" />
              <p className="text-xs font-semibold text-teal-800">
                Plus que <strong>{formatPrice(100 - totalPrice)}</strong> pour la livraison gratuite !
              </p>
            </div>
            <div className="h-1.5 bg-teal-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-teal rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalPrice / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-surface-100 rounded-3xl flex items-center justify-center mb-5">
                <ShoppingBag size={34} className="text-ink-border" />
              </div>
              <h3 className="font-display font-bold text-ink mb-1">Votre panier est vide</h3>
              <p className="text-ink-muted text-sm mb-6">Découvrez nos créations uniques</p>
              <Link to="/products" onClick={closeCart} className="btn-md btn-primary">
                Explorer les produits
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {state.items.map(item => (
                <div
                  key={item.product.id}
                  className="group flex gap-4 p-3.5 bg-surface-50 rounded-2xl border border-ink-border/50 hover:border-ink-border transition-colors"
                >
                  {/* Image */}
                  <div className="w-18 h-18 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0" style={{ width: '4.5rem', height: '4.5rem' }}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=60'; }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-ink text-sm truncate">{item.product.name}</h4>
                    <p className="text-brand-teal font-bold text-sm mt-0.5">{formatPrice(item.product.price)}</p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="flex items-center bg-white border border-ink-border rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-surface-100 transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-ink select-none">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-surface-100 transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-ink ml-1">{formatPrice(item.product.price * item.quantity)}</span>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto p-1.5 text-ink-faint hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="w-full text-xs text-ink-faint hover:text-red-500 transition-colors py-1 text-center"
              >
                Vider le panier
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="px-6 py-5 border-t border-ink-border bg-white">
            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Sous-total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Livraison</span>
                <span className={shippingFree ? 'text-brand-teal font-semibold' : 'text-ink-secondary'}>
                  {shippingFree ? '✓ Gratuite' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-ink pt-2 border-t border-ink-border">
                <span>Total</span>
                <span className="text-lg">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            {/* Promo input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Code promo"
                className="flex-1 input text-xs py-2.5"
              />
              <button className="btn-sm btn-ghost text-xs px-3">Appliquer</button>
            </div>

            <Link
              to="/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-2 py-4 bg-ink text-white font-bold rounded-2xl hover:bg-ink-secondary transition-colors hover:-translate-y-0.5 hover:shadow-button-hover active:translate-y-0"
            >
              Commander maintenant
              <ArrowRight size={17} />
            </Link>

            <p className="text-center text-2xs text-ink-faint mt-3 flex items-center justify-center gap-1.5">
              <span>🔒</span> Paiement 100 % sécurisé
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;

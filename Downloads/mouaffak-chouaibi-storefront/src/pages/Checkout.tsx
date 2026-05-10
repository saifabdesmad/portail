import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, Loader, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { clientsApi, ordersApi } from '../api';

type Step = 'info' | 'confirm' | 'success';

const Checkout: React.FC = () => {
  const { state, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('info');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', notes: '',
  });

  const shippingCost = totalPrice >= 100 ? 0 : 7;
  const orderTotal = totalPrice + shippingCost;

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'info') { setStep('confirm'); return; }

    setLoading(true);
    setError('');
    try {
      // Upsert client
      let clientId: number;
      try {
        const created = await clientsApi.create({ name: form.name, email: form.email, phone: form.phone, address: form.address });
        clientId = created.id;
      } catch (err) {
        // If email already exists, fetch client list and find by email
        const clients = await clientsApi.list();
        const existing = clients.find(c => c.email === form.email);
        if (!existing) throw new Error('Impossible de trouver ou créer le client');
        clientId = existing.id;
      }

      // Create order
      const result = await ordersApi.create({
        client_id:       clientId,
        shipping_amount: shippingCost,
        notes:           form.notes || undefined,
        items: state.items.map(i => ({
          product_id: i.product.id,
          quantity:   i.quantity,
          unit_price: i.product.price,
        })),
      });

      setOrderId(result.id);
      clearCart();
      setStep('success');
    } catch (err) {
      setError((err as Error).message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="text-ink-border mx-auto mb-4" />
          <h2 className="font-bold text-xl text-ink mb-2">Votre panier est vide</h2>
          <button onClick={() => navigate('/products')} className="btn-md btn-primary mt-4">
            Voir les produits
          </button>
        </div>
      </div>
    );
  }

  // Success screen
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-ink-border shadow-card p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h1 className="font-display font-black text-2xl text-ink mb-2">Commande confirmée !</h1>
          <p className="text-ink-muted text-sm mb-1">Numéro de commande</p>
          <p className="font-mono font-bold text-2xl text-brand-teal mb-5">#{orderId}</p>
          <p className="text-ink-secondary text-sm leading-relaxed mb-8">
            Merci <strong>{form.name}</strong> ! Votre commande a bien été enregistrée.
            Vous serez contacté(e) pour confirmer la livraison.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/')} className="btn-md btn-ghost">Accueil</button>
            <button onClick={() => navigate('/products')} className="btn-md btn-primary">Continuer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-10">
      <div className="container-wide max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => step === 'confirm' ? setStep('info') : navigate(-1)}
                  className="p-2 rounded-xl hover:bg-surface-100 transition-colors">
            <ArrowLeft size={20} className="text-ink-secondary" />
          </button>
          <div>
            <h1 className="font-display font-black text-2xl text-ink">Passer la commande</h1>
            <p className="text-ink-muted text-sm">
              {step === 'info' ? 'Étape 1 : Vos informations' : 'Étape 2 : Confirmation'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 'info' && (
              <div className="bg-white rounded-2xl border border-ink-border p-6 space-y-4">
                <h2 className="font-bold text-ink">Informations de livraison</h2>

                {[
                  { name: 'name',    label: 'Nom complet',   type: 'text',  placeholder: 'Ahmed Ben Salah', required: true },
                  { name: 'email',   label: 'Email',          type: 'email', placeholder: 'ahmed@mail.tn',   required: true },
                  { name: 'phone',   label: 'Téléphone',      type: 'tel',   placeholder: '+216 22 000 000', required: false },
                  { name: 'address', label: 'Adresse complète', type: 'text', placeholder: 'Rue, Ville, Gouvernorat', required: true },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-ink-secondary mb-1.5">
                      {f.label} {f.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={(form as Record<string, string>)[f.name]}
                      onChange={handleField}
                      placeholder={f.placeholder}
                      required={f.required}
                      className="w-full input py-3"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-1.5">Notes (optionnel)</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleField}
                    placeholder="Instructions de livraison, personnalisation..."
                    rows={3}
                    className="w-full input py-3 resize-none"
                  />
                </div>
              </div>
            )}

            {step === 'confirm' && (
              <div className="bg-white rounded-2xl border border-ink-border p-6 space-y-4">
                <h2 className="font-bold text-ink">Vérifier et confirmer</h2>
                <div className="p-4 bg-surface-50 rounded-xl text-sm space-y-2">
                  {[
                    { label: 'Nom',       val: form.name    },
                    { label: 'Email',     val: form.email   },
                    { label: 'Téléphone', val: form.phone   },
                    { label: 'Adresse',   val: form.address },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between gap-4">
                      <span className="text-ink-muted">{r.label}</span>
                      <span className="text-ink font-medium text-right">{r.val}</span>
                    </div>
                  ))}
                  {form.notes && (
                    <div className="flex justify-between gap-4">
                      <span className="text-ink-muted">Notes</span>
                      <span className="text-ink font-medium text-right">{form.notes}</span>
                    </div>
                  )}
                </div>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-ink text-white font-bold rounded-2xl hover:bg-ink/80 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader size={18} className="animate-spin" /> : <Lock size={18} />}
              {loading ? 'Traitement en cours…' : step === 'info' ? 'Continuer' : 'Confirmer la commande'}
            </button>
          </form>

          {/* Order summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-ink-border p-5 space-y-3">
              <h3 className="font-bold text-ink">Récapitulatif</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {state.items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-ink-border"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=60'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{item.product.name}</p>
                      <p className="text-xs text-ink-muted">× {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-ink flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-ink-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-ink-muted">
                  <span>Sous-total</span><span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>Livraison</span>
                  <span className={shippingCost === 0 ? 'text-brand-teal font-semibold' : ''}>
                    {shippingCost === 0 ? '✓ Gratuite' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-ink text-base pt-1 border-t border-ink-border">
                  <span>Total</span><span>{formatPrice(orderTotal)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-ink-muted">
              <Lock size={12} /> Paiement sécurisé · WAY3D Tunisia
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

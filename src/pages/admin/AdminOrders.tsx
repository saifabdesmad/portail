import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Eye, X, ChevronDown, ShoppingBag, Loader } from 'lucide-react';
import { ordersApi, type ApiOrder } from '../../api';
import { formatPrice } from '../../utils/format';

type Status = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
const STATUS_OPTIONS: Status[] = ['pending','confirmed','processing','shipped','delivered','cancelled'];

const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  pending:    { label: 'En attente', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)'  },
  confirmed:  { label: 'Confirmée', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)'   },
  processing: { label: 'En cours',  color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)'   },
  shipped:    { label: 'Expédiée',  color: '#06B6D4', bg: 'rgba(6,182,212,0.12)'    },
  delivered:  { label: 'Livrée',   color: '#10B981', bg: 'rgba(16,185,129,0.12)'    },
  cancelled:  { label: 'Annulée',  color: '#EF4444', bg: 'rgba(239,68,68,0.12)'     },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = statusConfig[status as Status] ?? { label: status, color: '#888', bg: 'rgba(136,136,136,0.12)' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
};

const AdminOrders: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orders,       setOrders]       = useState<ApiOrder[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? 'all');
  const [viewOrder,    setViewOrder]    = useState<ApiOrder | null>(null);
  const [editingId,    setEditingId]    = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    ordersApi.list()
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => {
    const matchSearch = o.client_name.toLowerCase().includes(search.toLowerCase()) ||
                        String(o.id).includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: number, status: string) => {
    try {
      await ordersApi.updateStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      if (viewOrder?.id === id) setViewOrder(p => p ? { ...p, status } : null);
    } catch {
      alert('Erreur lors de la mise à jour du statut');
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Commandes</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {orders.length} commandes au total
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Rechercher par client ou n° commande..."
                 className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
                 style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <option value="all">Tous les statuts</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
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
                  {['N°','Client','Date','Articles','Total','Statut','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'rgba(255,255,255,0.3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-semibold" style={{ color: '#F5C842' }}>#{order.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-white">{order.client_name}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{order.client_email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {order.created_at.slice(0, 10)}
                    </td>
                    <td className="px-5 py-3.5 text-white">
                      {order.items?.length ?? 0} article{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white">{formatPrice(order.total_amount)}</td>
                    <td className="px-5 py-3.5">
                      {editingId === order.id ? (
                        <select autoFocus value={order.status}
                                onChange={e => updateStatus(order.id, e.target.value)}
                                onBlur={() => setEditingId(null)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium outline-none text-white"
                                style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.15)' }}>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
                        </select>
                      ) : (
                        <button onClick={() => setEditingId(order.id)}
                                className="flex items-center gap-1.5 hover:opacity-80">
                          <StatusBadge status={order.status} />
                          <ChevronDown size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setViewOrder(order)}
                              className="p-2 rounded-lg hover:bg-white/10"
                              style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <ShoppingBag size={40} className="mb-3 opacity-30" />
                <p>Aucune commande trouvée</p>
              </div>
            )}
          </div>
        )}
      </div>

      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl overflow-hidden"
               style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4"
                 style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <h3 className="font-semibold text-white">
                  Commande <span style={{ color: '#F5C842' }}>#{viewOrder.id}</span>
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{viewOrder.created_at.slice(0, 10)}</p>
              </div>
              <button onClick={() => setViewOrder(null)}
                      className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Client</div>
                {[
                  { label: 'Nom',       val: viewOrder.client_name },
                  { label: 'Email',     val: viewOrder.client_email },
                  { label: 'Téléphone', val: viewOrder.client_phone },
                  { label: 'Adresse',   val: viewOrder.client_address },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm gap-4">
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                    <span className="text-white text-right">{row.val}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Articles</div>
                <div className="space-y-2">
                  {viewOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                         style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                      <div>
                        <div className="text-sm font-medium text-white">{item.product_name}</div>
                        {item.color && <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Couleur: {item.color}</div>}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">{formatPrice(item.unit_price * item.quantity)}</div>
                        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>×{item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {viewOrder.notes && (
                <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(245,200,66,0.08)', color: '#F5C842' }}>
                  Note: {viewOrder.notes}
                </div>
              )}

              <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Statut</div>
                  <StatusBadge status={viewOrder.status} />
                </div>
                <div className="text-right">
                  <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Total</div>
                  <div className="text-lg font-bold text-white">{formatPrice(viewOrder.total_amount)}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Changer le statut :</div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => {
                    const cfg = statusConfig[s];
                    const isActive = viewOrder.status === s;
                    return (
                      <button key={s} onClick={() => updateStatus(viewOrder.id, s)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                              style={{
                                backgroundColor: isActive ? cfg.bg : 'rgba(255,255,255,0.05)',
                                color: isActive ? cfg.color : 'rgba(255,255,255,0.4)',
                                border: `1px solid ${isActive ? cfg.color + '40' : 'transparent'}`,
                              }}>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

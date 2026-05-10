import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingBag, Users, TrendingUp,
  ArrowUpRight, Clock, CheckCircle, Truck, Loader,
  Plus, Settings, Eye,
} from 'lucide-react';
import { statsApi, type ApiStats } from '../../api';
import { formatPrice } from '../../utils/format';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:    { label: 'En attente',  color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  icon: <Clock size={12} /> },
  confirmed:  { label: 'Confirmée',  color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',   icon: <CheckCircle size={12} /> },
  processing: { label: 'En cours',   color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)',   icon: <Clock size={12} /> },
  shipped:    { label: 'Expédiée',   color: '#06B6D4', bg: 'rgba(6,182,212,0.12)',    icon: <Truck size={12} /> },
  delivered:  { label: 'Livrée',     color: '#10B981', bg: 'rgba(16,185,129,0.12)',   icon: <CheckCircle size={12} /> },
  cancelled:  { label: 'Annulée',    color: '#EF4444', bg: 'rgba(239,68,68,0.12)',    icon: <Clock size={12} /> },
};

const StatCard: React.FC<{
  label: string; value: string; sub: string;
  icon: React.ReactNode; color: string;
}> = ({ label, value, sub, icon, color }) => (
  <div className="p-5 rounded-2xl flex flex-col gap-4"
       style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
         style={{ backgroundColor: `${color}18` }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </div>
    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{sub}</div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    statsApi.get()
      .then(setStats)
      .catch(() => setError('Impossible de charger les statistiques'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size={28} className="animate-spin" style={{ color: '#F5C842' }} />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        {error || 'Erreur de chargement'}
      </div>
    );
  }

  const statCards = [
    { label: 'Produits actifs', value: String(stats.products), sub: `${stats.inStock} en stock`,        icon: <Package size={20} />,    color: '#F5C842' },
    { label: 'Commandes',       value: String(stats.orders),   sub: `${stats.pendingOrders} en attente`, icon: <ShoppingBag size={20} />, color: '#06B6D4' },
    { label: 'Clients',         value: String(stats.clients),  sub: 'clients enregistrés',               icon: <Users size={20} />,      color: '#8B5CF6' },
    { label: "Chiffre d'affaires", value: formatPrice(stats.revenue), sub: 'commandes livrées/traitées', icon: <TrendingUp size={20} />, color: '#10B981' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Bienvenue — voici un aperçu de votre activité en temps réel
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Quick management actions ──────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Gestion rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Manage products */}
          <div className="rounded-2xl p-5 group"
               style={{
                 background: 'linear-gradient(135deg, rgba(245,200,66,0.18) 0%, rgba(245,200,66,0.05) 100%)',
                 border: '1px solid rgba(245,200,66,0.25)',
               }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: '#F5C842' }}>
                <Package size={20} className="text-black" />
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md text-white/60"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                {stats.products}
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Gérer les produits</h3>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Ajoutez, modifiez ou retirez des articles du catalogue.
            </p>
            <div className="flex gap-2">
              <Link to="/admin/products"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-black hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#F5C842' }}>
                <Settings size={13} /> Gérer
              </Link>
              <Link to="/admin/products"
                    state={{ openAdd: true }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Plus size={13} /> Nouveau
              </Link>
            </div>
          </div>

          {/* Manage orders */}
          <div className="rounded-2xl p-5"
               style={{
                 background: 'linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(6,182,212,0.05) 100%)',
                 border: '1px solid rgba(6,182,212,0.25)',
               }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: '#06B6D4' }}>
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-mono px-2 py-0.5 rounded-md text-white/60"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  {stats.orders}
                </span>
                {stats.pendingOrders > 0 && (
                  <span className="text-2xs font-bold px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>
                    {stats.pendingOrders} en attente
                  </span>
                )}
              </div>
            </div>
            <h3 className="text-white font-semibold mb-1">Gérer les commandes</h3>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Suivez les statuts et traitez les commandes en cours.
            </p>
            <div className="flex gap-2">
              <Link to="/admin/orders"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#06B6D4' }}>
                <Settings size={13} /> Gérer
              </Link>
              <Link to="/admin/orders?status=pending"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Eye size={13} /> En attente
              </Link>
            </div>
          </div>

          {/* Manage clients */}
          <div className="rounded-2xl p-5"
               style={{
                 background: 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.05) 100%)',
                 border: '1px solid rgba(139,92,246,0.25)',
               }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: '#8B5CF6' }}>
                <Users size={20} className="text-white" />
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md text-white/60"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                {stats.clients}
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Gérer les clients</h3>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Consultez les fiches clients et leur historique.
            </p>
            <Link to="/admin/clients"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity w-full"
                  style={{ backgroundColor: '#8B5CF6' }}>
              <Eye size={13} /> Consulter
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="xl:col-span-2 rounded-2xl overflow-hidden"
             style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between px-6 py-4"
               style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-semibold text-white">Commandes récentes</h2>
            <Link to="/admin/orders" className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: '#F5C842' }}>
              Voir tout <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {stats.recentOrders.map(order => {
              const s = statusConfig[order.status] ?? { label: order.status, color: '#888', bg: 'rgba(136,136,136,0.12)', icon: null };
              return (
                <div key={order.id} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold text-black"
                       style={{ backgroundColor: '#F5C842' }}>
                    #{String(order.id).slice(-2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{order.client_name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {order.created_at.slice(0, 10)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">{formatPrice(order.total_amount)}</div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1"
                          style={{ backgroundColor: s.bg, color: s.color }}>
                      {s.icon} {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
            {stats.recentOrders.length === 0 && (
              <div className="px-6 py-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Aucune commande pour l'instant
              </div>
            )}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="rounded-2xl overflow-hidden"
             style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-semibold text-white">Statuts des commandes</h2>
          </div>
          <div className="p-5 space-y-3">
            {stats.byStatus.map(({ status, cnt }) => {
              const cfg = statusConfig[status] ?? { label: status, color: '#888', bg: 'rgba(136,136,136,0.12)', icon: null };
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                  <span className="text-white font-bold text-sm">{cnt}</span>
                </div>
              );
            })}
            {stats.byStatus.length === 0 && (
              <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucune commande</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

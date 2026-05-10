import React, { useState, useEffect } from 'react';
import { Search, Users, Eye, X, Loader } from 'lucide-react';
import { clientsApi, type ApiClient } from '../../api';
import { formatPrice } from '../../utils/format';

const AdminClients: React.FC = () => {
  const [clients,     setClients]     = useState<ApiClient[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [viewClient,  setViewClient]  = useState<ApiClient | null>(null);

  useEffect(() => {
    clientsApi.list()
      .then(setClients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {clients.length} clients enregistrés
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
               placeholder="Rechercher un client..."
               className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
               style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }} />
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
                  {['Client','Téléphone','Commandes','Total dépensé','Inscrit le','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'rgba(255,255,255,0.3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm text-black"
                             style={{ backgroundColor: '#F5C842' }}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-white">{c.name}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.phone ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: 'rgba(245,200,66,0.1)', color: '#F5C842' }}>
                        {c.order_count} commande{Number(c.order_count) !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white">{formatPrice(c.total_spent)}</td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {c.created_at.slice(0, 10)}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setViewClient(c)}
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
                <Users size={40} className="mb-3 opacity-30" />
                <p>Aucun client trouvé</p>
              </div>
            )}
          </div>
        )}
      </div>

      {viewClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl overflow-hidden"
               style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4"
                 style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-semibold text-white">Détails client</h3>
              <button onClick={() => setViewClient(null)}
                      className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-black"
                     style={{ backgroundColor: '#F5C842' }}>
                  {viewClient.name.charAt(0)}
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{viewClient.name}</div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Inscrit le {viewClient.created_at.slice(0, 10)}
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                {[
                  { label: 'Email',     val: viewClient.email },
                  { label: 'Téléphone', val: viewClient.phone ?? '—' },
                  { label: 'Adresse',   val: viewClient.address ?? '—' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm gap-4">
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                    <span className="text-white text-right">{row.val}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl text-center"
                     style={{ backgroundColor: 'rgba(245,200,66,0.08)', border: '1px solid rgba(245,200,66,0.15)' }}>
                  <div className="text-2xl font-bold" style={{ color: '#F5C842' }}>{viewClient.order_count}</div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Commandes</div>
                </div>
                <div className="p-4 rounded-xl text-center"
                     style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div className="text-lg font-bold" style={{ color: '#10B981' }}>{formatPrice(viewClient.total_spent)}</div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Total dépensé</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClients;

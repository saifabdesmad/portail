import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  LogOut, Menu, X, ChevronRight, Bell,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/admin/products',  icon: Package,          label: 'Produits' },
  { to: '/admin/orders',    icon: ShoppingBag,       label: 'Commandes' },
  { to: '/admin/clients',   icon: Users,             label: 'Clients' },
];

const AdminLayout: React.FC = () => {
  const { admin, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full" style={{ backgroundColor: '#141414', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
             style={{ backgroundColor: '#F5C842' }}>
          <span className="text-black font-black text-base">W</span>
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">WAY3D</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive ? 'text-black' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#F5C842' } : {}}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-black' : 'text-white/40 group-hover:text-white/70'} />
                {label}
                {isActive && <ChevronRight size={14} className="ml-auto text-black/50" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin user */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-black text-sm"
               style={{ backgroundColor: '#F5C842' }}>
            {admin?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">{admin?.name}</div>
            <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{admin?.email}</div>
          </div>
          <button onClick={handleLogout} title="Déconnexion"
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0F0F0F' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-60 lg:shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-60 flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 shrink-0"
                style={{ backgroundColor: '#141414', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F5C842' }} />
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer"
               className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
               style={{ backgroundColor: 'rgba(245,200,66,0.1)', color: '#F5C842', border: '1px solid rgba(245,200,66,0.2)' }}>
              Voir la boutique ↗
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Heart, LogOut, Package, Settings, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const announcements = [
  '✦ Livraison gratuite dès 100 TND ✦',
  '✦ Impression 3D premium made in Tunisia ✦',
  '✦ Personnalisation illimitée sur tous les produits ✦',
];



type NavbarProps = {
  minimal?: boolean;
};


const Navbar: React.FC<NavbarProps> = ( { minimal } ) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const { totalItems, toggleCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const t = setInterval(() => setAnnouncementIdx(i => (i + 1) % announcements.length), 3500);
    return () => clearInterval(t);
  }, []);

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/products', label: 'Produits' },
    { to: '/ai-recommendation', label: 'IA', icon: <Sparkles size={13} /> },
    { to: '/about', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);



  // in case minmal is true (used in auth pages) , we show only the logo without the nav links and actions
  if (minimal) {
    return (
      <nav className="sticky top-0 z-50 bg-white border-b border-ink-border">
        <div className="container-wide h-16 flex items-center">
          <Link to="/" className="flex items-baseline gap-0.5">
            <span className="font-display font-black text-xl text-ink">
              WAY
            </span>
            <span className="text-brand-yellow font-display font-black text-xs pb-0.5">
              3D
            </span>
          </Link>
        </div>
      </nav>
    );
  }
  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-ink text-white text-xs font-medium py-2 text-center overflow-hidden relative">
        <div className="animate-fade-in" key={announcementIdx}>
          {announcements[announcementIdx]}
        </div>
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-nav' : 'bg-surface-50'
      }`}>
        <div className="container-wide">
          <div className="flex items-center h-16 gap-6">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <div className="flex items-baseline gap-0.5">
                <span className="font-display font-black text-xl tracking-tight text-ink group-hover:text-brand-teal transition-colors duration-200">
                  WAY
                </span>
                <span className="text-brand-yellow font-display font-black text-xs leading-none pb-0.5">3D</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5 flex-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                    isActive(link.to)
                      ? 'bg-ink text-white'
                      : 'text-ink-secondary hover:text-ink hover:bg-surface-100'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(s => !s)}
                className={`p-2.5 rounded-full text-ink-secondary hover:text-ink hover:bg-surface-100 transition-all duration-150 ${searchOpen ? 'bg-surface-100 text-ink' : ''}`}
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="hidden sm:flex p-2.5 rounded-full text-ink-secondary hover:text-ink hover:bg-surface-100 transition-all duration-150">
                <Heart size={18} />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-full text-ink-secondary hover:text-ink hover:bg-surface-100 transition-all duration-150"
              >
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-teal text-white text-2xs font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-fade-in">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="relative ml-1">
                  <button
                    onClick={() => setUserMenuOpen(s => !s)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-surface-100 hover:bg-surface-200 transition-colors duration-150"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-ink font-bold text-xs">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-ink hidden sm:block">{user?.name.split(' ')[0]}</span>
                    <ChevronDown size={13} className={`text-ink-muted transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-modal border border-ink-border overflow-hidden animate-fade-up">
                      <div className="px-4 py-3 border-b border-ink-border bg-surface-50">
                        <p className="font-semibold text-ink text-sm">{user?.name}</p>
                        <p className="text-ink-faint text-xs mt-0.5">{user?.email}</p>
                      </div>
                      <div className="p-1.5">
                        {[
                          { to: '/orders', icon: Package, label: 'Mes commandes' },
                          { to: '/profile', icon: Settings, label: 'Paramètres' },
                        ].map(item => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-ink-secondary hover:text-ink hover:bg-surface-50 rounded-xl transition-colors"
                          >
                            <item.icon size={15} className="text-ink-faint" />
                            {item.label}
                          </Link>
                        ))}
                        <div className="my-1 border-t border-ink-border" />
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut size={15} />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Link to="/auth" className="btn-md btn-ghost text-sm inline-flex">
                    <User size={15} />
                    Connexion
                  </Link>
                  <Link to="/auth?tab=signup" className="btn-md btn-primary text-sm inline-flex">
                    Inscription
                  </Link>
                </div>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileOpen(s => !s)}
                className="md:hidden p-2.5 rounded-full text-ink-secondary hover:bg-surface-100 transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Search Expand */}
          {searchOpen && (
            <div className="pb-3 animate-fade-up">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery) {
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                      setSearchOpen(false);
                    }
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                  placeholder="Rechercher un produit…"
                  className="w-full pl-10 pr-24 py-3 bg-surface-100 border border-ink-border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-teal transition-all"
                />
                {searchQuery && (
                  <Link
                    to={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-teal hover:text-brand-teal-dark px-2 py-1 bg-brand-teal-light rounded-lg"
                  >
                    Chercher
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-ink-border bg-white animate-fade-up">
            <div className="container-wide py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-ink text-white'
                      : 'text-ink-secondary hover:bg-surface-50 hover:text-ink'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-3 border-t border-ink-border grid grid-cols-2 gap-2">
                  <Link to="/auth" className="btn-md btn-ghost text-center">Connexion</Link>
                  <Link to="/auth?tab=signup" className="btn-md btn-primary text-center">Inscription</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </>
  );
};

export default Navbar;

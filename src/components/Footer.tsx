import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Check } from 'lucide-react';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/>
  </svg>
);

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  const navCols = [
    {
      title: 'Boutique',
      links: [
        { to: '/products', label: 'Tous les produits' },
        { to: '/products?category=home-decor', label: 'Décoration maison' },
        { to: '/products?category=jewelry', label: 'Bijoux' },
        { to: '/products?category=tech', label: 'Accessoires tech' },
        { to: '/products?category=figurines', label: 'Figurines' },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { to: '/about', label: 'À propos' },
        { to: '/contact', label: 'Contact' },
        { to: '/ai-recommendation', label: 'Recommandations IA' },
        { to: '/', label: 'Blog' },
        { to: '/', label: 'Carrières' },
      ],
    },
    {
      title: 'Support',
      links: [
        { to: '/', label: 'FAQ' },
        { to: '/', label: 'Suivi de commande' },
        { to: '/', label: 'Politique de retour' },
        { to: '/', label: 'CGV' },
        { to: '/', label: 'Mentions légales' },
      ],
    },
  ];

  return (
    <footer className="bg-ink text-white">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="container-wide py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display font-bold text-xl mb-1">Restez dans la boucle</h3>
              <p className="text-white/50 text-sm">Nouveautés, offres exclusives, conseils créatifs — dans votre boîte mail.</p>
            </div>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              {subscribed ? (
                <div className="flex items-center gap-2 px-5 py-3 bg-brand-teal/20 border border-brand-teal/30 rounded-xl text-brand-teal text-sm font-medium w-full">
                  <Check size={16} />Merci pour votre inscription !
                </div>
              ) : (
                <>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                  <button type="submit" className="btn-md btn-primary flex-shrink-0">
                    S'abonner <ArrowRight size={15} />
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-1 mb-5">
              <span className="font-display font-black text-2xl text-white tracking-tight">WAY</span>
              <span className="text-brand-yellow font-display font-black text-sm">3D</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Votre destination pour des produits imprimés en 3D de haute qualité, 
              personnalisés selon vos envies. Artisanat numérique, made in Tunisia.
            </p>

            {/* Social */}
            <div className="flex gap-2 mb-8">
              {[
                { Icon: InstagramIcon, href: '#', label: 'Instagram' },
                { Icon: FacebookIcon,  href: '#', label: 'Facebook' },
                { Icon: TiktokIcon,   href: '#', label: 'TikTok' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/8 hover:bg-brand-yellow hover:text-ink rounded-xl flex items-center justify-center transition-all duration-150 text-white/60"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Icon />
                </a>
              ))}
            </div>

            {/* Contact mini */}
            <div className="space-y-2.5">
              {[
                { icon: MapPin, text: 'Avenue Habib Bourguiba, Tunis' },
                { icon: Phone, text: '+216 50 000 000' },
                { icon: Mail,  text: 'contact@way3d.tn' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-white/40 text-sm">
                  <Icon size={14} className="flex-shrink-0 text-white/25" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navCols.map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-[0.12em] uppercase text-white/40 mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">© 2025 WAY3D · Tous droits réservés</p>
          <div className="flex items-center gap-4">
            {['Visa', 'Mastercard', 'PayPal'].map(m => (
              <span key={m} className="text-2xs font-semibold text-white/20 border border-white/10 px-2 py-1 rounded-md">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

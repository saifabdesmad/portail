import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, Truck, Shield, RefreshCw, Headphones,
  Sparkles, Printer, ChevronRight, Check, Play
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';
import { formatPrice } from '../utils/format';

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const stats = [
  { value: '2 000+', label: 'Clients satisfaits' },
  { value: '500+',   label: 'Modèles disponibles' },
  { value: '48 h',   label: 'Délai moyen' },
  { value: '4.9★',   label: 'Note clients' },
];

const marqueeItems = [
  'Impression 3D haute précision', 'Livraison rapide 24–48h',
  'Personnalisation illimitée', 'Made in Tunisia',
  '100 % satisfaction garantie', 'PLA biodégradable',
];

const testimonials = [
  {
    name: 'Sarra B.', city: 'Tunis', rating: 5, initial: 'S',
    product: 'Plaque prénom',
    text: 'Le résultat est magnifique, la qualité est top et la livraison était ultra-rapide !',
  },
  {
    name: 'Mohamed K.', city: 'Sfax', rating: 5, initial: 'M',
    product: 'Figurine Dragon',
    text: 'Le dragon articulé est incroyable. Tous mes amis veulent savoir où je l\'ai acheté !',
  },
  {
    name: 'Yasmine T.', city: 'Sousse', rating: 5, initial: 'Y',
    product: 'Bague géométrique',
    text: 'Les bijoux sont d\'une finesse exceptionnelle. Exactement comme sur les photos !',
  },
];

const features = [
  { icon: Truck,       title: 'Livraison express',    sub: '24–48 h partout en Tunisie' },
  { icon: Shield,      title: 'Paiement sécurisé',    sub: 'Transactions chiffrées SSL' },
  { icon: RefreshCw,   title: 'Retour 7 jours',       sub: 'Satisfait ou remboursé' },
  { icon: Headphones,  title: 'Support 7j/7',         sub: 'Via WhatsApp & email' },
];

/* ─── Animated counter ───────────────────────────────────────────────────── */
function useInView(ref: React.RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const Home: React.FC = () => {
  const bestSellers  = products.filter(p => p.isBestSeller);
  const newArrivals  = products.filter(p => p.isNew);
  const statsRef     = useRef<HTMLDivElement>(null);
  const statsVisible = useInView(statsRef);

  /* hero image cycle — local BEST SELLERS images */
  const heroImgs = [
    '/Produits/BEST%20SELLERS/2024-02-18_d4f98bcb60c6e.webp',
    '/Produits/BEST%20SELLERS/2025-03-12_20b9e695a89fb.webp',
    '/Produits/BEST%20SELLERS/2c1a9fe049e901a4.webp',
    '/Produits/BEST%20SELLERS/7464f130-1aaf-4d73-a58d-6830d67fcff1.png',
  ];
  const [heroIdx, setHeroIdx] = useState(0);
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startHeroTimer = () => {
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    heroTimerRef.current = setInterval(() => setHeroIdx(i => (i + 1) % heroImgs.length), 5000);
  };
  useEffect(() => { startHeroTimer(); return () => { if (heroTimerRef.current) clearInterval(heroTimerRef.current); }; }, []);

  return (
    <div>
      {/* ──────────────────── HERO ──────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-ink noise-overlay">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-brand-yellow opacity-[0.06] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-brand-teal opacity-[0.08] blur-3xl" />
        </div>

        <div className="container-wide relative z-10 py-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div className="animate-fade-up">
            <div className="label-tag bg-white/10 border-white/15 text-white/80 mb-8 w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse-slow" />
              Impression 3D Premium · Made in Tunisia
            </div>

            <h1 className="heading-display text-white leading-[1.02] mb-6"
                style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
              Votre idée,<br />
              <span className="text-gradient">gravée en 3D.</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed max-w-xl mb-10">
              Créations uniques imprimées sur mesure. Décoration, bijoux, accessoires tech — 
              tout peut être personnalisé et livré en 48 h.
            </p>

            <div className="flex flex-wrap gap-3 mb-14">
              <Link to="/products" className="btn-lg btn-primary group">
                Explorer le catalogue
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/ai-recommendation" className="btn-lg btn-ghost-white">
                <Sparkles size={16} className="text-brand-yellow" />
                Recommandations IA
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {['#F5C842','#4ECDC4','#FF6B6B','#9B59B6'].map((c, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-ink flex items-center justify-center text-xs font-bold text-white"
                       style={{ background: c, zIndex: 4 - i }}>
                    {['S','M','Y','K'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-brand-yellow fill-brand-yellow" />)}
                  <span className="text-white/80 text-sm ml-1.5 font-medium">4.9</span>
                </div>
                <p className="text-white/40 text-xs mt-0.5">+2 000 clients satisfaits</p>
              </div>
            </div>
          </div>

          {/* Right — Image gallery */}
          <div className="relative flex justify-center lg:justify-end animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="relative w-full max-w-[480px]">
              {/* Main image */}
              <div className="relative rounded-4xl overflow-hidden shadow-modal aspect-[4/5]">
                <img
                  key={heroIdx}
                  src={heroImgs[heroIdx]}
                  alt="Produit 3D"
                  className="w-full h-full object-cover animate-fade-in"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=60'; }}
                />
                {/* Color-shift overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                {/* Bottom tag */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <div className="glass rounded-2xl px-4 py-2.5">
                    <p className="text-xs text-ink-muted">Prix dès</p>
                    <p className="font-display font-black text-lg text-ink">{formatPrice(15)}</p>
                  </div>
                  {/* Dot nav */}
                  <div className="flex gap-1.5">
                    {heroImgs.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setHeroIdx(i); startHeroTimer(); }}
                        className={`rounded-full transition-all duration-300 ${i === heroIdx ? 'w-5 h-2 bg-brand-yellow' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating card — top left */}
              <div className="absolute -top-5 -left-5 glass rounded-2xl shadow-card p-3.5 flex items-center gap-3 animate-float">
                <div className="w-9 h-9 bg-brand-yellow rounded-xl flex items-center justify-center flex-shrink-0">
                  <Printer size={18} className="text-ink" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink">Impression 0.1 mm</p>
                  <p className="text-2xs text-ink-muted">Haute précision</p>
                </div>
              </div>

              {/* Floating card — bottom right */}
              <div className="absolute -bottom-4 -right-4 glass rounded-2xl shadow-card p-3.5 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} className="text-brand-yellow fill-brand-yellow" />)}
                </div>
                <p className="text-xs font-semibold text-ink">Best-seller</p>
                <p className="text-2xs text-ink-muted">+500 commandes</p>
              </div>

              {/* Play button for video (decorative) */}
              <div className="absolute top-1/2 -translate-y-1/2 -right-6 w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center shadow-glow-yellow cursor-pointer hover:scale-110 transition-transform">
                <Play size={16} className="text-ink ml-0.5" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-2xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ──────────────── MARQUEE ─────────────────── */}
      <div className="bg-brand-yellow py-3 overflow-hidden border-y border-brand-yellow-dark/20">
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-sm font-semibold text-ink flex items-center gap-2 flex-shrink-0">
              <span className="w-1.5 h-1.5 bg-ink/30 rounded-full" />{item}
            </span>
          ))}
        </div>
      </div>

      {/* ──────────────── STATS ───────────────────── */}
      <section ref={statsRef} className="bg-white border-b border-ink-border">
        <div className="container-wide py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className={`text-center transition-all duration-500 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                 style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="font-display font-black text-3xl md:text-4xl text-ink mb-1">{s.value}</div>
              <div className="text-ink-muted text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────── CATEGORIES ──────────────── */}
      <section className="section bg-surface-50">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="section-line" />
              <h2 className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight">
                Explorer par catégorie
              </h2>
            </div>
            <Link to="/products" className="btn-md btn-ghost text-sm flex-shrink-0 group">
              Tout voir <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {categories.filter(c => c.id !== 'all').map((cat, i) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group flex flex-col items-center gap-3 p-5 bg-white rounded-3xl border border-ink-border hover:border-brand-yellow hover:shadow-card transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                <span className="text-xs font-semibold text-ink-secondary text-center leading-snug">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── BEST SELLERS ────────────── */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="section-line" />
              <h2 className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight">
                Best-sellers
              </h2>
              <p className="text-ink-muted mt-2">Les créations préférées de nos clients</p>
            </div>
            <Link to="/products" className="btn-md btn-ghost text-sm flex-shrink-0 group">
              Tout voir <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {bestSellers.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* ──────────────── CTA SPLIT ───────────────── */}
      <section className="section bg-ink noise-overlay relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-yellow opacity-[0.05] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-teal opacity-[0.07] rounded-full blur-3xl" />
        </div>

        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="eyebrow text-brand-yellow mb-4 block">Personnalisation totale</span>
              <h2 className="heading-display text-white mb-6 leading-tight"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Vous imaginez,<br />
                <span className="text-gradient">nous imprimons.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
                Envoyez-nous votre idée ou utilisez notre IA pour trouver 
                le produit 3D qui vous correspond parfaitement.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  'Prénom, logo, forme — tout est possible',
                  'Choix matière, couleur, finition',
                  'Livraison soignée avec emballage cadeau offert',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                    <div className="w-5 h-5 rounded-full bg-brand-yellow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} className="text-brand-yellow" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link to="/ai-recommendation" className="btn-lg btn-primary group">
                  <Sparkles size={16} />
                  Essayer l'IA
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="btn-lg btn-ghost-white">
                  Nous contacter
                </Link>
              </div>
            </div>

            {/* Right — card grid */}
            <div className="grid grid-cols-2 gap-4">
              {products.filter(p => p.id !== 2).slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className={`rounded-3xl overflow-hidden relative group ${i % 3 === 0 ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                  <div className="aspect-square">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60'; }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-semibold">{p.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── NEW ARRIVALS ────────────── */}
      <section className="section bg-surface-50">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="section-line" />
              <h2 className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight">
                Nouveautés
              </h2>
              <p className="text-ink-muted mt-2">Fraîchement sortis de nos imprimantes</p>
            </div>
            <Link to="/products?sort=newest" className="btn-md btn-ghost text-sm flex-shrink-0 group">
              Tout voir <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {newArrivals.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* ──────────────── HOW IT WORKS ────────────── */}
      <section className="section bg-white">
        <div className="container-tight">
          <div className="text-center mb-16">
            <div className="section-line mx-auto" />
            <h2 className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight mt-4">
              Commander en 3 étapes
            </h2>
            <p className="text-ink-muted mt-3 max-w-md mx-auto">De l'idée à votre porte en moins de 48 heures</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-ink-border" />

            {[
              { n: '01', icon: '🛒', title: 'Choisissez & Personnalisez', desc: 'Parcourez le catalogue, sélectionnez matière, couleur, texte. Chaque détail compte.' },
              { n: '02', icon: '🖨️', title: 'On imprime pour vous',       desc: 'Notre équipe lance l\'impression avec une précision de 0.1 mm sur nos machines pro.' },
              { n: '03', icon: '📦', title: 'Livraison rapide',           desc: 'Emballage soigné et livraison en 24–48 h partout en Tunisie.' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-surface-100 rounded-3xl flex items-center justify-center text-4xl border border-ink-border shadow-card">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-ink text-white text-2xs font-black rounded-full flex items-center justify-center">
                    {step.n}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-ink mb-2">{step.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── TESTIMONIALS ────────────── */}
      <section className="section bg-surface-50">
        <div className="container-wide">
          <div className="text-center mb-14">
            <div className="section-line mx-auto" />
            <h2 className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight mt-4">
              Ce que disent nos clients
            </h2>
            <p className="text-ink-muted mt-3">Des milliers de Tunisiens nous font confiance</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card-hover p-8">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={14} className={s < t.rating ? 'text-brand-yellow fill-brand-yellow' : 'text-ink-border fill-ink-border'} />
                  ))}
                </div>
                <p className="text-ink-secondary text-sm leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-ink-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-ink font-bold text-sm flex-shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{t.name}</p>
                    <p className="text-ink-faint text-xs">{t.city} · {t.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── TRUST BAR ───────────────── */}
      <section className="bg-white border-t border-ink-border">
        <div className="container-wide py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-yellow transition-colors duration-200">
                  <f.icon size={20} className="text-ink-muted group-hover:text-ink transition-colors" />
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm">{f.title}</p>
                  <p className="text-ink-faint text-xs mt-0.5">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

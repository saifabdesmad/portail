import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Printer, Award, Users, Star } from 'lucide-react';

const team = [
  { name: 'Saif Mansouri',  role: 'Fondateur & Designer 3D', bio: 'Passionné d\'impression 3D depuis 2018, Saif a fondé WAY3D avec la vision de rendre la personnalisation accessible à tous en Tunisie.', initial: 'S', grad: 'from-brand-yellow to-amber-400' },
  { name: 'Rania Bouaziz',  role: 'Responsable Production',  bio: 'Ingénieure matériaux, Rania supervise la qualité et l\'optimisation des impressions pour garantir un résultat irréprochable.', initial: 'R', grad: 'from-brand-teal to-teal-500' },
  { name: 'Khalil Jebali',  role: 'Dev & Intégrateur',       bio: 'Expert tech, Khalil assure la robustesse de notre plateforme et intègre les dernières technologies d\'IA.', initial: 'K', grad: 'from-purple-400 to-indigo-400' },
];

const values = [
  { icon: '🎨', title: 'Créativité sans limites',  desc: 'Chaque commande est une toile vierge. Prénom, logo, forme — tout est personnalisable.' },
  { icon: '💎', title: 'Qualité premium',           desc: 'Matériaux certifiés, imprimantes haute précision (0.1 mm), contrôle qualité systématique.' },
  { icon: '🌱', title: 'Éco-responsabilité',        desc: 'PLA biodégradable et processus d\'impression optimisé pour réduire les déchets au minimum.' },
  { icon: '🤝', title: 'Service personnalisé',      desc: 'Chaque client est unique. Nous vous accompagnons de la commande jusqu\'à la livraison.' },
];

const milestones = [
  { year: '2022', label: 'Fondation de WAY3D à Tunis', icon: '🚀' },
  { year: '2023', label: 'Premier catalogue : 100+ modèles', icon: '📦' },
  { year: '2024', label: '1 000+ clients satisfaits', icon: '🎉' },
  { year: '2025', label: 'Lancement de la plateforme IA', icon: '🤖' },
];

const About: React.FC = () => (
  <div className="min-h-screen bg-surface-50">
    {/* Hero */}
    <div className="bg-ink relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-yellow/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-brand-teal/10 rounded-full blur-3xl" />
      <div className="container-wide py-24 relative z-10">
        <span className="eyebrow text-white/40 block mb-4">Notre histoire</span>
        <h1 className="font-display font-black text-ink tracking-tight text-white mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.05 }}>
          Nous donnons vie<br />
          <span className="text-gradient">à vos idées.</span>
        </h1>
        <p className="text-white/50 text-lg max-w-xl mb-8 leading-relaxed">
          WAY3D est né d'une passion simple : transformer l'imaginaire en objet 
          tangible grâce à l'impression 3D. Basés à Tunis, nous livrons partout en Tunisie.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/products" className="btn-lg btn-primary group">
            Voir nos créations <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/contact" className="btn-lg btn-ghost-white">Nous contacter</Link>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="bg-white border-b border-ink-border">
      <div className="container-wide py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { icon: Users,   value: '2 000+', label: 'Clients heureux' },
          { icon: Printer, value: '5 000+', label: 'Produits imprimés' },
          { icon: Star,    value: '4.9/5',  label: 'Note moyenne' },
          { icon: Award,   value: '3 ans',  label: 'D\'expérience' },
        ].map((s, i) => (
          <div key={i}>
            <s.icon size={28} className="text-brand-teal mx-auto mb-2" />
            <div className="font-display font-black text-3xl text-ink">{s.value}</div>
            <div className="text-ink-muted text-sm mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Mission split */}
    <section className="section bg-surface-50">
      <div className="container-wide grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="section-line mb-4" />
          <h2 className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight mb-5">
            Démocratiser la personnalisation 3D en Tunisie
          </h2>
          <p className="text-ink-secondary leading-relaxed mb-4">
            Chez WAY3D, nous croyons que chaque personne mérite d'avoir des objets qui reflètent 
            vraiment sa personnalité. L'impression 3D nous permet de créer des produits uniques, 
            sur mesure, à des prix accessibles.
          </p>
          <p className="text-ink-secondary leading-relaxed mb-8">
            Notre atelier à Tunis est équipé des meilleures imprimantes 3D du marché. 
            Chaque pièce est contrôlée manuellement avant expédition.
          </p>
          <div className="space-y-3">
            {['Précision 0.1 mm', 'Matériaux certifiés', 'Designers expérimentés', 'Contrôle qualité systématique'].map(item => (
              <div key={item} className="flex items-center gap-3 text-ink-secondary text-sm">
                <CheckCircle size={17} className="text-brand-teal flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="rounded-4xl overflow-hidden aspect-square shadow-card-hover">
            <img
              src="https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=700&q=85"
              alt="Atelier impression 3D"
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60'; }}
            />
          </div>
          <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 border border-ink-border">
            <div className="w-10 h-10 bg-brand-yellow/20 rounded-xl flex items-center justify-center">
              <Award size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-ink text-sm">Certifié qualité</p>
              <p className="text-xs text-ink-faint">Contrôle 100 % des pièces</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section bg-white">
      <div className="container-wide">
        <div className="text-center mb-14">
          <div className="section-line mx-auto mb-4" />
          <h2 className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight">Nos valeurs</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <div key={i} className="card-hover p-8 text-center">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-display font-bold text-ink mb-2">{v.title}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="section bg-surface-50">
      <div className="container-tight">
        <div className="text-center mb-14">
          <div className="section-line mx-auto mb-4" />
          <h2 className="font-display font-black text-3xl text-ink tracking-tight">Notre parcours</h2>
        </div>
        <div className="relative pl-8">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-ink-border" />
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="absolute left-0 w-8 h-8 bg-white border-2 border-brand-yellow rounded-full flex items-center justify-center text-base shadow-sm" style={{ marginTop: '2px' }}>
                  {m.icon}
                </div>
                <div className="pt-0.5">
                  <span className="text-brand-teal font-bold text-sm">{m.year}</span>
                  <p className="font-semibold text-ink mt-0.5">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="section bg-white">
      <div className="container-wide">
        <div className="text-center mb-14">
          <div className="section-line mx-auto mb-4" />
          <h2 className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight">L'équipe</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <div key={i} className="card-hover p-8 text-center">
              <div className={`w-20 h-20 bg-gradient-to-br ${m.grad} rounded-3xl flex items-center justify-center text-3xl font-black text-white mx-auto mb-5 shadow-card`}>
                {m.initial}
              </div>
              <h3 className="font-display font-bold text-xl text-ink mb-0.5">{m.name}</h3>
              <p className="text-brand-teal font-semibold text-sm mb-4">{m.role}</p>
              <p className="text-ink-muted text-sm leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section bg-ink noise-overlay relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/6 rounded-full blur-3xl" />
      </div>
      <div className="container-tight text-center relative z-10">
        <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-5 tracking-tight">
          Prêt à créer quelque chose<br />
          <span className="text-gradient">d'unique ?</span>
        </h2>
        <p className="text-white/50 text-lg mb-8">Rejoignez nos milliers de clients satisfaits.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/products" className="btn-lg btn-primary group">
            Explorer les produits <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/ai-recommendation" className="btn-lg btn-ghost-white">
            Recommandations IA ✨
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default About;

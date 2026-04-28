import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader, RefreshCw, ShoppingCart, ChevronRight, Bot, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/products';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: Product[];
}

const suggestedPrompts = [
  'Décoration pour mon salon',
  'Cadeau original pour mon ami',
  'Bijoux personnalisés',
  'Accessoire pour bureau moderne',
  'Figurine pour un enfant',
  'Budget inférieur à 30 TND',
];

const getAIResponse = (query: string): { text: string; recs: Product[] } => {
  const q = query.toLowerCase();
  let recs: Product[] = [];
  let text = '';

  if (q.includes('salon') || q.includes('décor') || q.includes('maison') || q.includes('intérieur')) {
    recs = products.filter(p => p.category === 'home-decor');
    text = `🏠 **Pour votre intérieur**\n\nVoici nos meilleures créations déco. Toutes sont personnalisables en couleur et taille selon votre espace.`;
  } else if (q.includes('cadeau') || q.includes('ami') || q.includes('offrir')) {
    recs = products.filter(p => p.isBestSeller && p.inStock).slice(0, 4);
    text = `🎁 **Cadeaux qui marquent**\n\nNos sélections les plus offertes. Soigneusement emballées pour l'occasion.\n\n💡 Le porte-clés prénom est notre bestseller cadeau !`;
  } else if (q.includes('bijou') || q.includes('bague') || q.includes('collier')) {
    recs = products.filter(p => p.category === 'jewelry');
    text = `💎 **Collection bijoux**\n\nImprimés en résine UV haute précision, nos bijoux offrent un rendu luxueux à prix accessible. Disponibles en plusieurs finitions.`;
  } else if (q.includes('tech') || q.includes('bureau') || q.includes('organis')) {
    recs = products.filter(p => p.category === 'tech' || p.category === 'organizers');
    text = `💻 **Accessoires & Organisation**\n\nFonctionnels et stylés. Parfaits pour un espace de travail moderne et bien rangé.`;
  } else if (q.includes('enfant') || q.includes('figurine') || q.includes('dragon')) {
    recs = products.filter(p => p.category === 'figurines');
    text = `🐉 **Figurines 3D articulées**\n\nFabriquées sans petites pièces détachables, certifiées non-toxiques. Le dragon est notre bestseller absolu !`;
  } else if (q.includes('budget') || q.includes('30') || q.includes('pas cher') || q.includes('moins')) {
    recs = products.filter(p => p.price < 35).sort((a, b) => a.price - b.price);
    text = `💰 **Petits prix, grande qualité**\n\nToute la précision WAY3D à partir de ${formatPrice(15)}. Parfaits pour découvrir notre univers.`;
  } else if (q.includes('personnalis') || q.includes('prénom') || q.includes('sur mesure')) {
    recs = products.filter(p => p.category === 'custom' || p.tags.includes('personnalisé'));
    text = `⭐ **Personnalisation totale**\n\nPrénom, date, photo, forme — tout est possible. Chaque pièce est unique et ne sera jamais reproduite à l'identique.`;
  } else {
    recs = products.filter(p => p.isBestSeller || p.isNew).slice(0, 4);
    text = `✨ **Nos coups de cœur du moment**\n\nUn mix de best-sellers et nouveautés pour vous inspirer. Dites-moi plus précisément ce que vous cherchez pour affiner les suggestions !`;
  }

  return { text, recs: recs.slice(0, 4) };
};

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: `👋 **Bonjour ! Je suis l'assistant IA de WAY3D.**\n\nJe suis là pour vous aider à trouver le produit 3D parfait selon vos envies, votre budget ou l'occasion.\n\n**Essayez :**\n- "Un cadeau pour mon ami"\n- "Décoration pour mon salon"\n- "Budget inférieur à 30 TND"\n\nComment puis-je vous aider ?`,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages(m => [...m, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 700));
    const { text: resp, recs } = getAIResponse(text);
    setMessages(m => [...m, { role: 'assistant', content: resp, recommendations: recs }]);
    setLoading(false);
  };

  const reset = () => setMessages([{
    role: 'assistant',
    content: `✨ **Nouvelle conversation démarrée.**\n\nComment puis-je vous aider à trouver votre produit 3D idéal ?`,
  }]);

  const renderText = (txt: string) =>
    txt.split('\n').map((line, i) => (
      <p key={i} className={line === '' ? 'mt-2' : 'leading-relaxed'}
         dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
    ));

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <div className="bg-ink border-b border-white/10">
        <div className="container-wide py-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-brand rounded-2xl flex items-center justify-center shadow-glow-yellow flex-shrink-0">
            <Sparkles size={22} className="text-ink" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl text-white">Assistant IA · WAY3D</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
              <span className="text-xs text-green-400 font-medium">En ligne · Répond instantanément</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container-wide py-6 flex flex-col gap-5">
        {/* Chat */}
        <div className="flex-1 bg-white rounded-3xl border border-ink-border shadow-card overflow-hidden flex flex-col" style={{ minHeight: '520px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant' ? 'bg-gradient-brand' : 'bg-ink'
                }`}>
                  {msg.role === 'assistant'
                    ? <Bot size={17} className="text-ink" />
                    : <User size={17} className="text-white" />}
                </div>

                <div className={`flex-1 max-w-[75%] space-y-3 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-ink text-white rounded-tr-sm'
                      : 'bg-surface-50 text-ink-secondary border border-ink-border rounded-tl-sm'
                  }`}>
                    <div className="space-y-0.5">{renderText(msg.content)}</div>
                  </div>

                  {/* Recommendations */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {msg.recommendations.map(p => (
                        <div key={p.id} className="bg-white border border-ink-border rounded-2xl overflow-hidden hover:border-brand-yellow hover:shadow-card transition-all duration-200">
                          <div className="aspect-video overflow-hidden bg-surface-100">
                            <img src={p.images[0]} alt={p.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60'; }} />
                          </div>
                          <div className="p-3">
                            <p className="font-semibold text-ink text-xs truncate mb-0.5">{p.name}</p>
                            <p className="text-brand-teal font-bold text-xs">{formatPrice(p.price)}</p>
                            <div className="flex gap-1.5 mt-2.5">
                              <Link to={`/products/${p.id}`} className="flex-1 text-center py-1.5 text-xs font-medium bg-surface-50 border border-ink-border hover:bg-surface-100 rounded-lg transition-colors flex items-center justify-center gap-0.5">
                                Voir <ChevronRight size={10} />
                              </Link>
                              <button
                                onClick={() => addItem(p)}
                                disabled={!p.inStock}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold bg-brand-yellow hover:bg-brand-yellow-dark text-ink rounded-lg transition-colors disabled:bg-surface-100 disabled:text-ink-faint"
                              >
                                <ShoppingCart size={11} />
                                {p.inStock ? 'Ajouter' : 'Épuisé'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
                  <Bot size={17} className="text-ink" />
                </div>
                <div className="bg-surface-50 border border-ink-border rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-2">
                  <Loader size={14} className="animate-spin text-brand-teal" />
                  <span className="text-sm text-ink-muted">Analyse en cours…</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && !loading && (
            <div className="px-6 pb-4">
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-3">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map(p => (
                  <button key={p} onClick={() => send(p)}
                    className="text-xs px-3.5 py-2 bg-surface-50 border border-ink-border hover:border-brand-yellow hover:bg-brand-yellow-light text-ink-secondary hover:text-ink rounded-full transition-all duration-150 font-medium">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-ink-border p-4">
            <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Décrivez ce que vous cherchez…"
                disabled={loading}
                className="flex-1 input py-3 disabled:opacity-50"
              />
              <button type="button" onClick={reset}
                className="w-11 h-11 flex items-center justify-center bg-surface-100 hover:bg-surface-200 rounded-xl transition-colors text-ink-muted hover:text-ink flex-shrink-0" title="Nouvelle conversation">
                <RefreshCw size={16} />
              </button>
              <button type="submit" disabled={!input.trim() || loading}
                className="btn-md btn-dark px-5 flex-shrink-0 disabled:opacity-40">
                <Send size={15} />
                <span className="hidden sm:inline">Envoyer</span>
              </button>
            </form>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: '🎯', title: 'Recommandations ciblées', desc: 'Analyse vos besoins pour proposer le produit idéal' },
            { icon: '⚡', title: 'Réponse instantanée',    desc: 'Suggestions en moins d\'une seconde' },
            { icon: '🛒', title: 'Achat direct',           desc: 'Ajoutez au panier directement depuis le chat' },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-2xl border border-ink-border p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{c.icon}</div>
              <div>
                <p className="font-semibold text-ink text-sm">{c.title}</p>
                <p className="text-ink-faint text-xs mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

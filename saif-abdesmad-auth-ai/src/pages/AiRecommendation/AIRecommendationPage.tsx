import React from "react";
import { Sparkles } from "lucide-react";
import ChatBot from "./ChatBot";

const AiRecommendationPage: React.FC = () => {
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
        <ChatBot />

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: '🎯', title: 'Recommandations ciblées', desc: 'Analyse vos besoins pour proposer le produit idéal' },
            { icon: '⚡', title: 'Réponse instantanée',     desc: 'Suggestions en moins d\'une seconde' },
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
}

export default AiRecommendationPage;
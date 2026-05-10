import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, RefreshCw, Bot } from 'lucide-react';

import MessageComponent, { type ChatMessage } from '../../components/MessageComponent';

import { getAIResponseMock ,getAIResponseMistral} from './service/getAIResponse';


const suggestedPrompts = [
  'Décoration pour mon salon',
  'Cadeau original pour mon ami',
  'Bijoux personnalisés',
  'Accessoire pour bureau moderne',
  'Figurine pour un enfant',
  'Budget inférieur à 30 TND',
];



const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: `👋 **Bonjour ! Je suis l'assistant IA de WAY3D.**\n\nJe suis là pour vous aider à trouver le produit 3D parfait selon vos envies, votre budget ou l'occasion.\n\n**Essayez :**\n- "Un cadeau pour mon ami"\n- "Décoration pour mon salon"\n- "Budget inférieur à 30 TND"\n\nComment puis-je vous aider ?`,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    setMessages(m => [...m, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const { text: resp, recs } = await getAIResponseMistral(text);
      setMessages(m => [
        ...m,
        { role: 'assistant', content: resp, recommendations: recs }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(m => [
        ...m,
        { role: 'assistant', content: "Désolé, une erreur est survenue. Réessayez dans un instant." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setMessages([{
    role: 'assistant',
    content: `✨ **Nouvelle conversation démarrée.**\n\nComment puis-je vous aider à trouver votre produit 3D idéal ?`,
  }]);


  return (
    <div className="flex-1 mx-40 my-24 bg-white rounded-3xl border border-ink-border shadow-card overflow-hidden flex flex-col" style={{ minHeight: '520px' }}>
      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((msg, i) => (
          <MessageComponent key={i} message={msg} />
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
  );
};

export default ChatBot;

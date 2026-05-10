

import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, User, ShoppingCart, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: Product[];
}

export type ChatMessage = Message;

const MessageComponent: React.FC<{ message: Message }> = ({ message }) => {
  const { addItem } = useCart();

  const renderText = (text: string) =>
    text.split('\n').map((line, index) => (
      <p
        key={index}
        className={line === '' ? 'mt-2' : 'leading-relaxed'}
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
      />
    ));

  return (
    <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        message.role === 'assistant' ? 'bg-gradient-brand' : 'bg-ink'
      }`}>
        {message.role === 'assistant'
          ? <Bot size={17} className="text-ink" />
          : <User size={17} className="text-white" />}
      </div>

      <div className={`flex-1 max-w-[75%] space-y-3 ${message.role === 'user' ? 'items-end flex flex-col' : ''}`}>
        <div className={`rounded-2xl px-4 py-3.5 text-sm ${
          message.role === 'user'
            ? 'bg-ink text-white rounded-tr-sm'
            : 'bg-surface-50 text-ink-secondary border border-ink-border rounded-tl-sm'
        }`}>
          <div className="space-y-0.5">{renderText(message.content)}</div>
        </div>

        {message.recommendations && message.recommendations.length > 0 && (
          <div className="grid grid-cols-2 gap-3 w-full">
            {message.recommendations.map(product => (
              <div key={product.id} className="bg-white border border-ink-border rounded-2xl overflow-hidden hover:border-brand-yellow hover:shadow-card transition-all duration-200">
                <div className="aspect-video overflow-hidden bg-surface-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={event => {
                      (event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60';
                    }}
                  />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-ink text-xs truncate mb-0.5">{product.name}</p>
                  <p className="text-brand-teal font-bold text-xs">{formatPrice(product.price)}</p>
                  <div className="flex gap-1.5 mt-2.5">
                    <Link
                      to={`/products/${product.id}`}
                      className="flex-1 text-center py-1.5 text-xs font-medium bg-surface-50 border border-ink-border hover:bg-surface-100 rounded-lg transition-colors flex items-center justify-center gap-0.5"
                    >
                      Voir <ChevronRight size={10} />
                    </Link>
                    <button
                      onClick={() => addItem(product)}
                      disabled={!product.inStock}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold bg-brand-yellow hover:bg-brand-yellow-dark text-ink rounded-lg transition-colors disabled:bg-surface-100 disabled:text-ink-faint"
                    >
                      <ShoppingCart size={11} />
                      {product.inStock ? 'Ajouter' : 'Épuisé'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
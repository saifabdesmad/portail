import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => (
  <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center text-center px-4">
    <div className="text-7xl mb-6 animate-float">🖨️</div>
    <p className="eyebrow mb-3">Erreur 404</p>
    <h1 className="font-display font-black text-4xl md:text-5xl text-ink tracking-tight mb-4">Page introuvable</h1>
    <p className="text-ink-muted max-w-sm mb-8 text-lg">
      Cette page n'a pas encore été imprimée en 3D... Retournez à l'accueil !
    </p>
    <Link to="/" className="btn-lg btn-primary">
      <ArrowLeft size={18} /> Retour à l'accueil
    </Link>
  </div>
);

export default NotFound;

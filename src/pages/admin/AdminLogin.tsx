import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const AdminLogin: React.FC = () => {
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 600)); // subtle loading feel

    const success = adminLogin(email, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Email ou mot de passe incorrect.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F0F0F' }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
           style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ backgroundColor: '#F5C842' }}>
            <span className="text-black font-black text-lg">W</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">WAY3D</span>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
               style={{ backgroundColor: 'rgba(245,200,66,0.12)', border: '1px solid rgba(245,200,66,0.25)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F5C842' }}></div>
            <span className="text-xs font-medium" style={{ color: '#F5C842' }}>Panneau Administrateur</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Gérez votre boutique<br />
            <span style={{ color: '#F5C842' }}>en toute simplicité</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Accédez aux produits, commandes et statistiques de votre boutique 3D depuis un seul tableau de bord.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Produits', value: '16+' },
            { label: 'Commandes', value: '124' },
            { label: 'Clients', value: '89' },
          ].map(stat => (
            <div key={stat.label} className="p-4 rounded-2xl"
                 style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ backgroundColor: '#F5C842' }}>
              <span className="text-black font-black text-lg">W</span>
            </div>
            <span className="text-white font-bold text-xl">WAY3D Admin</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Connexion Admin</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Accès réservé aux administrateurs</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@way3d.tn"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F5C842')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F5C842')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                   style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-black transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: loading ? 'rgba(245,200,66,0.5)' : '#F5C842',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Connexion...
                </>
              ) : 'Se connecter'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Accès non autorisé — réservé à l'équipe WAY3D
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

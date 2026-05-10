import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal: React.FC = () => {
  const { isModalOpen, modalTab, closeModal, setModalTab, login, register } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginForm,    setLoginForm]    = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirm: '' });

  if (!isModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!loginForm.email || !loginForm.password) return setError('Veuillez remplir tous les champs.');
    setLoading(true);
    const ok = await login(loginForm.email, loginForm.password);
    setLoading(false);
    if (!ok) setError('Email ou mot de passe incorrect.');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!registerForm.name || !registerForm.email || !registerForm.password) return setError('Veuillez remplir tous les champs.');
    if (registerForm.password !== registerForm.confirm) return setError('Les mots de passe ne correspondent pas.');
    if (registerForm.password.length < 6) return setError('Mot de passe : 6 caractères minimum.');
    setLoading(true);
    const ok = await register(registerForm.name, registerForm.email, registerForm.password);
    setLoading(false);
    if (!ok) setError('Une erreur est survenue.');
  };

  const perks = ['Suivi de commandes en temps réel', 'Offres exclusives membres', 'Historique & refaire une commande'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(15,15,15,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && closeModal()}
    >
      <div
        className="w-full max-w-[860px] bg-white rounded-4xl overflow-hidden shadow-modal animate-fade-up flex flex-col md:flex-row"
        style={{ maxHeight: '90vh' }}
      >
        {/* ── Left panel ── */}
        <div className="relative hidden md:flex flex-col justify-between bg-ink p-10 w-[340px] flex-shrink-0 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-brand-yellow/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-teal/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-baseline gap-1 mb-10">
              <span className="font-display font-black text-2xl text-white tracking-tight">WAY</span>
              <span className="text-brand-yellow font-display font-black text-sm">3D</span>
            </div>

            <h2 className="font-display font-black text-3xl text-white leading-tight mb-4">
              {modalTab === 'login' ? 'Bon retour\nparmi nous !' : 'Rejoignez\nla communauté'}
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              {modalTab === 'login'
                ? 'Connectez-vous pour accéder à vos commandes et vos avantages membres.'
                : 'Créez votre compte gratuit et profitez d\'une expérience d\'achat personnalisée.'}
            </p>

            <div className="space-y-3">
              {perks.map(p => (
                <div key={p} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-yellow/20 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-brand-yellow" />
                  </div>
                  <span className="text-white/70 text-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <p className="text-white/30 text-xs">© 2025 WAY3D · Made in Tunisia</p>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-8 pb-0">
            <div className="flex md:hidden items-baseline gap-1">
              <span className="font-display font-black text-lg text-ink">WAY</span>
              <span className="text-brand-yellow font-display font-black text-xs">3D</span>
            </div>
            <div className="hidden md:block" />
            <button
              onClick={closeModal}
              className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors"
            >
              <X size={17} className="text-ink-secondary" />
            </button>
          </div>

          <div className="px-8 py-6">
            {/* Tab switcher */}
            <div className="flex p-1 bg-surface-100 rounded-xl mb-7">
              {(['login', 'register'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { setModalTab(tab); setError(''); }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 ${
                    modalTab === tab ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink-secondary'
                  }`}
                >
                  {tab === 'login' ? 'Connexion' : 'Inscription'}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <X size={14} className="flex-shrink-0" />{error}
              </div>
            )}

            {/* Login Form */}
            {modalTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                    <input type="email" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="votre@email.com" className="input pl-10" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">Mot de passe</label>
                    <a href="#" className="text-xs text-brand-teal hover:text-brand-teal-dark font-medium">Oublié ?</a>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                    <input type={showPwd ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••" className="input pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full btn-lg btn-primary mt-2 disabled:opacity-50">
                  {loading ? <Loader size={18} className="animate-spin" /> : <><span>Se connecter</span><ArrowRight size={16} /></>}
                </button>
                <p className="text-center text-xs text-ink-faint pt-2">
                  Pas encore de compte ?{' '}
                  <button type="button" onClick={() => setModalTab('register')} className="text-brand-teal font-semibold hover:underline">
                    Créer un compte
                  </button>
                </p>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5 block">Nom complet</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                    <input type="text" value={registerForm.name} onChange={e => setRegisterForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Prénom Nom" className="input pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                    <input type="email" value={registerForm.email} onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="votre@email.com" className="input pl-10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5 block">Mot de passe</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                      <input type={showPwd ? 'text' : 'password'} value={registerForm.password} onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="••••••••" className="input pl-10 pr-8" />
                      <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint">
                        {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5 block">Confirmer</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                      <input type="password" value={registerForm.confirm} onChange={e => setRegisterForm(f => ({ ...f, confirm: e.target.value }))}
                        placeholder="••••••••" className="input pl-10" />
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full btn-lg btn-teal mt-2 disabled:opacity-50">
                  {loading ? <Loader size={18} className="animate-spin" /> : <><span>Créer mon compte</span><ArrowRight size={16} /></>}
                </button>
                <p className="text-center text-xs text-ink-faint pt-1">
                  En créant un compte, vous acceptez nos{' '}
                  <a href="#" className="text-brand-teal font-medium hover:underline">CGU</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

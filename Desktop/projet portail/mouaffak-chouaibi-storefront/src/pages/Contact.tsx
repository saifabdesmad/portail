import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader, ArrowRight } from 'lucide-react';

const subjects = ['Question sur un produit', 'Commande personnalisée', 'Suivi de commande', 'Problème', 'Partenariat B2B', 'Autre'];

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Champ requis';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (form.message.trim().length < 10) e.message = 'Au moins 10 caractères';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false); setSent(true);
  };

  if (sent) return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-brand-teal-light rounded-3xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-brand-teal" />
        </div>
        <h2 className="font-display font-black text-3xl text-ink mb-3">Message envoyé !</h2>
        <p className="text-ink-muted mb-8">Merci <strong>{form.name}</strong>. Nous vous répondrons sous 24 h.</p>
        <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="btn-md btn-primary">
          Envoyer un autre message
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-ink-border">
        <div className="container-wide py-14">
          <span className="eyebrow mb-3 block">Contact</span>
          <h1 className="font-display font-black text-4xl md:text-5xl text-ink tracking-tight mb-3">
            Parlons de votre projet
          </h1>
          <p className="text-ink-muted text-lg max-w-xl">
            Une question, une idée, une commande sur mesure ? Notre équipe répond en moins de 24 h.
          </p>
        </div>
      </div>

      <div className="container-wide py-14">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="space-y-4">
            {[
              { icon: MapPin, title: 'Adresse', lines: ['Avenue Habib Bourguiba', 'Tunis 1000, Tunisie'] },
              { icon: Phone,  title: 'Téléphone', lines: ['+216 50 000 000'], href: 'tel:+21650000000' },
              { icon: Mail,   title: 'Email', lines: ['contact@way3d.tn'], href: 'mailto:contact@way3d.tn' },
              { icon: Clock,  title: 'Horaires', lines: ['Lun – Sam : 9h – 18h', 'Dimanche : Fermé'] },
            ].map((info, i) => (
              <div key={i} className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <info.icon size={18} className="text-brand-teal" />
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm mb-1">{info.title}</p>
                  {info.lines.map((line, j) => (
                    info.href && j === 0
                      ? <a key={j} href={info.href} className="text-ink-muted text-sm hover:text-brand-teal transition-colors block">{line}</a>
                      : <p key={j} className="text-ink-muted text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <a
              href="https://wa.me/21650000000"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-2xl transition-colors shadow-button hover:shadow-button-hover hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-8 shadow-card">
              <h2 className="font-display font-bold text-2xl text-ink mb-7">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5 block">Nom <span className="text-red-400">*</span></label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Votre nom" className={`input ${errors.name ? 'input-error' : ''}`} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5 block">Email <span className="text-red-400">*</span></label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="votre@email.com" className={`input ${errors.email ? 'input-error' : ''}`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5 block">Téléphone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+216 XX XXX XXX" className="input" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5 block">Sujet</label>
                    <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input">
                      <option value="">Choisir…</option>
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5 block">Message <span className="text-red-400">*</span></label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Décrivez votre demande…" rows={5}
                    className={`input resize-none ${errors.message ? 'input-error' : ''}`} />
                  <div className="flex justify-between mt-1">
                    {errors.message ? <p className="text-red-500 text-xs">{errors.message}</p> : <span />}
                    <span className="text-xs text-ink-faint">{form.message.length} car.</span>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full btn-lg btn-dark disabled:opacity-50 mt-1">
                  {loading ? <Loader size={18} className="animate-spin" /> : <><Send size={17} />Envoyer le message</>}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-10 bg-white rounded-3xl border border-ink-border h-60 flex items-center justify-center overflow-hidden shadow-card">
          <div className="text-center">
            <MapPin size={36} className="text-brand-teal mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-ink mb-1">Tunis, Tunisie</h3>
            <a href="https://maps.google.com/?q=Tunis" target="_blank" rel="noopener noreferrer"
              className="text-sm text-brand-teal hover:underline font-medium">
              Ouvrir dans Google Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

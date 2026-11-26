import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { supabase, ContactMessage } from '../lib/supabase';
import { useSiteSettings, telHref, whatsappHref } from '../lib/siteSettings';

const emptyForm: ContactMessage = { name: '', email: '', phone: '', message: '' };

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none transition-all';

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactMessage>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [honeypot, setHoneypot] = useState('');
  const { contact } = useSiteSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Champ invisible rempli = robot : on simule un succès sans rien enregistrer.
    if (honeypot) {
      setSubmitStatus('success');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const payload: ContactMessage = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || undefined,
      message: formData.message.trim(),
    };

    const { error } = await supabase.from('contact_messages').insert([payload]);
    setIsSubmitting(false);

    if (error) {
      console.error('Erreur envoi message:', error);
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('success');
    setFormData(emptyForm);
    window.setTimeout(() => setSubmitStatus('idle'), 6000);
  };

  const update = (field: keyof ContactMessage) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const contactInfo = [
    { icon: Phone, title: 'Téléphone', value: contact.phone, link: telHref(contact.phone), external: false },
    { icon: Mail, title: 'Email', value: contact.email, link: `mailto:${contact.email}`, external: false },
    {
      icon: MapPin,
      title: 'Adresse',
      value: contact.address,
      link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`,
      external: true,
    },
    { icon: Clock, title: 'Horaires', value: contact.hours, link: null, external: false },
  ];

  return (
    <section id="contact" className="py-24 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Besoin d'une intervention rapide ? Nos techniciens sont disponibles 7j/7 sur toute la Corse-du-Sud.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact</h3>
              <div className="space-y-2">
                {contactInfo.map((info) => {
                  const IconComponent = info.icon;
                  const content = (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#27ae60]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="text-[#27ae60]" size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 mb-1">{info.title}</p>
                        <p className="text-gray-600 break-words">{info.value}</p>
                      </div>
                    </div>
                  );

                  return info.link ? (
                    <a
                      key={info.title}
                      href={info.link}
                      {...(info.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="block hover:bg-gray-50 p-4 rounded-xl transition-colors"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={info.title} className="p-4">
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#27ae60] to-[#1e8449] rounded-2xl p-6 sm:p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Intervention rapide</h3>
              <p className="mb-6 text-white/90">
                Pour une urgence, appelez-nous directement ou contactez-nous via WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={telHref(contact.phone)}
                  className="flex items-center justify-center gap-2 bg-white text-[#27ae60] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Phone size={20} />
                  Appeler maintenant
                </a>
                <a
                  href={whatsappHref(contact.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors border border-white/30"
                >
                  <MessageCircle size={20} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Demander un devis</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contact-name" className="block text-gray-700 font-medium mb-2">
                  Nom complet *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  maxLength={120}
                  autoComplete="name"
                  value={formData.name}
                  onChange={update('name')}
                  className={inputClass}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-email" className="block text-gray-700 font-medium mb-2">
                    Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    value={formData.email}
                    onChange={update('email')}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-gray-700 font-medium mb-2">
                    Téléphone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    maxLength={30}
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={update('phone')}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-gray-700 font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  maxLength={5000}
                  placeholder="Type de nuisible, lieu d'intervention, urgence…"
                  value={formData.message}
                  onChange={update('message')}
                  className={`${inputClass} resize-y min-h-[8rem]`}
                ></textarea>
              </div>

              {/* Anti-spam : champ invisible pour les humains */}
              <div className="hidden" aria-hidden="true">
                <label>
                  Site web
                  <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </label>
              </div>

              <div aria-live="polite">
                {submitStatus === 'success' && (
                  <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 animate-[slideIn_0.5s_ease-out]">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-[scaleIn_0.6s_ease-out]">
                        <CheckCircle2 className="text-white" size={28} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-green-900 mb-1">Demande envoyée avec succès !</h4>
                        <p className="text-green-800">
                          Merci pour votre demande. Notre équipe vous contactera dans les plus brefs délais.
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 animate-[shrink_6s_linear_forwards]"></div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl animate-[shake_0.5s_ease-in-out]">
                    <p className="font-semibold">Une erreur est survenue. Veuillez réessayer ou nous appeler au {contact.phone}.</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#27ae60] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#229954] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { supabase, ContactMessage } from '../lib/supabase';

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [contactSettings, setContactSettings] = useState({
    phone: '04 95 XX XX XX',
    email: 'contact@insectelim.fr',
    address: 'Porto-Vecchio, Corse-du-Sud',
    hours: 'Lundi - Samedi : 8h - 19h',
  });

  useEffect(() => {
    loadContactSettings();
  }, []);

  const loadContactSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'contact_info')
      .maybeSingle();

    if (data?.value) {
      setContactSettings(data.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const { error } = await supabase.from('contact_messages').insert([formData]);

    if (error) {
      setSubmitStatus('error');
      setIsSubmitting(false);
    } else {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsSubmitting(false);

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      value: contactSettings.phone,
      link: `tel:${contactSettings.phone.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      title: 'Email',
      value: contactSettings.email,
      link: `mailto:${contactSettings.email}`,
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: contactSettings.address,
      link: `https://www.google.com/maps/search/${encodeURIComponent(contactSettings.address)}`,
    },
    {
      icon: Clock,
      title: 'Horaires',
      value: contactSettings.hours,
      link: null,
    },
  ];

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Besoin d'une intervention rapide ? Nos techniciens sont disponibles 7j/7 dans toute la Corse-du-Sud.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informations de contact
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  const content = (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#27ae60]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="text-[#27ae60]" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          {info.title}
                        </p>
                        <p className="text-gray-600">{info.value}</p>
                      </div>
                    </div>
                  );

                  return info.link ? (
                    <a
                      key={index}
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:bg-gray-50 p-4 rounded-xl transition-colors"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={index} className="p-4">
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#27ae60] to-[#1e8449] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Intervention rapide</h3>
              <p className="mb-6 text-white/90">
                Pour une urgence, appelez-nous directement ou contactez-nous via WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${contactSettings.phone.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2 bg-white text-[#27ae60] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Phone size={20} />
                  Appeler maintenant
                </a>
                <a
                  href={`https://wa.me/${contactSettings.phone.replace(/\s/g, '').replace(/^0/, '33')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors border border-white/30"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Demander un devis
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 animate-[slideIn_0.5s_ease-out]">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-[scaleIn_0.6s_ease-out]">
                        <CheckCircle2 className="text-white" size={28} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-green-900 mb-1">
                        Demande envoyée avec succès !
                      </h4>
                      <p className="text-green-800">
                        Merci pour votre demande. Notre équipe vous contactera dans les plus brefs délais.
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 animate-[shrink_5s_linear]"></div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl animate-[shake_0.5s_ease-in-out]">
                  <p className="font-semibold">Une erreur est survenue. Veuillez réessayer.</p>
                </div>
              )}

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

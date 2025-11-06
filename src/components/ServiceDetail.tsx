import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Euro, Phone, Mail, Bug, Bird, ShieldCheck, Home, LucideIcon } from 'lucide-react';
import { supabase, Service } from '../lib/supabase';

const iconMap: Record<string, LucideIcon> = {
  bug: Bug,
  bird: Bird,
  'shield-check': ShieldCheck,
  home: Home,
  rat: Bug,
};

const imageMap: Record<string, string> = {
  bug: 'https://images.pexels.com/photos/3714898/pexels-photo-3714898.jpeg?auto=compress&cs=tinysrgb&w=1200',
  bird: 'https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'shield-check': 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=1200',
  home: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
  rat: 'https://images.pexels.com/photos/2324028/pexels-photo-2324028.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

interface ServiceDetailProps {
  slug: string;
  onBack: () => void;
}

export default function ServiceDetail({ slug, onBack }: ServiceDetailProps) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState({ phone: '', email: '' });

  useEffect(() => {
    loadService();
    loadContactInfo();
    window.scrollTo(0, 0);
  }, [slug]);

  const loadService = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle();

    if (data && !error) {
      setService(data);
    }
    setLoading(false);
  };

  const loadContactInfo = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'contact_info')
      .maybeSingle();

    if (data?.value) {
      setContactInfo({
        phone: data.value.phone || '04 95 XX XX XX',
        email: data.value.email || 'contact@insectelim.fr',
      });
    }
  };

  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-4xl font-bold text-gray-900 mb-6 mt-8">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-3xl font-bold text-gray-900 mb-4 mt-8">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-2xl font-bold text-gray-900 mb-3 mt-6">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <p key={key++} className="text-lg font-bold text-gray-900 mb-2 mt-4">
            {line.replaceAll('**', '')}
          </p>
        );
      } else if (line.startsWith('- ')) {
        const items = [line];
        while (i + 1 < lines.length && lines[i + 1].startsWith('- ')) {
          items.push(lines[++i]);
        }
        elements.push(
          <ul key={key++} className="list-disc list-inside space-y-2 mb-4 ml-4">
            {items.map((item, idx) => (
              <li key={idx} className="text-gray-700 leading-relaxed">
                {item.substring(2)}
              </li>
            ))}
          </ul>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={key++} className="h-2"></div>);
      } else if (line.trim().length > 0) {
        const processedLine = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        elements.push(
          <p
            key={key++}
            className="text-gray-700 leading-relaxed mb-4 text-lg"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      }
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Service non trouvé
          </h2>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#27ae60] font-semibold hover:underline"
          >
            <ArrowLeft size={20} />
            Retour aux services
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[service.icon] || Bug;
  const serviceImage = service.image_url || imageMap[service.icon] || imageMap.bug;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 overflow-hidden">
        <img
          src={serviceImage}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-gray-50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Retour aux services
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <IconComponent className="text-[#27ae60]" size={32} />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {service.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <div className="prose prose-lg max-w-none">
                {service.detailed_content && renderMarkdownContent(service.detailed_content)}
              </div>
            </article>

            {service.features && service.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Nos Prestations
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                    >
                      <Check className="text-[#27ae60] flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {service.pricing_info && (
                <div className="bg-gradient-to-br from-[#27ae60] to-[#1e8449] rounded-2xl shadow-xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <Euro size={32} />
                    <h3 className="text-2xl font-bold">Tarifs</h3>
                  </div>

                  {service.pricing_info.starting_price && (
                    <div className="mb-6">
                      <div className="text-4xl font-bold mb-2">
                        {service.pricing_info.starting_price}
                      </div>
                      {service.pricing_info.price_range && (
                        <div className="text-white/80 text-sm">
                          Fourchette: {service.pricing_info.price_range}
                        </div>
                      )}
                    </div>
                  )}

                  {service.pricing_info.note && (
                    <p className="text-white/90 text-sm mb-6 pb-6 border-b border-white/20">
                      {service.pricing_info.note}
                    </p>
                  )}

                  {service.pricing_info.free_quote && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                      <p className="text-sm font-medium">
                        Devis gratuit et sans engagement
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      onBack();
                      setTimeout(() => {
                        document.getElementById('contact')?.scrollIntoView({
                          behavior: 'smooth',
                        });
                      }, 100);
                    }}
                    className="w-full bg-white text-[#27ae60] px-6 py-4 rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Demander un devis
                  </button>
                </div>
              )}

              {service.benefits && service.benefits.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Nos Avantages
                  </h3>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="text-[#27ae60] flex-shrink-0 mt-1" size={18} />
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Contact Direct</h3>
                <div className="space-y-4">
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <Phone size={20} />
                    <div>
                      <div className="text-xs text-white/70">Téléphone</div>
                      <div className="font-semibold">{contactInfo.phone}</div>
                    </div>
                  </a>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <Mail size={20} />
                    <div>
                      <div className="text-xs text-white/70">Email</div>
                      <div className="font-semibold text-sm">{contactInfo.email}</div>
                    </div>
                  </a>
                </div>
                <p className="text-white/70 text-xs mt-4">
                  Intervention rapide sur Porto-Vecchio et toute la Corse-du-Sud
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Euro, Phone, Mail } from 'lucide-react';
import { supabase, Service } from '../lib/supabase';
import { getServiceIcon, getServiceImage } from '../lib/serviceAssets';
import { useSiteSettings, telHref } from '../lib/siteSettings';
import { handleLinkClick } from '../lib/router';
import { Markdown } from '../lib/markdown';
import { usePageMeta } from '../lib/seo';

interface ServiceDetailProps {
  slug: string;
}

export default function ServiceDetail({ slug }: ServiceDetailProps) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const { contact } = useSiteSettings();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    window.scrollTo(0, 0);
    supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('Erreur chargement service:', error);
        setService(data ?? null);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  usePageMeta(service?.title, service?.description);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 animate-pulse" aria-busy="true">
        <div className="h-96 bg-gray-300" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-white rounded-2xl" />
          <div className="h-72 bg-white rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service non trouvé</h1>
          <a
            href="/#services"
            onClick={handleLinkClick}
            className="inline-flex items-center gap-2 text-[#27ae60] font-semibold hover:underline"
          >
            <ArrowLeft size={20} />
            Retour aux services
          </a>
        </div>
      </div>
    );
  }

  const IconComponent = getServiceIcon(service.icon);
  const pricing = service.pricing_info;
  const hasPricing = !!(pricing && (pricing.starting_price || pricing.price_range || pricing.note || pricing.free_quote));

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="relative min-h-[24rem] flex items-center overflow-hidden bg-gray-800">
        <img
          src={getServiceImage(service.icon, service.image_url, 1600)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <a
            href="/#services"
            onClick={handleLinkClick}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour aux services
          </a>
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <IconComponent className="text-[#27ae60]" size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{service.title}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">{service.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {service.detailed_content && (
              <article className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12">
                <Markdown content={service.detailed_content} />
              </article>
            )}

            {service.features && service.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos Prestations</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <Check className="text-[#27ae60] flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="bg-gradient-to-br from-[#27ae60] to-[#1e8449] rounded-2xl shadow-xl p-6 sm:p-8 text-white">
                {hasPricing && (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <Euro size={32} />
                      <h2 className="text-2xl font-bold">Tarifs</h2>
                    </div>

                    {pricing?.starting_price && (
                      <div className="mb-6">
                        <div className="text-3xl sm:text-4xl font-bold mb-2">{pricing.starting_price}</div>
                        {pricing.price_range && (
                          <div className="text-white/80 text-sm">Fourchette : {pricing.price_range}</div>
                        )}
                      </div>
                    )}

                    {pricing?.note && (
                      <p className="text-white/90 text-sm mb-6 pb-6 border-b border-white/20">{pricing.note}</p>
                    )}

                    {pricing?.free_quote && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                        <p className="text-sm font-medium">Devis gratuit et sans engagement</p>
                      </div>
                    )}
                  </>
                )}
                {!hasPricing && (
                  <>
                    <h2 className="text-2xl font-bold mb-3">Besoin d'une intervention ?</h2>
                    <p className="text-white/90 text-sm mb-6">Devis gratuit et sans engagement.</p>
                  </>
                )}

                <a
                  href="/#contact"
                  onClick={handleLinkClick}
                  className="block text-center w-full bg-white text-[#27ae60] px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  Demander un devis
                </a>
              </div>

              {service.benefits && service.benefits.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Nos Avantages</h2>
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
                <h2 className="text-xl font-bold mb-4">Contact Direct</h2>
                <div className="space-y-4">
                  <a
                    href={telHref(contact.phone)}
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <Phone size={20} className="flex-shrink-0" />
                    <div>
                      <div className="text-xs text-white/70">Téléphone</div>
                      <div className="font-semibold">{contact.phone}</div>
                    </div>
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <Mail size={20} className="flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-white/70">Email</div>
                      <div className="font-semibold text-sm break-all">{contact.email}</div>
                    </div>
                  </a>
                </div>
                <p className="text-white/70 text-xs mt-4">
                  Intervention rapide sur Porto-Vecchio et toute la Corse-du-Sud
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

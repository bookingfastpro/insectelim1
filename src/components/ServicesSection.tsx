import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase, Service } from '../lib/supabase';
import { getServiceIcon, getServiceImage } from '../lib/serviceAssets';
import { handleLinkClick } from '../lib/router';

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('services')
      .select('id, title, description, icon, image_url, slug, order')
      .eq('active', true)
      .order('order')
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Erreur chargement services:', error);
          setStatus('error');
          return;
        }
        setServices((data ?? []) as Service[]);
        setStatus('ready');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="services" className="py-24 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Des solutions professionnelles pour tous vos besoins en lutte anti-nuisibles
          </p>
        </div>

        {status === 'loading' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {status === 'error' && (
          <p className="text-center text-gray-500 py-12">
            Impossible de charger les services pour le moment. Contactez-nous directement pour un devis.
          </p>
        )}

        {status === 'ready' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = getServiceIcon(service.icon);
              const href = service.slug ? `/services/${service.slug}` : '/#contact';
              return (
                <a
                  key={service.id}
                  href={href}
                  onClick={handleLinkClick}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 opacity-0 animate-[fadeUp_0.6s_ease-out_forwards] focus-visible:ring-4 focus-visible:ring-[#27ae60]/40 outline-none"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                      src={getServiceImage(service.icon, service.image_url, 600)}
                      alt={service.title}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <IconComponent className="text-[#27ae60]" size={24} />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6 flex-1">{service.description}</p>
                    <span className="inline-flex items-center gap-1 text-[#27ae60] font-semibold transition-all group-hover:gap-2">
                      {service.slug ? 'En savoir plus' : 'Demander un devis'}
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="/#contact"
            onClick={handleLinkClick}
            className="inline-flex items-center gap-2 bg-[#27ae60] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#229954] transition-all hover:scale-105"
          >
            Obtenir un devis personnalisé
          </a>
        </div>
      </div>
    </section>
  );
}

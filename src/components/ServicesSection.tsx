import { useEffect, useState } from 'react';
import { Bug, Bird, ShieldCheck, Home, LucideIcon } from 'lucide-react';
import { supabase, Service } from '../lib/supabase';

const iconMap: Record<string, LucideIcon> = {
  bug: Bug,
  bird: Bird,
  'shield-check': ShieldCheck,
  home: Home,
  rat: Bug,
};

const imageMap: Record<string, string> = {
  bug: 'https://images.pexels.com/photos/3714898/pexels-photo-3714898.jpeg?auto=compress&cs=tinysrgb&w=600',
  bird: 'https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg?auto=compress&cs=tinysrgb&w=600',
  'shield-check': 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=600',
  home: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600',
  rat: 'https://images.pexels.com/photos/2324028/pexels-photo-2324028.jpeg?auto=compress&cs=tinysrgb&w=600',
};

interface ServicesSectionProps {
  onServiceClick?: (slug: string) => void;
}

export default function ServicesSection({ onServiceClick }: ServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('order');

    if (data && !error) {
      setServices(data);
      setVisibleCards(new Array(data.length).fill(false));

      data.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => {
            const newVisible = [...prev];
            newVisible[index] = true;
            return newVisible;
          });
        }, index * 150);
      });
    }
  };

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des solutions professionnelles pour tous vos besoins en lutte anti-nuisibles
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Bug;
            const serviceImage = service.image_url || imageMap[service.icon] || imageMap.bug;
            return (
              <div
                key={service.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  visibleCards[index]
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={serviceImage}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <IconComponent className="text-[#27ae60]" size={24} />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <button
                    onClick={() => service.slug && onServiceClick?.(service.slug)}
                    className="inline-flex items-center text-[#27ae60] font-semibold hover:underline transition-all hover:gap-2"
                  >
                    En savoir plus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#27ae60] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#229954] transition-all hover:scale-105"
          >
            Obtenir un devis personnalisé
          </a>
        </div>
      </div>
    </section>
  );
}

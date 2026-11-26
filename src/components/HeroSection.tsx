import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSiteSettings } from '../lib/siteSettings';
import { handleLinkClick } from '../lib/router';

const FALLBACK_LOGO =
  'https://supabase.insectelim.fr/storage/v1/object/public/images/4aqxxpck45u-1762795628761.jpg';

const benefits = [
  'Interventions rapides partout en Corse-du-Sud',
  "Produits respectueux de l'environnement",
  'Techniciens certifiés et agréés',
  'Service professionnel et discret',
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { hero, loaded } = useSiteSettings();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const logoUrl = hero.logo_url || FALLBACK_LOGO;

  return (
    <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#27ae60] via-[#229954] to-[#1e8449]" aria-hidden="true">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`text-white transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              INSECTELIM
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-light mb-4">
              Techniciens experts en lutte anti-nuisibles à Porto-Vecchio
            </p>
            <p className="text-lg sm:text-xl mb-8 text-white/90">
              Protégez votre maison et votre entreprise avec des traitements efficaces, écologiques et certifiés.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="/#contact"
                onClick={handleLinkClick}
                className="group inline-flex items-center justify-center gap-2 bg-white text-[#27ae60] px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-50 transition-all hover:scale-105"
              >
                Demandez un devis gratuit
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/#services"
                onClick={handleLinkClick}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all border border-white/30"
              >
                Découvrir nos services
              </a>
            </div>

            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li
                  key={benefit}
                  className={`flex items-start gap-3 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                >
                  <CheckCircle2 className="text-white flex-shrink-0 mt-0.5" size={24} />
                  <span className="text-base sm:text-lg text-white/95">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`hidden lg:block transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="relative max-w-lg mx-auto">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl rotate-3"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/10 shadow-2xl border border-white/10">
                  {loaded && (
                    <img
                      src={logoUrl}
                      alt="Logo INSECTELIM"
                      width={640}
                      height={640}
                      {...{ fetchpriority: 'high' }}
                      decoding="async"
                      onLoad={() => setImageLoaded(true)}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" aria-hidden="true"></div>
    </section>
  );
}

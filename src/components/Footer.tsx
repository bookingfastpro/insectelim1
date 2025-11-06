import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const [contactSettings, setContactSettings] = useState({
    phone: '04 95 XX XX XX',
    email: 'contact@insectelim.fr',
    address: 'Porto-Vecchio, Corse-du-Sud',
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
      setContactSettings({
        phone: data.value.phone,
        email: data.value.email,
        address: data.value.address,
      });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-[#27ae60] mb-4">INSECTELIM</h3>
            <p className="text-gray-400 leading-relaxed">
              Votre expert en lutte anti-nuisibles à Porto-Vecchio. Solutions professionnelles, écologiques et certifiées.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="#accueil" className="text-gray-400 hover:text-[#27ae60] transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-[#27ae60] transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#blog" className="text-gray-400 hover:text-[#27ae60] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-[#27ae60] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={18} className="text-[#27ae60]" />
                <a href={`tel:${contactSettings.phone.replace(/\s/g, '')}`} className="hover:text-[#27ae60] transition-colors">
                  {contactSettings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={18} className="text-[#27ae60]" />
                <a href={`mailto:${contactSettings.email}`} className="hover:text-[#27ae60] transition-colors">
                  {contactSettings.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} className="text-[#27ae60]" />
                <span>{contactSettings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} INSECTELIM. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

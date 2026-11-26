import { Phone, Mail, MapPin } from 'lucide-react';
import { useSiteSettings, telHref } from '../lib/siteSettings';
import { handleLinkClick } from '../lib/router';

const links = [
  { name: 'Accueil', href: '/#accueil' },
  { name: 'Services', href: '/#services' },
  { name: 'Blog', href: '/#blog' },
  { name: 'Contact', href: '/#contact' },
];

export default function Footer() {
  const { contact } = useSiteSettings();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold text-[#27ae60] mb-4">INSECTELIM</h3>
            <p className="text-gray-400 leading-relaxed">
              Votre expert en lutte anti-nuisibles à Porto-Vecchio. Solutions professionnelles, écologiques et certifiées.
            </p>
          </div>

          <nav aria-label="Liens rapides">
            <h4 className="font-semibold text-lg mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <a href={link.href} onClick={handleLinkClick} className="text-gray-400 hover:text-[#27ae60] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={18} className="text-[#27ae60] flex-shrink-0" />
                <a href={telHref(contact.phone)} className="hover:text-[#27ae60] transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={18} className="text-[#27ae60] flex-shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-[#27ae60] transition-colors break-all">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} className="text-[#27ae60] flex-shrink-0" />
                <span>{contact.address}</span>
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

import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSiteSettings, telHref } from '../lib/siteSettings';
import { handleLinkClick } from '../lib/router';

const navLinks = [
  { name: 'Accueil', href: '/#accueil' },
  { name: 'Services', href: '/#services' },
  { name: 'Blog', href: '/#blog' },
  { name: 'Contact', href: '/#contact' },
];

interface NavbarProps {
  /** Force un fond blanc (pages intérieures sans héro vert). */
  solid?: boolean;
}

export default function Navbar({ solid = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { contact } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMobileMenuOpen(false);
    const onResize = () => window.innerWidth >= 768 && setIsMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [isMobileMenuOpen]);

  const isLight = solid || isScrolled || isMobileMenuOpen;

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsMobileMenuOpen(false);
    handleLinkClick(e);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isLight ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      aria-label="Navigation principale"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a
            href="/#accueil"
            onClick={onNavClick}
            className={`text-2xl font-bold tracking-tight transition-colors ${
              isLight ? 'text-[#27ae60]' : 'text-white'
            }`}
          >
            INSECTELIM
          </a>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={onNavClick}
                className={`font-medium transition-colors ${
                  isLight ? 'text-gray-700 hover:text-[#27ae60]' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href={telHref(contact.phone)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-colors ${
                isLight
                  ? 'bg-[#27ae60] text-white hover:bg-[#229954]'
                  : 'bg-white text-[#27ae60] hover:bg-gray-100'
              }`}
            >
              <Phone size={18} />
              <span>Appeler</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className={`md:hidden p-2 -mr-2 rounded-lg ${isLight ? 'text-gray-700' : 'text-white'}`}
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={onNavClick}
                className="block text-gray-700 font-medium hover:text-[#27ae60] hover:bg-gray-50 rounded-lg transition-colors px-3 py-3"
              >
                {link.name}
              </a>
            ))}
            <a
              href={telHref(contact.phone)}
              className="mt-3 flex items-center justify-center gap-2 bg-[#27ae60] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#229954] transition-colors"
            >
              <Phone size={18} />
              <span>Appeler le {contact.phone}</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

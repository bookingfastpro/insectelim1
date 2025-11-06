import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('04 95 XX XX XX');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    loadContactSettings();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadContactSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'contact_info')
      .maybeSingle();

    if (data?.value?.phone) {
      setPhoneNumber(data.value.phone);
    }
  };

  const navLinks = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'Services', href: '#services' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <span
              className={`text-2xl font-bold transition-colors ${
                isScrolled ? 'text-[#27ae60]' : 'text-white'
              }`}
            >
              INSECTELIM
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors hover:text-[#27ae60] ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="flex items-center gap-2 bg-[#27ae60] text-white px-6 py-2 rounded-full hover:bg-[#229954] transition-colors"
            >
              <Phone size={18} />
              <span>Appeler</span>
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isScrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-700 font-medium hover:text-[#27ae60] transition-colors py-2"
              >
                {link.name}
              </a>
            ))}
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-2 bg-[#27ae60] text-white px-6 py-3 rounded-full hover:bg-[#229954] transition-colors"
            >
              <Phone size={18} />
              <span>Appeler</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

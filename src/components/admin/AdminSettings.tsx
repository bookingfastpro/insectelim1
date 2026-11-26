import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { withDefaults } from '../../lib/siteSettings';
import ImageUploader from '../ImageUploader';

const EMPTY_CONTACT = { phone: '', email: '', address: '', hours: '' };
const EMPTY_HERO = { title: '', subtitle: '', logo_url: '' };

export default function AdminSettings() {
  const [contactInfo, setContactInfo] = useState(EMPTY_CONTACT);
  const [heroSection, setHeroSection] = useState(EMPTY_HERO);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['contact_info', 'hero_section']);

    if (error) {
      setErrorMessage(`Impossible de charger les paramètres : ${error.message}`);
      setSaveStatus('error');
      return;
    }

    for (const setting of data ?? []) {
      // withDefaults garantit que tous les champs existent (évite les inputs non contrôlés)
      if (setting.key === 'contact_info') setContactInfo(withDefaults(EMPTY_CONTACT, setting.value));
      if (setting.key === 'hero_section') setHeroSection(withDefaults(EMPTY_HERO, setting.value));
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setErrorMessage('');

    const now = new Date().toISOString();
    // upsert : crée la ligne si elle n'existe pas encore (update seul ne ferait rien)
    const { error } = await supabase.from('site_settings').upsert(
      [
        { key: 'contact_info', value: contactInfo, updated_at: now },
        { key: 'hero_section', value: heroSection, updated_at: now },
      ],
      { onConflict: 'key' }
    );

    if (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrorMessage(`Erreur lors de la sauvegarde : ${error.message}`);
      setSaveStatus('error');
      return;
    }

    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Paramètres du site</h2>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 bg-[#27ae60] text-white px-6 py-2 rounded-lg hover:bg-[#229954] transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          {saveStatus === 'saving' ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      {saveStatus === 'error' && errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6">{errorMessage}</div>
      )}

      {saveStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6">
          Paramètres enregistrés avec succès !
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Section héro</h3>
          <p className="text-sm text-gray-500 -mt-2 mb-4">
            Le logo s'affiche à droite de la page d'accueil (écrans larges). Le titre et le sous-titre sont enregistrés
            mais le texte d'accueil du site est actuellement fixe.
          </p>
          <div className="space-y-4">
            <ImageUploader
              currentImageUrl={heroSection.logo_url}
              onImageUploaded={(url) => setHeroSection({ ...heroSection, logo_url: url })}
              label="Logo"
            />
            <div>
              <label className="block text-gray-700 font-medium mb-2">Titre principal</label>
              <input
                type="text"
                value={heroSection.title}
                onChange={(e) => setHeroSection({ ...heroSection, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Sous-titre</label>
              <textarea
                rows={3}
                value={heroSection.subtitle}
                onChange={(e) => setHeroSection({ ...heroSection, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Informations de contact</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Téléphone</label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Adresse</label>
              <input
                type="text"
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Horaires</label>
              <input
                type="text"
                value={contactInfo.hours}
                onChange={(e) => setContactInfo({ ...contactInfo, hours: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

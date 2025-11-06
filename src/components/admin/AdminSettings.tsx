import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase, SiteSetting } from '../../lib/supabase';

export default function AdminSettings() {
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
    hours: '',
  });
  const [heroSection, setHeroSection] = useState({
    title: '',
    subtitle: '',
    logo_url: '',
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .in('key', ['contact_info', 'hero_section']);

    if (data) {
      data.forEach((setting: SiteSetting) => {
        if (setting.key === 'contact_info') {
          setContactInfo(setting.value);
        } else if (setting.key === 'hero_section') {
          setHeroSection(setting.value);
        }
      });
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');

    await supabase
      .from('site_settings')
      .update({ value: contactInfo, updated_at: new Date().toISOString() })
      .eq('key', 'contact_info');

    await supabase
      .from('site_settings')
      .update({ value: heroSection, updated_at: new Date().toISOString() })
      .eq('key', 'hero_section');

    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
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

      {saveStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6">
          Paramètres enregistrés avec succès !
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Section héro</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">URL du logo</label>
              <input
                type="text"
                value={heroSection.logo_url}
                onChange={(e) => setHeroSection({ ...heroSection, logo_url: e.target.value })}
                placeholder="https://example.com/logo.png ou /image.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Collez l'URL complète de l'image ou utilisez /image.png pour l'image locale
              </p>
              {heroSection.logo_url && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Aperçu du logo :</p>
                  <img
                    src={heroSection.logo_url}
                    alt="Logo preview"
                    className="h-32 w-full object-contain rounded-lg border border-gray-200 bg-white"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const errorMsg = target.nextElementSibling as HTMLElement;
                      if (errorMsg) errorMsg.style.display = 'block';
                    }}
                  />
                  <div className="text-red-600 text-sm mt-2" style={{ display: 'none' }}>
                    Impossible de charger l'image. Vérifiez l'URL.
                  </div>
                </div>
              )}
            </div>
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

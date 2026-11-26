import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, MoveUp, MoveDown, FileText, ExternalLink } from 'lucide-react';
import { supabase, Service } from '../../lib/supabase';
import ImageUploader from '../ImageUploader';
import { slugify } from '../../lib/seo';

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'bug',
    image_url: '',
    order: 0,
    active: true,
  });
  const [detailFormData, setDetailFormData] = useState({
    slug: '',
    detailed_content: '',
    starting_price: '',
    price_range: '',
    pricing_note: '',
    free_quote: true,
    features: '',
    benefits: '',
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order');

    if (error) console.error('Erreur chargement services:', error);
    if (data) setServices(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    let error;
    if (editingService) {
      ({ error } = await supabase
        .from('services')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingService.id));
    } else {
      // Nouveau service : placé en dernier, avec un slug pour que la page détail fonctionne
      const baseSlug = slugify(formData.title) || 'service';
      const taken = new Set(services.map((s) => s.slug));
      let slug = baseSlug;
      for (let n = 2; taken.has(slug); n++) slug = `${baseSlug}-${n}`;
      const maxOrder = services.reduce((max, s) => Math.max(max, s.order ?? 0), -1);
      ({ error } = await supabase.from('services').insert([{ ...formData, order: maxOrder + 1, slug }]));
    }

    setSaving(false);
    if (error) {
      setFormError(`Erreur lors de l'enregistrement : ${error.message}`);
      return;
    }

    resetForm();
    loadServices();
  };

  const handleDetailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingService) return;

    const features = detailFormData.features
      .split('\n')
      .filter((f) => f.trim())
      .map((f) => f.trim());

    const benefits = detailFormData.benefits
      .split('\n')
      .filter((b) => b.trim())
      .map((b) => b.trim());

    const pricing_info = {
      starting_price: detailFormData.starting_price,
      price_range: detailFormData.price_range,
      note: detailFormData.pricing_note,
      free_quote: detailFormData.free_quote,
    };

    setSaving(true);
    setFormError('');
    const { error } = await supabase
      .from('services')
      .update({
        slug: slugify(detailFormData.slug),
        detailed_content: detailFormData.detailed_content,
        pricing_info: pricing_info,
        features: features,
        benefits: benefits,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingService.id);

    setSaving(false);
    if (error) {
      setFormError(
        error.code === '23505'
          ? 'Ce slug est déjà utilisé par un autre service.'
          : `Erreur lors de l'enregistrement : ${error.message}`
      );
      return;
    }

    resetDetailForm();
    loadServices();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) alert(`Erreur lors de la suppression : ${error.message}`);
      loadServices();
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      image_url: service.image_url || '',
      order: service.order,
      active: service.active,
    });
    setFormError('');
    setShowForm(true);
    setShowDetailForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditDetail = (service: Service) => {
    setEditingService(service);
    setDetailFormData({
      slug: service.slug || '',
      detailed_content: service.detailed_content || '',
      starting_price: service.pricing_info?.starting_price || '',
      price_range: service.pricing_info?.price_range || '',
      pricing_note: service.pricing_info?.note || '',
      free_quote: service.pricing_info?.free_quote ?? true,
      features: Array.isArray(service.features) ? service.features.join('\n') : '',
      benefits: Array.isArray(service.benefits) ? service.benefits.join('\n') : '',
    });
    setFormError('');
    setShowDetailForm(true);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const moveService = async (id: string, direction: 'up' | 'down') => {
    const index = services.findIndex((s) => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newServices = [...services];
    [newServices[index], newServices[newIndex]] = [newServices[newIndex], newServices[index]];

    // Affichage immédiat, puis mise à jour en parallèle des seules lignes modifiées
    setServices(newServices.map((s, i) => ({ ...s, order: i })));
    const changed = newServices.filter((s, i) => s.order !== i);
    const results = await Promise.all(
      changed.map((s) =>
        supabase.from('services').update({ order: newServices.indexOf(s) }).eq('id', s.id)
      )
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) alert(`Erreur lors du réordonnancement : ${failed.error.message}`);

    loadServices();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'bug',
      image_url: '',
      order: services.length,
      active: true,
    });
    setEditingService(null);
    setFormError('');
    setShowForm(false);
  };

  const resetDetailForm = () => {
    setDetailFormData({
      slug: '',
      detailed_content: '',
      starting_price: '',
      price_range: '',
      pricing_note: '',
      free_quote: true,
      features: '',
      benefits: '',
    });
    setEditingService(null);
    setFormError('');
    setShowDetailForm(false);
  };

  const iconOptions = [
    { value: 'bug', label: 'Insecte' },
    { value: 'rat', label: 'Rat' },
    { value: 'bird', label: 'Oiseau' },
    { value: 'shield-check', label: 'Bouclier' },
    { value: 'home', label: 'Maison' },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des services</h2>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              resetDetailForm();
              setShowForm(true);
            }
          }}
          className="flex items-center gap-2 bg-[#27ae60] text-white px-4 py-2 rounded-lg hover:bg-[#229954] transition-colors"
        >
          <Plus size={20} />
          Nouveau service
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingService ? 'Modifier le service' : 'Nouveau service'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Titre</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Description courte</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Icône</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <ImageUploader
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
              label="Image du service"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-[#27ae60] rounded focus:ring-[#27ae60]"
              />
              <label htmlFor="active" className="text-gray-700 font-medium">
                Service actif
              </label>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">{formError}</div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#27ae60] text-white px-6 py-2 rounded-lg hover:bg-[#229954] transition-colors disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : editingService ? 'Mettre à jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {showDetailForm && editingService && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Contenu détaillé - {editingService.title}
          </h3>
          <form onSubmit={handleDetailSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Slug (URL)</label>
              <input
                type="text"
                required
                value={detailFormData.slug}
                onChange={(e) => setDetailFormData({ ...detailFormData, slug: e.target.value })}
                placeholder="desinsectisation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL-friendly (ex: desinsectisation, deratisation)
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Contenu détaillé (Markdown)</label>
              <textarea
                rows={15}
                value={detailFormData.detailed_content}
                onChange={(e) => setDetailFormData({ ...detailFormData, detailed_content: e.target.value })}
                placeholder="# Titre principal&#10;## Sous-titre&#10;### Section&#10;&#10;Paragraphe normal...&#10;&#10;- Liste à puces&#10;- Élément 2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none resize-y font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                Markdown : # titre, ## sous-titre, - liste, **gras**, *italique*, [lien](https://…)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Prix de départ</label>
                <input
                  type="text"
                  value={detailFormData.starting_price}
                  onChange={(e) => setDetailFormData({ ...detailFormData, starting_price: e.target.value })}
                  placeholder="À partir de 89€"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Fourchette de prix</label>
                <input
                  type="text"
                  value={detailFormData.price_range}
                  onChange={(e) => setDetailFormData({ ...detailFormData, price_range: e.target.value })}
                  placeholder="89€ - 350€"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Note sur les tarifs</label>
              <input
                type="text"
                value={detailFormData.pricing_note}
                onChange={(e) => setDetailFormData({ ...detailFormData, pricing_note: e.target.value })}
                placeholder="Tarif selon type d'insecte et surface à traiter"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="free_quote"
                checked={detailFormData.free_quote}
                onChange={(e) => setDetailFormData({ ...detailFormData, free_quote: e.target.checked })}
                className="w-4 h-4 text-[#27ae60] rounded focus:ring-[#27ae60]"
              />
              <label htmlFor="free_quote" className="text-gray-700 font-medium">
                Devis gratuit
              </label>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Prestations (une par ligne)</label>
              <textarea
                rows={6}
                value={detailFormData.features}
                onChange={(e) => setDetailFormData({ ...detailFormData, features: e.target.value })}
                placeholder="Traitement punaises de lit&#10;Élimination cafards et blattes&#10;Destruction nids de guêpes"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Avantages (un par ligne)</label>
              <textarea
                rows={6}
                value={detailFormData.benefits}
                onChange={(e) => setDetailFormData({ ...detailFormData, benefits: e.target.value })}
                placeholder="Intervention rapide sous 24h&#10;Garantie de résultat&#10;Produits certifiés sans danger"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none resize-none"
              />
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">{formError}</div>
            )}

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#27ae60] text-white px-6 py-2 rounded-lg hover:bg-[#229954] transition-colors disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer le contenu détaillé'}
              </button>
              <button
                type="button"
                onClick={resetDetailForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  {service.active ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <Eye size={16} />
                      Actif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <EyeOff size={16} />
                      Inactif
                    </span>
                  )}
                  {service.slug && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      /{service.slug}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{service.description}</p>
                {service.pricing_info?.starting_price && (
                  <p className="text-sm text-[#27ae60] font-semibold">
                    {service.pricing_info.starting_price}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {service.slug && service.active && (
                  <a
                    href={`/services/${service.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Voir la page"
                    aria-label="Voir la page"
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
                <button
                  onClick={() => moveService(service.id, 'up')}
                  title="Monter"
                  aria-label="Monter"
                  disabled={index === 0}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <MoveUp size={20} />
                </button>
                <button
                  onClick={() => moveService(service.id, 'down')}
                  title="Descendre"
                  aria-label="Descendre"
                  disabled={index === services.length - 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <MoveDown size={20} />
                </button>
                <button
                  onClick={() => handleEditDetail(service)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Modifier le contenu détaillé"
                >
                  <FileText size={20} />
                </button>
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier les infos de base"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  title="Supprimer"
                  aria-label="Supprimer"
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

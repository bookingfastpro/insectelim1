import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { supabase, BlogPost } from '../../lib/supabase';
import ImageUploader from '../ImageUploader';
import { slugify } from '../../lib/seo';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'prévention',
    image_url: '',
    published: false,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Erreur chargement articles:', error);
    if (data) setPosts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    const payload = { ...formData, slug: slugify(formData.slug) || slugify(formData.title) };
    const { error } = editingPost
      ? await supabase
          .from('blog_posts')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingPost.id)
      : await supabase.from('blog_posts').insert([payload]);

    setSaving(false);
    if (error) {
      setFormError(
        error.code === '23505'
          ? 'Ce slug est déjà utilisé par un autre article.'
          : `Erreur lors de l'enregistrement : ${error.message}`
      );
      return;
    }

    resetForm();
    loadPosts();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) alert(`Erreur lors de la suppression : ${error.message}`);
      loadPosts();
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image_url: post.image_url || '',
      published: post.published,
    });
    setSlugTouched(true);
    setFormError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'prévention',
      image_url: '',
      published: false,
    });
    setEditingPost(null);
    setSlugTouched(false);
    setFormError('');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des articles</h2>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="flex items-center gap-2 bg-[#27ae60] text-white px-4 py-2 rounded-lg hover:bg-[#229954] transition-colors"
        >
          <Plus size={20} />
          Nouvel article
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingPost ? 'Modifier l\'article' : 'Nouvel article'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Titre</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    title,
                    // Le slug suit le titre tant qu'il n'a pas été modifié à la main
                    slug: slugTouched ? prev.slug : slugify(title),
                  }));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Slug (URL)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setFormData({ ...formData, slug: e.target.value });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none"
              >
                <option value="prévention">Prévention</option>
                <option value="traitements écologiques">Traitements écologiques</option>
                <option value="actualités locales">Actualités locales</option>
                <option value="conseils saisonniers">Conseils saisonniers</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Extrait</label>
              <textarea
                required
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Contenu</label>
              <textarea
                required
                rows={14}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent outline-none resize-y font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                Markdown : # titre, ## sous-titre, - liste, **gras**, *italique*, [lien](https://…)
              </p>
            </div>

            <ImageUploader
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
              label="Image de l'article"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-[#27ae60] rounded focus:ring-[#27ae60]"
              />
              <label htmlFor="published" className="text-gray-700 font-medium">
                Publier l'article
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
                {saving ? 'Enregistrement...' : editingPost ? 'Mettre à jour' : 'Créer'}
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

      {posts.length === 0 && !showForm && (
        <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-500">Aucun article pour le moment.</div>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                  {post.published ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <Eye size={16} />
                      Publié
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <EyeOff size={16} />
                      Brouillon
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                <p className="text-sm text-gray-500">
                  Catégorie: {post.category} • {new Date(post.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex gap-2">
                {post.published && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Voir l'article"
                    aria-label="Voir l'article"
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
                <button
                  onClick={() => handleEdit(post)}
                  title="Modifier"
                  aria-label="Modifier"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
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

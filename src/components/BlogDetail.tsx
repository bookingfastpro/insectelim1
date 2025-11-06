import { useEffect, useState } from 'react';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';

interface BlogDetailProps {
  slug: string;
  onBack: () => void;
}

export default function BlogDetail({ slug, onBack }: BlogDetailProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const loadPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (data && !error) {
      setPost(data);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-4xl font-bold text-gray-900 mb-6 mt-8">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-3xl font-bold text-gray-900 mb-4 mt-8">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-2xl font-bold text-gray-900 mb-3 mt-6">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <p key={key++} className="text-lg font-bold text-gray-900 mb-2 mt-4">
            {line.replaceAll('**', '')}
          </p>
        );
      } else if (line.startsWith('- ')) {
        const items = [line];
        while (i + 1 < lines.length && lines[i + 1].startsWith('- ')) {
          items.push(lines[++i]);
        }
        elements.push(
          <ul key={key++} className="list-disc list-inside space-y-2 mb-4 ml-4">
            {items.map((item, idx) => (
              <li key={idx} className="text-gray-700 leading-relaxed">
                {item.substring(2)}
              </li>
            ))}
          </ul>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={key++} className="h-2"></div>);
      } else if (line.trim().length > 0) {
        const processedLine = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        elements.push(
          <p
            key={key++}
            className="text-gray-700 leading-relaxed mb-4 text-lg"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      }
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Article non trouvé
          </h2>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#27ae60] font-semibold hover:underline"
          >
            <ArrowLeft size={20} />
            Retour aux articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#27ae60] to-[#1e8449] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour aux articles
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-white/90">
              <Calendar size={18} />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Tag size={16} />
              <span className="text-sm font-medium">{post.category}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-white/90">{post.excerpt}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            {renderMarkdownContent(post.content)}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-br from-[#27ae60]/10 to-[#1e8449]/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Besoin d'aide avec ce problème ?
              </h3>
              <p className="text-gray-700 mb-6">
                INSECTELIM intervient rapidement à Porto-Vecchio et dans toute la
                Corse-du-Sud pour résoudre vos problèmes de nuisibles.
              </p>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onBack();
                  setTimeout(() => {
                    document.getElementById('contact')?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }, 100);
                }}
                className="inline-block bg-gradient-to-r from-[#27ae60] to-[#229954] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Demander un devis gratuit
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

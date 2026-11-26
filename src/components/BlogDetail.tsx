import { useEffect, useState } from 'react';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import { handleLinkClick } from '../lib/router';
import { Markdown } from '../lib/markdown';
import { usePageMeta, formatDate } from '../lib/seo';

interface BlogDetailProps {
  slug: string;
}

export default function BlogDetail({ slug }: BlogDetailProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    window.scrollTo(0, 0);
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('Erreur chargement article:', error);
        setPost(data ?? null);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  usePageMeta(post?.title, post?.excerpt);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 animate-pulse" aria-busy="true">
        <div className="h-72 bg-[#27ae60]/40" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-96 bg-white rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <a
            href="/#blog"
            onClick={handleLinkClick}
            className="inline-flex items-center gap-2 text-[#27ae60] font-semibold hover:underline"
          >
            <ArrowLeft size={20} />
            Retour aux articles
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <header className="bg-gradient-to-br from-[#27ae60] to-[#1e8449] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="/#blog"
            onClick={handleLinkClick}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour aux articles
          </a>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-white/90">
              <Calendar size={18} />
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            </div>
            {post.category && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <Tag size={16} />
                <span className="text-sm font-medium capitalize">{post.category}</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
          <p className="text-lg md:text-xl text-white/90">{post.excerpt}</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full max-h-[28rem] object-cover"
              decoding="async"
            />
          )}
          <div className="p-6 sm:p-8 md:p-12">
            <Markdown content={post.content} />

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-br from-[#27ae60]/10 to-[#1e8449]/10 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Besoin d'aide avec ce problème ?</h2>
                <p className="text-gray-700 mb-6">
                  INSECTELIM intervient rapidement à Porto-Vecchio et dans toute la Corse-du-Sud pour résoudre vos
                  problèmes de nuisibles.
                </p>
                <a
                  href="/#contact"
                  onClick={handleLinkClick}
                  className="inline-block bg-gradient-to-r from-[#27ae60] to-[#229954] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  Demander un devis gratuit
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

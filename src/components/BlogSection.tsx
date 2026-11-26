import { useEffect, useState } from 'react';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import { handleLinkClick } from '../lib/router';
import { formatDate } from '../lib/seo';

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, image_url, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('Erreur chargement articles:', error);
        setPosts((data ?? []) as BlogPost[]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="blog" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Conseils & Actualités
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Les conseils INSECTELIM pour un habitat sans nuisibles
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                onClick={handleLinkClick}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus-visible:ring-4 focus-visible:ring-[#27ae60]/40 outline-none"
              >
                <div className="h-48 overflow-hidden bg-gradient-to-br from-[#27ae60] to-[#1e8449] flex items-center justify-center">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Newspaper className="text-white/80" size={64} strokeWidth={1.5} />
                  )}
                </div>
                <article className="flex flex-col flex-1 p-6">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={16} />
                    <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                    {post.category && (
                      <span className="ml-auto bg-[#27ae60]/10 text-[#1e8449] px-3 py-1 rounded-full text-xs font-medium capitalize">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-[#27ae60] font-semibold transition-all group-hover:gap-3">
                    Lire la suite
                    <ArrowRight size={16} />
                  </span>
                </article>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun article disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}

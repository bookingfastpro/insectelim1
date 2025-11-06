import { useEffect, useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';

interface BlogSectionProps {
  onReadMore?: (slug: string) => void;
}

export default function BlogSection({ onReadMore }: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (data && !error) {
      setPosts(data);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Conseils & Actualités
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Les conseils INSECTELIM pour un habitat sans nuisibles
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-br from-[#27ae60] to-[#1e8449] flex items-center justify-center">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-6xl">📰</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={16} />
                    <span>{formatDate(post.created_at)}</span>
                    <span className="ml-auto bg-[#27ae60]/10 text-[#27ae60] px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <button
                    onClick={() => onReadMore?.(post.slug)}
                    className="inline-flex items-center gap-2 text-[#27ae60] font-semibold hover:underline transition-all hover:gap-3"
                  >
                    Lire la suite
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun article disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

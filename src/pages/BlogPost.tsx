
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useBlogPost } from "@/hooks/useBlogPosts";

const BlogPost = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const { data: post, isLoading, error } = useBlogPost(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen text-white relative overflow-hidden" style={{
        backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <Navigation />
        <div className="flex justify-center items-center min-h-[50vh] relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-white">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen text-white relative overflow-hidden" style={{
        backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <Navigation />
        <div className="pt-24 relative z-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
            <p className="text-gray-300 mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={`${post.meta_title || post.title} - MusicGift.ro Blog`}
        description={post.meta_description || post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, '') + '...'}
        url={`https://www.musicgift.ro/blog/${post.slug}`}
        type="article"
      />
      
      <div className="min-h-screen text-white relative overflow-hidden" style={{
        backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Floating Musical Notes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl opacity-30 animate-float">♪</div>
          <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>🎵</div>
          <div className="absolute top-1/2 left-1/4 text-3xl opacity-25 animate-float" style={{ animationDelay: '1s' }}>♫</div>
          <div className="absolute top-1/3 right-1/3 text-2xl opacity-30 animate-float" style={{ animationDelay: '3s' }}>♪</div>
        </div>
        
        <Navigation />

        <article className="pt-24 pb-16 relative z-10">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Back Button */}
            <div className="mb-8">
              <Link to="/blog">
                <Button variant="ghost" className="text-white hover:text-purple-300 hover:bg-white/10 backdrop-blur-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('backToBlog') || 'Back to Blog'}
                </Button>
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-12">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                  {post.category}
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>
                <div className="flex items-center space-x-6 text-gray-300 mb-8">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {post.read_time} min {t('read') || 'read'}
                  </div>
                </div>
                {/* Use default placeholder image instead of post.image_url */}
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src="/uploads/background.webp" 
                    alt={post.title}
                    className="w-full h-64 sm:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8">
                <div 
                  className="prose prose-lg max-w-none text-gray-200 leading-relaxed prose-headings:text-white prose-a:text-purple-300 prose-strong:text-white"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{
                    fontSize: '18px',
                    lineHeight: '1.8'
                  }}
                />
              </div>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-gray-300 font-medium mr-2">Tags:</span>
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm border-white/20 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action matching About page style */}
            <div className="max-w-4xl mx-auto mt-16 relative py-20 bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-md rounded-3xl border border-white/30 text-white overflow-hidden shadow-2xl">
              <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 text-center px-8">
                <div className="mb-6">
                  <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 font-medium">
                    Ready to Start?
                  </Badge>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  {t('blogCtaTitle') || "Ready to Create Your Musical Gift?"}
                </h3>
                <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto leading-relaxed">
                  {t('blogCtaDescription') || "Let our expert team create a personalized song that tells your unique story"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/packages">
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                      {t('viewPackages') || "View Packages"}
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-6 py-3 font-medium transition-all duration-300">
                      {t('getInTouch') || "Get in Touch"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;

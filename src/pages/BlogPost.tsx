
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navigation />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
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
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navigation />

        <article className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Back Button */}
            <div className="mb-8">
              <Link to="/blog">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('backToBlog') || 'Back to Blog'}
                </Button>
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-12">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-4 bg-purple-600 text-white">
                  {post.category}
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                  {post.title}
                </h1>
                <div className="flex items-center space-x-6 text-gray-600 mb-8">
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
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-xl"
                  />
                )}
              </div>
            </header>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  fontSize: '18px',
                  lineHeight: '1.8'
                }}
              />
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t">
                  <span className="text-gray-600 font-medium mr-2">Tags:</span>
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="max-w-4xl mx-auto mt-16 p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl text-white text-center">
              <h3 className="text-2xl font-bold mb-4">
                {t('blogCtaTitle') || "Ready to Create Your Musical Gift?"}
              </h3>
              <p className="text-lg mb-6 text-white/90">
                {t('blogCtaDescription') || "Let our expert team create a personalized song that tells your unique story"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/packages">
                  <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                    {t('viewPackages') || "View Packages"}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                    {t('getInTouch') || "Get in Touch"}
                  </Button>
                </Link>
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

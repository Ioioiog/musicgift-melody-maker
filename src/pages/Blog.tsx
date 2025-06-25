import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, ArrowRight, Music, Headphones, Mic, Guitar, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useState, useMemo } from "react";

const Blog = () => {
  const { t } = useLanguage();
  const { data: blogPosts = [], isLoading } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return blogPosts;
    const term = searchTerm.toLowerCase();
    return blogPosts.filter(post => 
      post?.title?.toLowerCase().includes(term) || 
      post?.excerpt?.toLowerCase().includes(term) || 
      post?.category?.toLowerCase().includes(term) || 
      post?.author?.toLowerCase().includes(term)
    );
  }, [blogPosts, searchTerm]);

  // Get featured post
  const featuredPost = blogPosts.find(post => post?.is_featured) || blogPosts[0];

  // Get non-featured posts for the grid
  const regularPosts = filteredPosts.filter(post => !post?.is_featured || post !== featuredPost);

  // Get all categories (predefined) with counts
  const categories = useMemo(() => {
    const categoryCount = blogPosts.reduce((acc, post) => {
      if (post?.category) {
        acc[post.category] = (acc[post.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const categoryIcons = {
      'Music Tips': Music,
      'Industry Insights': Headphones,
      'Client Stories': User,
      'Behind the Scenes': Mic,
      'Trends': Guitar,
      'General': Music
    };

    const categoryColors = {
      'Music Tips': "from-blue-500 to-blue-600",
      'Industry Insights': "from-purple-500 to-purple-600",
      'Client Stories': "from-pink-500 to-pink-600",
      'Behind the Scenes': "from-green-500 to-green-600",
      'Trends': "from-orange-500 to-orange-600",
      'General': "from-gray-500 to-gray-600"
    };

    // Return all predefined categories, even if they have 0 posts
    const predefinedCategories = ['Music Tips', 'Industry Insights', 'Client Stories', 'Behind the Scenes', 'Trends', 'General'];
    return predefinedCategories.map(name => ({
      name,
      count: categoryCount[name] || 0,
      icon: categoryIcons[name as keyof typeof categoryIcons] || Music,
      color: categoryColors[name as keyof typeof categoryColors] || "from-gray-500 to-gray-600"
    }));
  }, [blogPosts]);

  if (isLoading) {
    return <div className="min-h-screen text-white relative overflow-hidden" style={{
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
            <p className="text-white">Loading blog posts...</p>
          </div>
        </div>
        <Footer />
      </div>;
  }

  return (
    <>
      <SEOHead 
        title={t('blogPageTitle') || "Blog - MusicGift.ro | Music Industry Insights & Tips"} 
        description={t('blogPageDescription') || "Discover music creation tips, industry insights, and inspiring stories from our personalized music journey. Expert advice for meaningful musical gifts."} 
        url="https://www.musicgift.ro/blog" 
      />
      
      <div className="min-h-screen text-white relative overflow-hidden" style={{
        backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <Navigation />

        {/* Compact Modern Header */}
        <header className="text-white relative overflow-hidden pt-20 pb-12">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-8 left-8 text-3xl opacity-20 animate-float">♪</div>
            <div className="absolute bottom-8 right-8 text-4xl opacity-15 animate-float" style={{
            animationDelay: '2s'
          }}>🎵</div>
            <div className="absolute top-1/2 left-1/4 text-2xl opacity-20 animate-float" style={{
            animationDelay: '1s'
          }}>♫</div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Hero Section - More Compact */}
            <div className="max-w-4xl mx-auto text-center mb-12">
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium mb-4">
                Latest Insights & Stories
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                {t('blogHeroTitle') || "Music Blog"}
              </h1>
              
              <p className="text-lg sm:text-xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
                {t('blogHeroSubtitle') || "Discover the art of personalized music, industry insights, and inspiring stories"}
              </p>
              
              {/* Compact Search */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
                  <Input 
                    placeholder={t('searchPlaceholder') || "Search articles..."} 
                    className="pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border-white/20 rounded-xl text-white placeholder:text-gray-300 focus:border-purple-400 focus:ring-purple-400/20" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Compact Categories Grid */}
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {t('blogCategoriesTitle') || "Explore Categories"}
                </h2>
              </div>
              
              {/* Mobile Horizontal Scroll */}
              <div className="flex overflow-x-auto space-x-3 pb-4 md:hidden scrollbar-hide">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <Card key={index} className="group cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex-shrink-0 w-40">
                      <div className={`h-1 bg-gradient-to-r ${category.color}`}></div>
                      <CardContent className="p-4 text-center">
                        <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-white mb-1 text-xs">{category.name}</h3>
                        <p className="text-gray-300 text-xs">{category.count} {t('articles') || 'articles'}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* Desktop Grid - More Compact */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-4">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <Card key={index} className="group cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${category.color}`}></div>
                      <CardContent className="p-5 text-center">
                        <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-white mb-1 text-sm">{category.name}</h3>
                        <p className="text-gray-300 text-xs">{category.count} {t('articles') || 'articles'}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto sm:px-6 relative z-10 px-[18px] py-0">
          {/* Featured Article */}
          {featuredPost && <section className="mb-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {t('featuredArticle') || "Featured Article"}
                </h2>
                <p className="text-xl text-gray-200">
                  Our most popular story this week
                </p>
              </div>
              
              <Card className="overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white/10 backdrop-blur-md border border-white/20">
                <div className="lg:flex">
                  <div className="lg:w-3/5 relative overflow-hidden">
                    <img src={'/uploads/background.webp'} alt={featuredPost.title} className="w-full h-80 lg:h-full object-cover transition-transform duration-700 hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden"></div>
                    <Badge className="absolute top-6 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-2 font-medium">
                      {featuredPost.category}
                    </Badge>
                  </div>
                  
                  <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="mb-6 lg:hidden">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-2 font-medium">
                        {featuredPost.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mb-8 text-gray-400 text-sm">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {featuredPost.read_time} min
                        </div>
                        {featuredPost.views && featuredPost.views > 0 && <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            {featuredPost.views}
                          </div>}
                      </div>
                    </div>
                    
                    <Link to={`/blog/${featuredPost.slug}`}>
                      <Button className="bg-orange-500 text-white border-0 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                        {t('readMore') || "Read More"} 
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </section>}

          {/* Recent Posts - Modern Grid */}
          {regularPosts.length > 0 && <section className="mb-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {searchTerm ? `Search Results (${regularPosts.length})` : t('recentArticles') || "Recent Articles"}
                </h2>
                <p className="text-xl text-gray-200">
                  {searchTerm ? `Results for "${searchTerm}"` : "Fresh insights and stories from our music experts"}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {regularPosts.map(post => post && <Card key={post.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                    <div className="relative overflow-hidden">
                      <img src={'/uploads/background.webp'} alt={post.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800 border-0 backdrop-blur-sm font-medium">
                        {post.category}
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl group-hover:text-purple-300 transition-colors duration-300 leading-snug text-white">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-base leading-relaxed">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.published_at || post.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.read_time} min
                          </div>
                        </div>
                        {post.views && post.views > 0 && <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views}
                          </div>}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-400">
                          <User className="w-4 h-4 mr-1" />
                          {post.author}
                        </div>
                        
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant="ghost" className="text-purple-300 hover:text-purple-200 hover:bg-white/10 font-medium p-2">
                            {t('readMore') || "Read More"}
                            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </section>}

          {/* No Results Message */}
          {searchTerm && filteredPosts.length === 0 && <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-white mb-4">No articles found</h3>
              <p className="text-gray-300 mb-8">Try adjusting your search terms or browse all articles.</p>
              <Button onClick={() => setSearchTerm("")} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Clear Search
              </Button>
            </div>}

          <section className="relative py-20 bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-md rounded-3xl border border-white/30 text-white overflow-hidden shadow-2xl">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center px-8">
              <div className="mb-6">
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 font-medium">
                  Ready to Start?
                </Badge>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {t('blogCtaTitle') || "Ready to Create Your Musical Gift?"}
              </h2>
              
              <p className="text-xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
                {t('blogCtaDescription') || "Let our expert team create a personalized song that tells your unique story"}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/packages">
                  <Button size="lg" className="bg-white hover:bg-gray-100 px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-orange-500">
                    {t('viewPackages') || "View Packages"}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white hover:bg-white px-8 py-4 text-lg font-medium transition-all duration-300 text-orange-500">
                    {t('getInTouch') || "Get in Touch"}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Blog;

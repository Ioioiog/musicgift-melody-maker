import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BlogFilterSection from "@/components/BlogFilterSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Music, Headphones, Mic, Guitar, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useState, useMemo } from "react";

const Blog = () => {
  const { t } = useLanguage();
  const { data: blogPosts = [], isLoading } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateFilter, setDateFilter] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let posts = blogPosts;

    // Filter by category
    if (selectedCategory !== "all") {
      const categoryName = selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      posts = posts.filter(post => post?.category === categoryName);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      posts = posts.filter(post => 
        post?.title?.toLowerCase().includes(term) || 
        post?.excerpt?.toLowerCase().includes(term) || 
        post?.category?.toLowerCase().includes(term) || 
        post?.author?.toLowerCase().includes(term)
      );
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      switch (dateFilter) {
        case "recent":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "month":
          filterDate.setMonth(now.getMonth());
          filterDate.setDate(1);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear());
          filterDate.setMonth(0);
          filterDate.setDate(1);
          break;
      }
      if (dateFilter !== "all") {
        posts = posts.filter(post => {
          const postDate = new Date(post?.published_at || post?.created_at);
          return postDate >= filterDate;
        });
      }
    }

    // Sort posts
    posts.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a?.published_at || a?.created_at).getTime() - new Date(b?.published_at || b?.created_at).getTime();
        case "popular":
          return (b?.views || 0) - (a?.views || 0);
        case "title":
          return (a?.title || "").localeCompare(b?.title || "");
        case "newest":
        default:
          return new Date(b?.published_at || b?.created_at).getTime() - new Date(a?.published_at || a?.created_at).getTime();
      }
    });

    return posts;
  }, [blogPosts, searchTerm, selectedCategory, dateFilter, sortBy]);

  // Get featured post
  const featuredPost = blogPosts.find(post => post?.is_featured) || blogPosts[0];

  // Get non-featured posts for the grid
  const regularPosts = filteredPosts.filter(post => !post?.is_featured || post !== featuredPost);

  // Get all categories with counts
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

    const predefinedCategories = ['Music Tips', 'Industry Insights', 'Client Stories', 'Behind the Scenes', 'Trends', 'General'];

    return predefinedCategories.map(name => ({
      name,
      count: categoryCount[name] || 0,
      icon: categoryIcons[name as keyof typeof categoryIcons] || Music,
      color: categoryColors[name as keyof typeof categoryColors] || "from-gray-500 to-gray-600"
    }));
  }, [blogPosts]);

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
            <p className="text-white">{t('loadingBlogPosts')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={t('blogPageTitle')} 
        description={t('blogPageDescription')} 
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

        {/* Compact Header */}
        <header className="text-white relative overflow-hidden pt-16 pb-6">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 text-2xl opacity-15 animate-float">♪</div>
            <div className="absolute bottom-4 right-4 text-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🎵</div>
            <div className="absolute top-1/2 left-1/4 text-xl opacity-15 animate-float" style={{ animationDelay: '1s' }}>♫</div>
          </div>
          
          <div className="container mx-auto sm:px-6 relative z-10 px-0 py-[55px]">
            {/* Compact Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight px-0 py-[3px]">
                {t('blogHeroTitle')}
              </h1>
              
              <p className="text-base sm:text-lg mb-6 text-gray-200 max-w-2xl mx-auto leading-relaxed">
                {t('blogHeroSubtitle')}
              </p>
            </div>

            {/* Filter Section */}
            <BlogFilterSection 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              totalPosts={blogPosts.length}
              filteredCount={filteredPosts.length}
              sortBy={sortBy}
              setSortBy={setSortBy}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              isOpen={filtersOpen}
              setIsOpen={setFiltersOpen}
            />
          </div>
        </header>

        <div className="container mx-auto sm:px-6 relative z-10 px-0 py-0">
          <div className="space-y-8">
            {/* Compact Featured Article */}
            {featuredPost && selectedCategory === "all" && !searchTerm && (
              <section>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {t('featuredArticle')}
                  </h2>
                  <p className="text-lg text-gray-200">
                    {t('ourMostPopularStory')}
                  </p>
                </div>
                
                <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="lg:flex">
                    <div className="lg:w-2/3 relative overflow-hidden">
                      <img 
                        src={featuredPost.image_url || '/uploads/background.webp'} 
                        alt={featuredPost.title} 
                        className="w-full h-48 lg:h-64 object-cover transition-transform duration-700 hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden"></div>
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-3 py-1 text-sm font-medium">
                        {featuredPost.category}
                      </Badge>
                    </div>
                    
                    <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col justify-center">
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 leading-tight">
                        {featuredPost.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-6 text-sm leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mb-6 text-gray-400 text-xs">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {featuredPost.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {featuredPost.read_time} {t('min')}
                          </div>
                          {featuredPost.views && featuredPost.views > 0 && (
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {featuredPost.views}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Link to={`/blog/${featuredPost.slug}`}>
                        <Button className="bg-orange-500 text-white border-0 px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 w-full lg:w-auto">
                          {t('readMore')} 
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </section>
            )}

            {/* Compact Posts Grid */}
            {regularPosts.length > 0 && (
              <section>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {searchTerm ? `${t('searchResults')} (${regularPosts.length})` : t('recentArticles')}
                  </h2>
                  <p className="text-lg text-gray-200">
                    {searchTerm ? `${t('resultsFor')} "${searchTerm}"` : t('freshInsights')}
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {regularPosts.map(post => post && (
                    <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                      <div className="relative overflow-hidden">
                        <img 
                          src={post.image_url || '/uploads/background.webp'} 
                          alt={post.title} 
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Badge className="absolute top-2 left-2 bg-white/90 text-gray-800 border-0 backdrop-blur-sm font-medium text-xs px-2 py-1">
                          {post.category}
                        </Badge>
                      </div>
                      
                      <CardHeader className="pb-2 p-4">
                        <CardTitle className="text-sm group-hover:text-purple-300 transition-colors duration-300 leading-snug text-white line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-gray-300 text-xs leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0 p-4">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(post.published_at || post.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {post.read_time} {t('min')}
                            </div>
                          </div>
                          {post.views && post.views > 0 && (
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {post.views}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-400">
                            <User className="w-3 h-3 mr-1" />
                            {post.author}
                          </div>
                          
                          <Link to={`/blog/${post.slug}`}>
                            <Button variant="ghost" className="text-purple-300 hover:text-purple-200 hover:bg-white/10 font-medium p-1 text-xs">
                              {t('readMore')}
                              <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* No Results Message */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-white mb-3">{t('noArticlesFound')}</h3>
                <p className="text-gray-300 mb-6">{t('tryAdjustingSearch')}</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setDateFilter("all");
                    setSortBy("newest");
                  }}
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {t('clearFilters')}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Compact CTA Section */}
        <div className="container mx-auto sm:px-6 relative z-10 py-0 mt-12 px-[240px] my-[62px]">
          <section className="relative bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white overflow-hidden shadow-xl py-8">
            <div className="absolute top-6 left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-6 right-6 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center px-6">
              <div className="mb-4">
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-3 py-1 font-medium text-sm">
                  {t('readyToStart')}
                </Badge>
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                {t('blogCtaTitle')}
              </h2>
              
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
                {t('blogCtaDescription')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/packages">
                  <Button size="lg" className="bg-white hover:bg-gray-100 px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-orange-500">
                    {t('viewPackages')}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white hover:bg-white px-6 py-3 text-base font-medium transition-all duration-300 text-orange-500">
                    {t('getInTouch')}
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

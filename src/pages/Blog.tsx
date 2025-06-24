
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

const Blog = () => {
  const { t } = useLanguage();

  const featuredPost = {
    id: 1,
    title: t('featuredPostTitle') || "The Art of Personalized Music: Creating Emotional Connections",
    excerpt: t('featuredPostExcerpt') || "Discover how personalized music creates deeper emotional bonds and makes every gift truly unforgettable.",
    image: "/uploads/background.webp",
    category: t('categoryTips') || "Music Tips",
    date: "2024-06-20",
    author: "MusicGift Team",
    readTime: "5 min",
    views: "2.3k"
  };

  const blogPosts = [
    {
      id: 2,
      title: t('blogPost1Title') || "5 Tips for Writing Meaningful Song Lyrics",
      excerpt: t('blogPost1Excerpt') || "Learn how to craft lyrics that touch hearts and tell compelling stories.",
      image: "/uploads/65518432-abfe-42fc-acc5-25014d321134.png",
      category: t('categoryTips') || "Music Tips",
      date: "2024-06-18",
      author: "Maria Popescu",
      readTime: "7 min",
      views: "1.8k"
    },
    {
      id: 3,
      title: t('blogPost2Title') || "Behind the Scenes: Our Music Production Process",
      excerpt: t('blogPost2Excerpt') || "Get an exclusive look at how we create your personalized musical gifts.",
      image: "/uploads/a83ec5e1-01f2-4010-9224-fb7860ad66be.png",
      category: t('categoryBehindScenes') || "Behind the Scenes",
      date: "2024-06-15",
      author: "Alex Ionescu",
      readTime: "6 min",
      views: "2.1k"
    },
    {
      id: 4,
      title: t('blogPost3Title') || "The Psychology of Music: Why Songs Move Us",
      excerpt: t('blogPost3Excerpt') || "Understanding the emotional power of music and its impact on human connections.",
      image: "/uploads/b8d4dbea-6ce1-4368-b11c-47cbc1ea1ba0.png",
      category: t('categoryIndustry') || "Industry Insights",
      date: "2024-06-12",
      author: "Dr. Cristina Radu",
      readTime: "8 min",
      views: "3.2k"
    },
    {
      id: 5,
      title: t('blogPost4Title') || "Client Spotlight: A Wedding Song That Changed Everything",
      excerpt: t('blogPost4Excerpt') || "Read how a personalized wedding song created an unforgettable moment.",
      image: "/uploads/c8247b19-53ef-4926-888f-4d4fd609e783.png",
      category: t('categoryStories') || "Client Stories",
      date: "2024-06-10",
      author: "MusicGift Team",
      readTime: "4 min",
      views: "1.5k"
    },
    {
      id: 6,
      title: t('blogPost5Title') || "Trending Music Styles for 2024 Gifts",
      excerpt: t('blogPost5Excerpt') || "Explore the most popular music genres for personalized gifts this year.",
      image: "/uploads/e923f28a-a040-43f3-a749-31a8b2e479b3.png",
      category: t('categoryTrends') || "Trends",
      date: "2024-06-08",
      author: "Andrei Toma",
      readTime: "5 min",
      views: "2.7k"
    }
  ];

  const categories = [
    { name: t('categoryTips') || "Music Tips", icon: Music, count: 12, color: "from-blue-500 to-blue-600" },
    { name: t('categoryIndustry') || "Industry Insights", icon: Headphones, count: 8, color: "from-purple-500 to-purple-600" },
    { name: t('categoryStories') || "Client Stories", icon: User, count: 15, color: "from-pink-500 to-pink-600" },
    { name: t('categoryBehindScenes') || "Behind the Scenes", icon: Mic, count: 6, color: "from-green-500 to-green-600" },
    { name: t('categoryTrends') || "Trends", icon: Guitar, count: 9, color: "from-orange-500 to-orange-600" }
  ];

  return (
    <>
      <SEOHead 
        title={t('blogPageTitle') || "Blog - MusicGift.ro | Music Industry Insights & Tips"}
        description={t('blogPageDescription') || "Discover music creation tips, industry insights, and inspiring stories from our personalized music journey. Expert advice for meaningful musical gifts."}
        url="https://www.musicgift.ro/blog"
      />
      
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        {/* Modern Hero Section */}
        <section className="relative pt-24 sm:pt-32 pb-20 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('/uploads/background.webp')] bg-cover bg-center opacity-10"></div>
          
          {/* Animated background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="mb-6">
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                  Latest Insights & Stories
                </Badge>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                {t('blogHeroTitle') || "Music Blog"}
              </h1>
              
              <p className="text-xl sm:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
                {t('blogHeroSubtitle') || "Discover the art of personalized music, industry insights, and inspiring stories"}
              </p>
              
              <div className="max-w-xl mx-auto">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                  <Input 
                    placeholder={t('searchPlaceholder') || "Search articles..."}
                    className="pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border-white/20 rounded-2xl text-white placeholder:text-gray-300 focus:border-purple-400 focus:ring-purple-400/20 text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 py-20">
          {/* Modern Categories Section */}
          <section className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t('blogCategoriesTitle') || "Explore Categories"}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Dive into our curated collection of music insights and stories
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
                    <CardContent className="p-8 text-center bg-white group-hover:bg-gray-50 transition-colors">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{category.name}</h3>
                      <p className="text-gray-500 font-medium">{category.count} {t('articles') || 'articles'}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Featured Article - More Modern Design */}
          <section className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t('featuredArticle') || "Featured Article"}
              </h2>
              <p className="text-xl text-gray-600">
                Our most popular story this week
              </p>
            </div>
            
            <Card className="overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50">
              <div className="lg:flex">
                <div className="lg:w-3/5 relative overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-80 lg:h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
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
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-8 text-gray-500 text-sm">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {featuredPost.date}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {featuredPost.readTime}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        {featuredPost.views}
                      </div>
                    </div>
                  </div>
                  
                  <Link to={`/blog/${featuredPost.id}`}>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                      {t('readMore') || "Read More"} 
                      <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>

          {/* Recent Posts - Modern Grid */}
          <section className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t('recentArticles') || "Recent Articles"}
              </h2>
              <p className="text-xl text-gray-600">
                Fresh insights and stories from our music experts
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 shadow-lg bg-white">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800 border-0 backdrop-blur-sm font-medium">
                      {post.category}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl group-hover:text-purple-600 transition-colors duration-300 leading-snug">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      
                      <Link to={`/blog/${post.id}`}>
                        <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-medium p-2">
                          {t('readMore') || "Read More"}
                          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Modern CTA Section */}
          <section className="relative py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl text-white overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('/uploads/background.webp')] bg-cover bg-center opacity-10"></div>
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
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                    {t('viewPackages') || "View Packages"}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-medium transition-all duration-300">
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

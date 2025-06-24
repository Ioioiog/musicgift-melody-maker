
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, ArrowRight, Music, Headphones, Mic, Guitar } from "lucide-react";
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
    readTime: "5 min"
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
      readTime: "7 min"
    },
    {
      id: 3,
      title: t('blogPost2Title') || "Behind the Scenes: Our Music Production Process",
      excerpt: t('blogPost2Excerpt') || "Get an exclusive look at how we create your personalized musical gifts.",
      image: "/uploads/a83ec5e1-01f2-4010-9224-fb7860ad66be.png",
      category: t('categoryBehindScenes') || "Behind the Scenes",
      date: "2024-06-15",
      author: "Alex Ionescu",
      readTime: "6 min"
    },
    {
      id: 4,
      title: t('blogPost3Title') || "The Psychology of Music: Why Songs Move Us",
      excerpt: t('blogPost3Excerpt') || "Understanding the emotional power of music and its impact on human connections.",
      image: "/uploads/b8d4dbea-6ce1-4368-b11c-47cbc1ea1ba0.png",
      category: t('categoryIndustry') || "Industry Insights",
      date: "2024-06-12",
      author: "Dr. Cristina Radu",
      readTime: "8 min"
    },
    {
      id: 5,
      title: t('blogPost4Title') || "Client Spotlight: A Wedding Song That Changed Everything",
      excerpt: t('blogPost4Excerpt') || "Read how a personalized wedding song created an unforgettable moment.",
      image: "/uploads/c8247b19-53ef-4926-888f-4d4fd609e783.png",
      category: t('categoryStories') || "Client Stories",
      date: "2024-06-10",
      author: "MusicGift Team",
      readTime: "4 min"
    },
    {
      id: 6,
      title: t('blogPost5Title') || "Trending Music Styles for 2024 Gifts",
      excerpt: t('blogPost5Excerpt') || "Explore the most popular music genres for personalized gifts this year.",
      image: "/uploads/e923f28a-a040-43f3-a749-31a8b2e479b3.png",
      category: t('categoryTrends') || "Trends",
      date: "2024-06-08",
      author: "Andrei Toma",
      readTime: "5 min"
    }
  ];

  const categories = [
    { name: t('categoryTips') || "Music Tips", icon: Music, count: 12 },
    { name: t('categoryIndustry') || "Industry Insights", icon: Headphones, count: 8 },
    { name: t('categoryStories') || "Client Stories", icon: User, count: 15 },
    { name: t('categoryBehindScenes') || "Behind the Scenes", icon: Mic, count: 6 },
    { name: t('categoryTrends') || "Trends", icon: Guitar, count: 9 }
  ];

  return (
    <>
      <SEOHead 
        title={t('blogPageTitle') || "Blog - MusicGift.ro | Music Industry Insights & Tips"}
        description={t('blogPageDescription') || "Discover music creation tips, industry insights, and inspiring stories from our personalized music journey. Expert advice for meaningful musical gifts."}
        url="https://www.musicgift.ro/blog"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navigation />

        {/* Hero Section */}
        <section 
          className="relative pt-24 sm:pt-32 pb-16 overflow-hidden"
          style={{
            backgroundImage: 'url(/uploads/background.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                {t('blogHeroTitle') || "Music Blog"}
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-gray-200">
                {t('blogHeroSubtitle') || "Discover the art of personalized music, industry insights, and inspiring stories"}
              </p>
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    placeholder={t('searchPlaceholder') || "Search articles..."}
                    className="pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-full text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 py-16">
          {/* Categories */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              {t('blogCategoriesTitle') || "Explore Categories"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-purple-50 border-purple-100">
                    <CardContent className="p-6 text-center">
                      <IconComponent className="w-8 h-8 mx-auto mb-3 text-purple-600 group-hover:text-purple-700 transition-colors" />
                      <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.count} {t('articles') || 'articles'}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Featured Post */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              {t('featuredArticle') || "Featured Article"}
            </h2>
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                    {featuredPost.category}
                  </Badge>
                  <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                  <p className="text-white/90 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between mb-6 text-white/80 text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {featuredPost.date}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {featuredPost.author}
                      </div>
                    </div>
                    <span>{featuredPost.readTime} {t('read') || 'read'}</span>
                  </div>
                  <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                    {t('readMore') || "Read More"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </section>

          {/* Recent Posts */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              {t('recentArticles') || "Recent Articles"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-purple-600 text-white">
                      {post.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.date}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {post.author}
                        </div>
                      </div>
                      <span>{post.readTime} {t('read') || 'read'}</span>
                    </div>
                    <Button variant="outline" className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      {t('readMore') || "Read More"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl text-white">
            <h2 className="text-3xl font-bold mb-4">
              {t('blogCtaTitle') || "Ready to Create Your Musical Gift?"}
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
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
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Blog;

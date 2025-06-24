
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const BlogPost = () => {
  const { t } = useLanguage();
  const { id } = useParams();

  // Mock blog posts data - in a real app this would come from a database
  const blogPosts = {
    "1": {
      title: t('featuredPostTitle') || "The Art of Personalized Music: Creating Emotional Connections",
      content: `
        <p>Personalized music has the unique power to create deep emotional connections that generic songs simply cannot match. When a song is crafted specifically for someone, it carries their story, their emotions, and their unique journey.</p>
        
        <h2>The Science Behind Musical Emotions</h2>
        <p>Research has shown that music activates multiple areas of the brain simultaneously, including regions responsible for memory, emotion, and personal identity. When a song contains personal elements - names, specific memories, or meaningful references - these neural pathways become even more active.</p>
        
        <h2>Creating Your Personal Musical Story</h2>
        <p>Every personalized song we create begins with understanding your story. We work closely with you to understand the emotions you want to convey, the memories you want to preserve, and the message you want to share.</p>
        
        <h2>The Impact of Personalized Music</h2>
        <p>Our clients consistently report that their personalized songs become treasured keepsakes, played during important moments and shared with loved ones for years to come. This is the true power of personalized music - it doesn't just entertain, it connects.</p>
      `,
      image: "/uploads/background.webp",
      category: t('categoryTips') || "Music Tips",
      date: "2024-06-20",
      author: "MusicGift Team",
      readTime: "5 min"
    },
    "2": {
      title: t('blogPost1Title') || "5 Tips for Writing Meaningful Song Lyrics",
      content: `
        <p>Writing meaningful lyrics is an art that combines storytelling, emotion, and musical sensibility. Here are five essential tips to help you craft lyrics that truly resonate with listeners.</p>
        
        <h2>1. Start with a Personal Story</h2>
        <p>The most powerful lyrics often come from personal experiences. Draw from your own life, relationships, and emotions to create authentic content that listeners can connect with.</p>
        
        <h2>2. Use Vivid Imagery</h2>
        <p>Paint pictures with your words. Instead of saying "I was sad," describe the rain on the window, the empty coffee cup, or the silence in the room. Imagery helps listeners visualize and feel your message.</p>
        
        <h2>3. Keep It Simple and Clear</h2>
        <p>The best lyrics are often the simplest. Focus on conveying one main emotion or message per song, and use language that everyone can understand.</p>
        
        <h2>4. Create Strong Hooks</h2>
        <p>Your chorus should be memorable and easy to sing along with. It's the part people will remember most, so make it count.</p>
        
        <h2>5. Edit Ruthlessly</h2>
        <p>Great lyrics are rewritten, not just written. Don't be afraid to cut lines that don't serve the song's purpose, even if you love them individually.</p>
      `,
      image: "/uploads/65518432-abfe-42fc-acc5-25014d321134.png",
      category: t('categoryTips') || "Music Tips",
      date: "2024-06-18",
      author: "Maria Popescu",
      readTime: "7 min"
    },
    "3": {
      title: t('blogPost2Title') || "Behind the Scenes: Our Music Production Process",
      content: `
        <p>Ever wondered how we transform your ideas into a fully produced personalized song? Take a behind-the-scenes look at our comprehensive music production process.</p>
        
        <h2>Step 1: Story Collection</h2>
        <p>Everything begins with your story. Our team conducts detailed interviews to understand the emotions, memories, and messages you want to capture in your song.</p>
        
        <h2>Step 2: Lyrical Composition</h2>
        <p>Our experienced songwriters craft lyrics that weave your personal elements into a cohesive, emotionally resonant narrative. This process typically takes 2-3 days of careful refinement.</p>
        
        <h2>Step 3: Musical Arrangement</h2>
        <p>We select the perfect musical style and instrumentation to complement your story. Whether it's a gentle acoustic ballad or an upbeat pop anthem, the music serves your message.</p>
        
        <h2>Step 4: Recording and Production</h2>
        <p>Our professional vocalists and musicians bring your song to life in our state-of-the-art recording studio. We pay attention to every detail, from vocal performance to instrumental balance.</p>
        
        <h2>Step 5: Final Review and Delivery</h2>
        <p>Before delivery, we ensure every element meets our high standards. You receive your personalized song in high-quality formats, ready to be shared and treasured.</p>
      `,
      image: "/uploads/a83ec5e1-01f2-4010-9224-fb7860ad66be.png",
      category: t('categoryBehindScenes') || "Behind the Scenes",
      date: "2024-06-15",
      author: "Alex Ionescu",
      readTime: "6 min"
    },
    "4": {
      title: t('blogPost3Title') || "The Psychology of Music: Why Songs Move Us",
      content: `
        <p>Music has an extraordinary ability to evoke emotions, trigger memories, and create lasting impressions. Understanding the psychology behind this phenomenon helps us create more impactful personalized songs.</p>
        
        <h2>The Neurological Response to Music</h2>
        <p>When we hear music, our brains release dopamine, the same neurotransmitter associated with pleasure from food, love, and other rewarding experiences. This chemical response explains why certain songs can instantly lift our mood.</p>
        
        <h2>Memory and Musical Association</h2>
        <p>Music and memory are deeply interconnected. The hippocampus, which processes both music and memories, creates strong associations between songs and life experiences. This is why hearing a particular song can instantly transport us back to a specific moment in time.</p>
        
        <h2>Emotional Contagion in Music</h2>
        <p>Humans have an innate ability to "catch" emotions from music, similar to how we mirror emotions in social interactions. This emotional contagion is why personalized songs can be so powerful in conveying feelings between people.</p>
        
        <h2>The Role of Lyrics vs. Melody</h2>
        <p>While melodies can evoke emotions universally, lyrics add a layer of personal meaning. In personalized music, we carefully balance both elements to create maximum emotional impact.</p>
      `,
      image: "/uploads/b8d4dbea-6ce1-4368-b11c-47cbc1ea1ba0.png",
      category: t('categoryIndustry') || "Industry Insights",
      date: "2024-06-12",
      author: "Dr. Cristina Radu",
      readTime: "8 min"
    },
    "5": {
      title: t('blogPost4Title') || "Client Spotlight: A Wedding Song That Changed Everything",
      content: `
        <p>Sometimes a single song can transform an entire event. This is the story of how one personalized wedding song created an unforgettable moment that the couple still talks about years later.</p>
        
        <h2>The Challenge</h2>
        <p>Maria and Alexandru came to us just three weeks before their wedding. They wanted something special for their first dance but felt that traditional wedding songs didn't capture their unique love story.</p>
        
        <h2>The Story Behind the Song</h2>
        <p>During our consultation, we learned about their unconventional meeting at a book club, their shared love of poetry, and how Alexandru proposed using lines from Maria's favorite poem. These elements became the foundation of their song.</p>
        
        <h2>The Creation Process</h2>
        <p>We incorporated references to the book that brought them together, musical phrases that echoed the rhythm of the poem, and a melody that built from gentle intimacy to soaring celebration - mirroring their relationship journey.</p>
        
        <h2>The Wedding Day</h2>
        <p>When their personalized song began playing, guests immediately noticed something was different. As the familiar references to their story unfolded, there wasn't a dry eye in the room. The couple later told us it was the moment their wedding truly became their own.</p>
        
        <h2>The Lasting Impact</h2>
        <p>Two years later, Maria and Alexandru still play their song on anniversaries, and they've shared it with other couples as an example of how personal music can transform special moments.</p>
      `,
      image: "/uploads/c8247b19-53ef-4926-888f-4d4fd609e783.png",
      category: t('categoryStories') || "Client Stories",
      date: "2024-06-10",
      author: "MusicGift Team",
      readTime: "4 min"
    },
    "6": {
      title: t('blogPost5Title') || "Trending Music Styles for 2024 Gifts",
      content: `
        <p>Musical trends are constantly evolving, and 2024 has brought some exciting developments in the world of personalized music gifts. Here's what's trending this year.</p>
        
        <h2>Acoustic Storytelling</h2>
        <p>There's been a significant shift toward more intimate, acoustic arrangements. Clients are requesting songs that feel like personal conversations, with simple instrumentation that lets the lyrics and emotions shine through.</p>
        
        <h2>Genre Fusion</h2>
        <p>We're seeing more requests for songs that blend multiple genres - perhaps jazz vocals over a pop beat, or folk lyrics with electronic elements. This fusion approach allows for more personalized expression.</p>
        
        <h2>Vintage Vibes with Modern Production</h2>
        <p>Many clients want the warmth and nostalgia of vintage music styles but with contemporary production quality. Think 70s soul meets modern recording techniques.</p>
        
        <h2>Multilingual Compositions</h2>
        <p>With our diverse clientele, we're creating more songs that incorporate multiple languages, reflecting the multicultural nature of modern relationships and families.</p>
        
        <h2>Minimalistic Arrangements</h2>
        <p>Less is more in 2024. Clients prefer songs with space to breathe, where each instrument and vocal line has room to make an impact.</p>
        
        <h2>Interactive Elements</h2>
        <p>Some clients are requesting songs with interactive elements - perhaps sections where family members can add their own vocals, or instrumental breaks designed for dancing.</p>
      `,
      image: "/uploads/e923f28a-a040-43f3-a749-31a8b2e479b3.png",
      category: t('categoryTrends') || "Trends",
      date: "2024-06-08",
      author: "Andrei Toma",
      readTime: "5 min"
    }
  };

  const post = blogPosts[id as keyof typeof blogPosts];

  if (!post) {
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
        title={`${post.title} - MusicGift.ro Blog`}
        description={post.content.substring(3, 160).replace(/<[^>]*>/g, '') + '...'}
        url={`https://www.musicgift.ro/blog/${id}`}
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
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {post.readTime} {t('read') || 'read'}
                  </div>
                </div>
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-xl"
                />
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

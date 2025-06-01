import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslations';
import { Gift, Heart, Users, Crown, Sparkles, Diamond, Car, Briefcase, Building, Mic, Music, RotateCcw, FileMusic, Star, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const scenarios = [
// Personal Package scenarios
{
  icon: Gift,
  text: "Make their birthday legendary! A personalized song hits deeper than any gift card ever could. Give them something they'll treasure forever!",
  packageKey: 'personalPackage'
}, {
  icon: Heart,
  text: "Pop the question with a melody that'll make her cry happy tears! Your love story deserves its own soundtrack. Create the perfect proposal song today!",
  packageKey: 'personalPackage'
}, {
  icon: Users,
  text: "Turn your love story into a chart-topper! Celebrate your journey with a custom song that captures every beautiful moment. Your relationship deserves this!",
  packageKey: 'personalPackage'
}, {
  icon: Crown,
  text: "Mom gave you life - give her a song that celebrates it! Show her she's your hero with a personalized melody that'll make her heart sing.",
  packageKey: 'personalPackage'
},
// Premium Package scenarios
{
  icon: Sparkles,
  text: "Your wedding deserves Hollywood-level production! Create a premium musical masterpiece that'll have your guests in tears. This is your moment - make it unforgettable!",
  packageKey: 'premiumPackage'
}, {
  icon: Diamond,
  text: "When ordinary gifts won't cut it, music speaks volumes! Premium quality for premium moments. Invest in memories that last a lifetime!",
  packageKey: 'premiumPackage'
},
// Business Package scenarios
{
  icon: Car,
  text: "Rev up your success with a custom anthem! Your new ride deserves a soundtrack as smooth as your drive. Celebrate your achievement in style!",
  packageKey: 'businessPackage'
}, {
  icon: Briefcase,
  text: "Success sounds better with your own theme song! Mark this milestone with music that motivates. Your achievements deserve a soundtrack!",
  packageKey: 'businessPackage'
}, {
  icon: Building,
  text: "Every great brand needs its anthem! Stand out from the competition with a custom business song that gets stuck in your customers' heads.",
  packageKey: 'businessPackage'
},
// Artist Package scenarios
{
  icon: Mic,
  text: "Ready to level up your sound? Partner with professionals who understand your vision. Transform your musical dreams into reality!",
  packageKey: 'artistPackage'
}, {
  icon: Music,
  text: "Your talent deserves professional production! Create music that showcases your unique voice. Let's make your artistic vision come alive!",
  packageKey: 'artistPackage'
},
// Remix Package scenarios
{
  icon: RotateCcw,
  text: "Give your favorite song a fresh new vibe! Transform any track into your personal anthem. Breathe new life into the music you love!",
  packageKey: 'remixPackage'
},
// Instrumental Package scenarios
{
  icon: FileMusic,
  text: "Create the perfect soundtrack for your content! Professional instrumentals that elevate any project. Music that moves your audience!",
  packageKey: 'instrumentalPackage'
},
// Gift Package scenarios
{
  icon: Star,
  text: "Some moments need their own soundtrack! For any celebration, surprise, or 'just because' moment. Music makes everything more magical!",
  packageKey: 'giftPackage'
}, {
  icon: Package,
  text: "Stuck on gift ideas? Music never goes out of style! Give them something truly unique that shows you care. The gift that keeps on giving!",
  packageKey: 'giftPackage'
}];
const ScenarioHero = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const {
    t
  } = useLanguage();
  const {
    t: tDb
  } = useTranslation();
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % scenarios.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const {
    icon: IconComponent,
    text,
    packageKey
  } = scenarios[index];
  return <section className="relative h-30 overflow-hidden" style={{
    backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content container with professional layout */}
      <div className="relative z-10 h-full flex items-center justify-between max-w-7xl mx-auto px-8 py-[6px]">
        
        {/* Left side - Icon and package name */}
        

        {/* Center - Main message */}
        <motion.div className={`flex-1 max-w-2xl mx-8 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.1
      }}>
          
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.6,
        delay: 0.3
      }} className="flex flex-col sm:flex-row gap-3 sm:gap-4 ml-8 mx-0">
          <Link to="/packages">
            <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 font-semibold px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-lg">
              {t('seePackages') || 'See Packages'}
            </Button>
          </Link>
          <Link to="/testimonials">
            <Button size="lg" variant="outline" className="border-2 border-purple-300 text-purple-100 hover:bg-purple-500/20 hover:text-white px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-lg bg-transparent">
              {t('listenToSamples') || 'Listen to Samples'}
            </Button>
          </Link>
        </motion.div>

        {/* Right side - Professional accent */}
        <motion.div className="hidden lg:flex items-center space-x-3" initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          <div className="text-right">
            <div className="text-xs text-purple-200 font-medium uppercase tracking-wider">
              Since 2024
            </div>
            <div className="text-xs text-gray-400">
              Trusted by 1000+ clients
            </div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="flex flex-col space-y-1">
            {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{
            animationDelay: `${i * 0.3}s`
          }} />)}
          </div>
        </motion.div>
      </div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
    </section>;
};
export default ScenarioHero;
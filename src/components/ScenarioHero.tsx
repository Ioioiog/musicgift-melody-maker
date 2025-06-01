import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslations';
import { Gift, Heart, Users, Crown, Sparkles, Diamond, Car, Briefcase, Building, Mic, Music, RotateCcw, FileMusic, Star, Package, Cake, HeartHandshake, UserCheck, PartyPopper, Award, TrendingUp, Headphones, Volume2, Shuffle } from 'lucide-react';

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
      setFade(false); // Start fade-out

      setTimeout(() => {
        setIndex(prev => (prev + 1) % scenarios.length);
        setFade(true); // Fade in new content
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const {
    icon: IconComponent,
    text,
    packageKey
  } = scenarios[index];
  return <section className="py-12 text-white relative overflow-hidden" style={{
    backgroundImage: `url('/lovable-uploads/c84c3950-498f-4375-9214-40fe7004aa5f.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }}>
          <div className="flex justify-center mb-6">
            <IconComponent size={80} className="text-white drop-shadow-lg md:w-20 md:h-20 lg:w-24 lg:h-24" />
          </div>
          <motion.h1 className="text-3xl md:text-5xl font-bold mb-4" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            {tDb(packageKey)}
          </motion.h1>
          <motion.p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            {text}
          </motion.p>
        </motion.div>
      </div>
    </section>;
};
export default ScenarioHero;

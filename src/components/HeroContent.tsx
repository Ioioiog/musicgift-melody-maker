
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Gift, Music } from 'lucide-react';

const scenarios = [{
  emoji: '🎂',
  text: "Is it someone special's birthday? Celebrate with lyrics, not just cake!"
}, {
  emoji: '💍',
  text: 'Got big plans? Surprise her with a sung proposal.'
}, {
  emoji: '💑',
  text: 'Years together? Hit play on your love story.'
}, {
  emoji: '👩‍👧',
  text: 'Your mom deserves more than just flowers.'
}, {
  emoji: '👰',
  text: "Want your wedding to stay in the heart's playlist?"
}, {
  emoji: '🚗',
  text: "Just got a new car? Let's start it with rhythm."
}, {
  emoji: '🧑‍💼',
  text: 'Started a new job? Celebrate in style!'
}, {
  emoji: '✨',
  text: 'And for any other "wow!" moment in life – we put it to music.'
}];

const HeroContent = () => {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

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

  const { emoji, text } = scenarios[index];

  return (
    <>
      <section className="py-20 px-4 text-white relative overflow-hidden" style={{
        backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto text-center animate-fade-in relative z-10">
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mobile-button-spacing">
            <Link to="/packages">
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                <Gift className="w-5 h-5 mr-2" />
                {t('seePackages')}
              </Button>
            </Link>
            <Link to="/testimonials">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                <Music className="w-5 h-5 mr-2" />
                {t('listenToSamples')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Scenario Banner Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white mx-0 px-0 py-[37px]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-6xl md:text-8xl mb-6 scenario-emoji">{emoji}</div>
            <p className="text-xl md:text-2xl opacity-90 scenario-message max-w-3xl mx-auto leading-relaxed">
              {text}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroContent;

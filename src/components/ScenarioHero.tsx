
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslations';

const scenarios = [
  { emoji: '🎂', text: "Is it someone special's birthday? Celebrate with lyrics, not just cake!", packageKey: 'personalPackage' },
  { emoji: '💍', text: 'Got big plans? Surprise her with a sung proposal.', packageKey: 'personalPackage' },
  { emoji: '💑', text: 'Years together? Hit play on your love story.', packageKey: 'personalPackage' },
  { emoji: '👩‍👧', text: 'Your mom deserves more than just flowers.', packageKey: 'personalPackage' },
  { emoji: '👰', text: "Want your wedding to stay in the heart's playlist?", packageKey: 'premiumPackage' },
  { emoji: '🚗', text: "Just got a new car? Let's start it with rhythm.", packageKey: 'businessPackage' },
  { emoji: '🧑‍💼', text: 'Started a new job? Celebrate in style!', packageKey: 'businessPackage' },
  { emoji: '✨', text: 'And for any other "wow!" moment in life – we put it to music.', packageKey: 'giftPackage' }
];

const ScenarioHero = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const { t } = useLanguage();
  const { t: tDb } = useTranslation();

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

  const { emoji, text, packageKey } = scenarios[index];

  return (
    <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div 
          className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl md:text-8xl mb-6">
            {emoji}
          </div>
          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {tDb(packageKey)}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {text}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default ScenarioHero;

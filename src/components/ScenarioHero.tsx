
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const scenarios = [
  { emoji: '🎂', text: "Is it someone special's birthday? Celebrate with lyrics, not just cake!" },
  { emoji: '💍', text: 'Got big plans? Surprise her with a sung proposal.' },
  { emoji: '💑', text: 'Years together? Hit play on your love story.' },
  { emoji: '👩‍👧', text: 'Your mom deserves more than just flowers.' },
  { emoji: '👰', text: "Want your wedding to stay in the heart's playlist?" },
  { emoji: '🚗', text: "Just got a new car? Let's start it with rhythm." },
  { emoji: '🧑‍💼', text: 'Started a new job? Celebrate in style!' },
  { emoji: '✨', text: 'And for any other "wow!" moment in life – we put it to music.' }
];

const ScenarioHero = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const { t } = useLanguage();

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
            {t('packagesTitle')}
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

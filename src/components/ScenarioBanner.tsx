
import { useEffect, useState } from 'react';

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

const ScenarioBanner = () => {
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

  const {
    emoji,
    text
  } = scenarios[index];

  return <div className="w-full bg-gradient-to-r from-[#f0f4ff] to-[#e6eaff] text-center rounded-lg shadow-md min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex flex-col justify-center items-center px-4">
      <div className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-6xl md:text-7xl lg:text-8xl mb-6 scenario-emoji">{emoji}</div>
        <p className="text-xl md:text-2xl lg:text-3xl font-medium scenario-message max-w-4xl mx-auto leading-relaxed">
          {text}
        </p>
      </div>
    </div>;
};

export default ScenarioBanner;

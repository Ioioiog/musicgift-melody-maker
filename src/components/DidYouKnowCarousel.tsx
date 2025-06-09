
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Autoplay from 'embla-carousel-autoplay';

interface DidYouKnowFact {
  title: string;
  description: string;
}

interface DidYouKnowCarouselProps {
  facts: DidYouKnowFact[];
}

const DidYouKnowCarousel = ({ facts }: DidYouKnowCarouselProps) => {
  const { t } = useLanguage();
  
  const plugin = React.useRef(
    Autoplay({ 
      delay: 4000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true 
    })
  );

  if (!facts || facts.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
          {t('didYouKnow', 'Did You Know?')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="px-12">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {facts.map((fact, index) => (
                <CarouselItem key={index} className="basis-full">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 min-h-[120px] flex flex-col justify-center">
                    <h4 className="font-semibold text-white mb-2">{fact.title}</h4>
                    <p className="text-white/80 text-sm leading-relaxed">{fact.description}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-6 bg-white/10 border-white/20 text-white hover:bg-white/20" />
            <CarouselNext className="-right-6 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          </Carousel>
        </div>
        
        {/* Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {facts.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-white/30 opacity-50"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DidYouKnowCarousel;

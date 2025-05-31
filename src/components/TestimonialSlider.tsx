
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslations";

const testimonials = [
  {
    name: "Ana M.",
    location: "București",
    videoUrl: "https://www.youtube.com/embed/Abk3kceKgP4",
    reviewKey: "testimonial_ana_review",
  },
  {
    name: "Nati G.",
    location: "Cluj-Napoca",
    videoUrl: "https://www.youtube.com/embed/guBBAoM-dZQ",
    reviewKey: "testimonial_nati_review",
  },
  {
    name: "TechCorp",
    location: "Timișoara",
    videoUrl: "https://www.youtube.com/embed/b_2CFQztmww",
    reviewKey: "testimonial_techcorp_review",
  },
  {
    name: "Maria P.",
    location: "Iași",
    videoUrl: "https://www.youtube.com/embed/b-NYGzKSBiE",
    reviewKey: "testimonial_maria_review",
  },
  {
    name: "Alex R.",
    location: "Brașov",
    videoUrl: "https://www.youtube.com/embed/aZMaYjnKLHA",
    reviewKey: "testimonial_alex_review",
  },
];

export default function TestimonialSlider() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-800">
            {t("testimonials_title", "What Our Customers Say")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("testimonials_subtitle", "Real testimonials from satisfied customers who love their personalized songs")}
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative pb-[56.25%] group">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={testimonial.videoUrl}
                      allowFullScreen
                      loading="lazy"
                      title={t("video_testimonial_title", `Video testimonial from ${testimonial.name}`, { name: testimonial.name })}
                    />
                  </div>
                  <div className="p-4 md:p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3 text-purple-600 font-semibold">
                      <h4 className="text-lg">{testimonial.name}</h4>
                      <FaCheckCircle className="text-purple-500 text-sm" />
                    </div>
                    <div className="flex justify-center text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-sm" />
                      ))}
                    </div>
                    <p className="text-sm italic text-gray-700 mb-2 leading-relaxed">
                      "{t(testimonial.reviewKey, `Review from ${testimonial.name}`)}"
                    </p>
                    <span className="block text-xs text-gray-500 font-medium">
                      {testimonial.location}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {!isMobile && (
            <>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}

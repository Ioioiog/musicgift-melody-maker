
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslations";

export default function TestimonialSlider() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const testimonials = [
    {
      name: t("testimonial1Name"),
      location: t("testimonial1Location"),
      videoUrl: "https://www.youtube.com/embed/Abk3kceKgP4",
      review: t("testimonial1Review"),
    },
    {
      name: t("testimonial2Name"),
      location: t("testimonial2Location"),
      videoUrl: "https://www.youtube.com/embed/guBBAoM-dZQ",
      review: t("testimonial2Review"),
    },
    {
      name: t("testimonial3Name"),
      location: t("testimonial3Location"),
      videoUrl: "https://www.youtube.com/embed/b_2CFQztmww",
      review: t("testimonial3Review"),
    },
    {
      name: t("testimonial4Name"),
      location: t("testimonial4Location"),
      videoUrl: "https://www.youtube.com/embed/b-NYGzKSBiE",
      review: t("testimonial4Review"),
    },
    {
      name: t("testimonial5Name"),
      location: t("testimonial5Location"),
      videoUrl: "https://www.youtube.com/embed/aZMaYjnKLHA",
      review: t("testimonial5Review"),
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-800">
            {t("testimonialsTitle")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("testimonialsSubtitle")}
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
                      title={`Video testimonial from ${testimonial.name}`}
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
                      "{testimonial.review}"
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

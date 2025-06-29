import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Star, Quote } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
const TestimonialsByLocationSection = () => {
  const {
    t,
    language
  } = useLanguage();
  const getTestimonialsByLocation = () => {
    // Filter approved testimonials with locations
    const approvedWithLocation = testimonials.filter(testimonial => testimonial.approved && testimonial.location && testimonial.location.trim());

    // Group by location and select best testimonials for each city
    const locationGroups = approvedWithLocation.reduce((acc, testimonial) => {
      const location = testimonial.location.trim();
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(testimonial);
      return acc;
    }, {} as Record<string, typeof testimonials>);

    // Get the best testimonial for each location (highest rated, then most recent)
    const locationTestimonials = Object.entries(locationGroups).map(([location, testimonials]) => {
      const bestTestimonial = testimonials.sort((a, b) => {
        if (b.stars !== a.stars) return b.stars - a.stars;
        return b.display_order - a.display_order;
      })[0];
      return {
        location,
        testimonial: bestTestimonial,
        totalCount: testimonials.length
      };
    });

    // Sort by number of testimonials and star rating
    return locationTestimonials.sort((a, b) => {
      if (b.totalCount !== a.totalCount) return b.totalCount - a.totalCount;
      return b.testimonial.stars - a.testimonial.stars;
    }).slice(0, 8); // Show top 8 locations
  };
  const locationTestimonials = getTestimonialsByLocation();
  const truncateMessage = (message: string, maxLength: number = 120) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength).trim() + '...';
  };
  const getRegionForLocation = (location: string) => {
    const regions: Record<string, string> = {
      'Bucuresti': 'Capitala României',
      'București': 'Capitala României',
      'Cluj-Napoca': 'Transilvania',
      'Timisoara': 'Banat',
      'Timișoara': 'Banat',
      'Iași': 'Moldova',
      'Constanța': 'Dobrogea',
      'Constanta': 'Dobrogea',
      'Galați': 'Moldova',
      'Craiova': 'Oltenia',
      'Brașov': 'Transilvania',
      'Brasov': 'Transilvania',
      'Lyon': 'France',
      'Vancouver': 'Canada'
    };
    return regions[location] || location;
  };
  if (locationTestimonials.length === 0) {
    return null;
  }
  return <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-200 mb-12">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {t('happyCustomersFromCities', 'Happy Customers from Cities We Serve')}
        </CardTitle>
        <p className="text-gray-600 mt-2">
          {t('realTestimonialsFromCustomers', 'Real testimonials from satisfied customers across different locations')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locationTestimonials.map((item, index) => <div key={index} className="bg-white/80 rounded-lg p-5 hover:bg-white/95 transition-colors border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 voice-search-content">
                    {item.location}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {getRegionForLocation(item.location)}
                  </p>
                  {item.totalCount > 1 && <p className="text-xs text-blue-600 font-medium">
                      {item.totalCount} {t('happyCustomers', 'happy customers')}
                    </p>}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-1 mb-2">
                  <Quote className="w-3 h-3 text-gray-400" />
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < item.testimonial.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                  </div>
                </div>
                <p className="text-sm text-gray-700 voice-search-content faq-answer italic">
                  "{truncateMessage(item.testimonial.message)}"
                </p>
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  - {item.testimonial.name}
                </p>
                {item.testimonial.context && <p className="text-xs text-blue-600 mt-1">
                    {truncateMessage(item.testimonial.context, 80)}
                  </p>}
              </div>
              
              {item.testimonial.youtube_link && <div className="text-center">
                  <a href={item.testimonial.youtube_link} target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 hover:text-red-700 underline">
                    {t('watchVideo', 'Watch Video')}
                  </a>
                </div>}
            </div>)}
        </div>
        
        <div className="text-center mt-8">
          <a href="/testimonials" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Star className="w-4 h-4" />
            {t('viewAllTestimonials', 'View All Testimonials')}
          </a>
        </div>
      </CardContent>
    </Card>;
};
export default TestimonialsByLocationSection;
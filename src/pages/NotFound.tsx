
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // SEO Meta Tags for 404 page
  usePageMeta({
    title_en: "Page Not Found | MusicGift",
    title_ro: "Pagina Nu Există | MusicGift",
    description_en: "The page you're looking for doesn't exist. Return to MusicGift homepage to explore our personalized music services.",
    description_ro: "Pagina pe care o cauți nu există. Întoarce-te la pagina principală MusicGift pentru a explora serviciile noastre de muzică personalizată.",
    keywords_en: "404, page not found, musicgift",
    keywords_ro: "404, pagina nu există, musicgift"
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('pageNotFound')}</h2>
            <p className="text-xl text-gray-600 mb-8">{t('pageNotFoundDesc')}</p>
            <Link 
              to="/" 
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              {t('returnHome')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFound;

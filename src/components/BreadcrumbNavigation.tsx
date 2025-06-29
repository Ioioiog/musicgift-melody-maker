
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BreadcrumbNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  // Don't show breadcrumbs on homepage
  if (pathSegments.length === 0) return null;
  
  const breadcrumbItems = [
    { name: t('home', 'Acasă'), path: '/' },
    ...pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = getBreadcrumbName(segment, t);
      return { name, path };
    })
  ];

  // Generate structured data for breadcrumbs
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://www.musicgift.ro${item.path}`
    }))
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </script>
      
      <nav aria-label="Breadcrumb" className="py-2 px-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <ol className="flex items-center space-x-2 text-sm max-w-6xl mx-auto">
          {breadcrumbItems.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
              
              {index === 0 ? (
                <Link 
                  to={item.path} 
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label="Pagina principală"
                >
                  <Home className="w-4 h-4 mr-1" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              ) : index === breadcrumbItems.length - 1 ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link 
                  to={item.path}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

const getBreadcrumbName = (segment: string, t: any): string => {
  const breadcrumbMap: Record<string, string> = {
    'packages': t('packages', 'Pachete'),
    'order': t('order', 'Comandă'),
    'gift': t('gift', 'Card Cadou'),
    'about': t('about', 'Despre Noi'),
    'contact': t('contact', 'Contact'),
    'testimonials': t('testimonials', 'Mărturii'),
    'how-it-works': t('howItWorks', 'Cum Funcționează'),
    'personal': t('personalPackage', 'Pachet Personal'),
    'premium': t('premiumPackage', 'Pachet Premium'),
    'wedding': t('weddingPackage', 'Pachet Nuntă'),
    'faq': t('faq', 'Întrebări Frecvente')
  };
  
  return breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
};

export default BreadcrumbNavigation;

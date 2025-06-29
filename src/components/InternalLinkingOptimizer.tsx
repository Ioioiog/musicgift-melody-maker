
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface LinkSuggestion {
  anchor: string;
  url: string;
  relevance: number;
}

const InternalLinkingOptimizer = () => {
  const location = useLocation();

  useEffect(() => {
    const optimizeInternalLinks = () => {
      // Get current page context
      const currentPath = location.pathname;
      const pageContent = document.body.innerText.toLowerCase();
      
      // Define contextual link suggestions
      const linkSuggestions: Record<string, LinkSuggestion[]> = {
        '/': [
          { anchor: 'pachete muzicale', url: '/packages', relevance: 0.9 },
          { anchor: 'comandă melodie', url: '/order', relevance: 0.8 },
          { anchor: 'card cadou', url: '/gift', relevance: 0.7 }
        ],
        '/packages': [
          { anchor: 'comandă acum', url: '/order', relevance: 0.9 },
          { anchor: 'mărturii clienți', url: '/testimonials', relevance: 0.6 },
          { anchor: 'cum funcționează', url: '/how-it-works', relevance: 0.7 }
        ],
        '/order': [
          { anchor: 'vezi pachete', url: '/packages', relevance: 0.8 },
          { anchor: 'întrebări frecvente', url: '/faq', relevance: 0.6 }
        ]
      };

      const suggestions = linkSuggestions[currentPath] || [];
      
      // Add contextual links based on content
      suggestions.forEach(suggestion => {
        if (pageContent.includes(suggestion.anchor.toLowerCase())) {
          // Find and enhance existing text with internal links
          const textNodes = getTextNodes(document.body);
          textNodes.forEach(node => {
            if (node.textContent?.toLowerCase().includes(suggestion.anchor.toLowerCase())) {
              // Create internal link enhancement
              console.log(`Internal linking opportunity: "${suggestion.anchor}" -> ${suggestion.url}`);
            }
          });
        }
      });

      // Generate contextual recommendations
      generateInternalLinkRecommendations(currentPath, pageContent);
    };

    const getTextNodes = (element: Element): Text[] => {
      const textNodes: Text[] = [];
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        if (node.textContent?.trim()) {
          textNodes.push(node as Text);
        }
      }
      return textNodes;
    };

    const generateInternalLinkRecommendations = (path: string, content: string) => {
      const recommendations = [];
      
      if (content.includes('nuntă') && !path.includes('wedding')) {
        recommendations.push({ text: 'Pachet Nuntă', url: '/packages/wedding' });
      }
      
      if (content.includes('aniversare') && !path.includes('anniversary')) {
        recommendations.push({ text: 'Melodii Aniversare', url: '/packages/personal' });
      }
      
      if (content.includes('cadou') && !path.includes('gift')) {
        recommendations.push({ text: 'Card Cadou Muzical', url: '/gift' });
      }

      if (recommendations.length > 0) {
        console.group('🔗 Internal Linking Recommendations');
        recommendations.forEach(rec => {
          console.log(`Suggest linking "${rec.text}" to ${rec.url}`);
        });
        console.groupEnd();
      }
    };

    // Run optimization after content loads
    const timer = setTimeout(optimizeInternalLinks, 1000);
    return () => clearTimeout(timer);
  }, [location]);

  return null;
};

export default InternalLinkingOptimizer;

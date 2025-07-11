
import React from 'react';
import NTPLogo from 'ntp-logo-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

const LegalCompliance = () => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 lg:gap-4">
      {/* ANPC Consumer Protection */}
      <div className="space-y-1">
        <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider text-center md:text-left">
          {t('consumerProtection')}
        </h4>
        <div className="space-y-1">
          <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity duration-300 hover:scale-105 min-h-[80px] flex items-center justify-center">
            <img src="/uploads/anpc.webp" alt="Soluționarea alternativă a litigiilor - ANPC" className="max-w-[120px] max-h-[80px] w-auto h-full hover:opacity-90 transition object-fill" />
          </a>
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity duration-300 hover:scale-105 min-h-[80px] flex items-center justify-center">
            <img src="/uploads/e923f28a-a040-43f3-a749-31a8b2e479b3.png" alt={t('onlineDisputeResolution')} className="max-w-[120px] max-h-[60px] w-full h-auto hover:opacity-90 transition object-fill" />
          </a>
        </div>
      </div>

      {/* Payment Partners - Now includes NTP */}
      <div className="space-y-1">
        <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider text-center md:text-left">
          {t('paymentPartners')}
        </h4>
        <div className="space-y-1">
          <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:opacity-80 transition-opacity duration-300 hover:scale-105 min-h-[40px]">
            <img src="/uploads/a83ec5e1-01f2-4010-9224-fb7860ad66be.png" alt="Stripe" className="max-w-[60px] max-h-[30px] w-full h-auto hover:opacity-80 transition object-fill" />
          </a>
          <div className="relative flex items-center justify-center hover:opacity-80 transition-opacity duration-300 hover:scale-105 min-h-[40px]">
            <img alt="Revolut Business" src="/uploads/e0dec0a1-3977-42e6-a9fa-9addebc53ead.png" className="max-w-[60px] max-h-[30px] w-full h-auto hover:opacity-80 transition object-fill" />
            <Badge className="absolute -top-1 -right-1 text-white text-xs px-1 py-0.5 bg-stone-950">
              Coming Soon
            </Badge>
          </div>
          <div className="flex items-center justify-center hover:opacity-80 transition-opacity duration-300 hover:scale-105 min-h-[40px]">
            <div className="max-w-[60px] max-h-[30px] flex items-center justify-center">
              <NTPLogo color="#ffffff" version="orizontal" secret="152227" />
            </div>
          </div>
        </div>
      </div>

      {/* Business Partners Section - Moved after Payment Partners */}
      <div className="space-y-1">
        <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider text-center md:text-left">
          {t('businessPartners')}
        </h4>
        <div className="space-y-1">
          <a href="https://www.billionareboysclub.ro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:opacity-80 transition-opacity duration-300 hover:scale-105 min-h-[40px]">
            <img src="/uploads/bilionnaire.webp" alt="Billionaire Boys Club" className="max-w-[60px] max-h-[30px] w-full h-auto hover:opacity-80 transition object-fill" />
          </a>
          <a href="https://www.mgnews.ro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:opacity-80 transition-opacity duration-300 hover:scale-105 min-h-[40px]">
            <img src="/uploads/mgnews.webp" alt="MG News" className="max-w-[60px] max-h-[30px] w-full h-auto hover:opacity-80 transition object-fill" />
          </a>
          <a href="https://www.evonews.ro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:opacity-80 transition-opacity duration-300 hover:scale-105 min-h-[40px]">
            <img src="/uploads/e48515de-2c58-4a30-819d-fa1862f6373f.png" alt="Evo News" className="max-w-[60px] max-h-[30px] w-full h-auto hover:opacity-80 transition object-fill" />
          </a>
        </div>
      </div>

      {/* Empty fourth column for future use */}
      <div className="space-y-1">
        {/* This column can be used for additional partners or content in the future */}
      </div>
    </div>
  );
};

export default LegalCompliance;

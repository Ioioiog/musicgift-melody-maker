import React from 'react';
import NTPLogo from 'ntp-logo-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
const LegalCompliance = () => {
  const {
    t
  } = useLanguage();
  return <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
      {/* ANPC Consumer Protection */}
      <div className="space-y-3">
        <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wider text-center md:text-left">
          {t('consumerProtection')}
        </h4>
        <div className="space-y-3">
          <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className="block bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg min-h-[100px] flex items-center justify-center px-0 py-0">
            <img src="/lovable-uploads/1f4ebed9-cee9-49a4-9585-1bbe339732a2.png" alt="Soluționarea alternativă a litigiilor - ANPC" className="max-w-[120px] max-h-[100px] w-auto h-full hover:opacity-90 transition object-fill" />
          </a>
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="block bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg min-h-[100px] flex items-center justify-center py-0 px-0">
            <img src="/lovable-uploads/e923f28a-a040-43f3-a749-31a8b2e479b3.png" alt={t('onlineDisputeResolution')} className="max-w-[120px] max-h-[60px] w-full h-auto hover:opacity-90 transition object-fill" />
          </a>
        </div>
      </div>

      {/* Payment Partners - Now includes NTP */}
      <div className="space-y-3">
        <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wider text-center md:text-left">
          {t('paymentPartners')}
        </h4>
        <div className="space-y-3">
          <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg min-h-[100px] py-0 px-0">
            <img src="/lovable-uploads/a83ec5e1-01f2-4010-9224-fb7860ad66be.png" alt="Stripe" className="max-w-[120px] max-h-[60px] w-full h-auto hover:opacity-80 transition object-fill" />
          </a>
          <div className="relative flex items-center justify-center bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg min-h-[100px] px-0 py-0">
            <img alt="Revolut Business" src="/lovable-uploads/e0dec0a1-3977-42e6-a9fa-9addebc53ead.png" className="max-w-[120px] max-h-[60px] w-full h-auto hover:opacity-80 transition object-fill" />
            <Badge className="absolute -top-2 -right-2 text-white text-xs px-2 py-1 bg-stone-950">
              Coming Soon
            </Badge>
          </div>
          <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg min-h-[100px] px-0 py-0">
            <div className="max-w-[120px] max-h-[60px] flex items-center justify-center">
              <NTPLogo color="#ffffff" version="orizontal" secret="152227" />
            </div>
          </div>
        </div>
      </div>

      {/* Business Partners Section - Moved after Payment Partners */}
      <div className="space-y-3">
        <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wider text-center md:text-left">
          {t('businessPartners')}
        </h4>
        <div className="space-y-3">
          <a href="https://www.billionareboysclub.ro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg min-h-[100px] px-0 py-0">
            <img src="/lovable-uploads/318e18fe-b529-4525-8ddf-74bb1d3a3962.png" alt="Billionaire Boys Club" className="max-w-[120px] max-h-[60px] w-full h-auto hover:opacity-80 transition object-fill" />
          </a>
          <a href="https://www.mgnews.ro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg min-h-[100px]">
            <img src="/lovable-uploads/2db89d5c-d0a3-4a0e-b17a-4969d3f1164f.png" alt="MG News" className="max-w-[120px] max-h-[60px] w-full h-auto hover:opacity-80 transition object-fill" />
          </a>
          <a href="https://www.evonews.ro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg min-h-[100px]">
            <img src="/lovable-uploads/e48515de-2c58-4a30-819d-fa1862f6373f.png" alt="Evo News" className="max-w-[120px] max-h-[60px] w-full h-auto hover:opacity-80 transition object-fill" />
          </a>
        </div>
      </div>

      {/* Empty fourth column for future use */}
      <div className="space-y-3">
        {/* This column can be used for additional partners or content in the future */}
      </div>
    </div>;
};
export default LegalCompliance;
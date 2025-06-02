
import React from 'react';
import NTPLogo from 'ntp-logo-react';

const LegalCompliance = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {/* Registered Business Section - Now empty, could be used for other content */}
      <div className="space-y-3">
        <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wider text-center md:text-left">
          Registered Business
        </h4>
        <div className="flex justify-center md:justify-start">
          <div className="bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 shadow-lg">
            <div className="text-gray-700 font-medium text-center">
              Business Registration Info
            </div>
          </div>
        </div>
      </div>

      {/* ANPC Consumer Protection */}
      <div className="space-y-3">
        <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wider text-center md:text-left">
          Consumer Protection
        </h4>
        <div className="space-y-3">
          <a
            href="https://anpc.ro/ce-este-sal/"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-3 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <img
              src="https://anpc.ro/wp-content/uploads/2021/04/sal.png"
              alt="Soluționarea alternativă a litigiilor"
              className="max-w-[160px] w-full h-auto mx-auto hover:opacity-90 transition"
            />
          </a>
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-3 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <img
              src="https://anpc.ro/wp-content/uploads/2021/04/sol.png"
              alt="Soluționarea online a litigiilor"
              className="max-w-[160px] w-full h-auto mx-auto hover:opacity-90 transition"
            />
          </a>
        </div>
      </div>

      {/* Payment Partners - Now includes NTP */}
      <div className="space-y-3">
        <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wider text-center md:text-left">
          Payment Partners
        </h4>
        <div className="space-y-3">
          <a
            href="https://stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <img
              src="https://seeklogo.com/images/S/stripe-logo-8D1337D8CE-seeklogo.com.png"
              alt="Stripe"
              className="h-8 hover:opacity-80 transition"
            />
          </a>
          <a
            href="https://www.revolut.com/business/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <img
              src="https://www.logo.wine/a/logo/Revolut/Revolut-Business-Logo.wine.svg"
              alt="Revolut Business"
              className="h-8 hover:opacity-80 transition"
            />
          </a>
          <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg">
            <NTPLogo color="#ffffff" version="orizontal" secret="152227" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalCompliance;

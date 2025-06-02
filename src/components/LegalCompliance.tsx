
import React from 'react';

const LegalCompliance = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {/* NTP Logo Section */}
      <div className="space-y-3">
        <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wider text-center md:text-left">
          Registered Business
        </h4>
        <div className="flex justify-center md:justify-start">
          <div className="bg-white/20 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 shadow-lg">
            <div className="text-gray-700 font-bold text-lg text-center">
              NTP Logo
              <div className="text-xs text-gray-600 mt-1">Registered Business</div>
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

      {/* Payment Partners */}
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
        </div>
      </div>
    </div>
  );
};

export default LegalCompliance;

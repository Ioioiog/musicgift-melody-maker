import React from 'react';
import { ArrowLeft, History as HistoryIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import UserOrderHistory from '@/components/user/UserOrderHistory';
const History = () => {
  const {
    t
  } = useLanguage();
  return <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-12">
        <div className="container max-w-6xl my-[105px] mx-[86px] px-[4px]">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backHome')}
            </Link>
            
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <HistoryIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('orderHistory')}</h1>
              <p className="text-gray-600">
                {t('viewManageOrders')}
              </p>
            </div>
          </div>

          <UserOrderHistory />
        </div>
      </div>
      <Footer />
    </>;
};
export default History;
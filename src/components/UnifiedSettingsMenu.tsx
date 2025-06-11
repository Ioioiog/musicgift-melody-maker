
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLanguage, languageNames, Language } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Check, Globe, LogOut, UserCircle, User, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import CurrencyIcon from '@/components/CurrencyIcon';

const UnifiedSettingsMenu = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { user, signOut } = useAuth();

  const languages: Language[] = ["en", "ro", "fr", "pl", "de"];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative overflow-hidden group bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 hover:border-gray-300 text-gray-700 hover:text-gray-800 transition-all duration-300 rounded-xl px-3 py-2 shadow-lg hover:shadow-xl hover:bg-white/90 flex items-center space-x-1 min-h-[40px] touch-manipulation"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white/95 backdrop-blur-md border-2 border-gray-200 shadow-2xl z-50 rounded-xl p-2 animate-in slide-in-from-top-2 duration-200"
      >
        {/* Currency Section */}
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Currency
        </div>
        <DropdownMenuItem 
          onClick={() => setCurrency('EUR')} 
          className={`hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 min-h-[40px] touch-manipulation flex items-center justify-between ${currency === 'EUR' ? "bg-gradient-to-r from-orange-100 to-orange-100 text-orange-700 font-semibold shadow-sm" : "text-gray-700"}`}
        >
          <div className="flex items-center space-x-2">
            <CurrencyIcon currency="EUR" className="w-4 h-4" />
            <span>EUR</span>
          </div>
          {currency === 'EUR' && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCurrency('RON')} 
          className={`hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 min-h-[40px] touch-manipulation flex items-center justify-between ${currency === 'RON' ? "bg-gradient-to-r from-orange-100 to-orange-100 text-orange-700 font-semibold shadow-sm" : "text-gray-700"}`}
        >
          <div className="flex items-center space-x-2">
            <CurrencyIcon currency="RON" className="w-4 h-4" />
            <span>RON</span>
          </div>
          {currency === 'RON' && <Check className="w-4 h-4" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-200 my-2" />

        {/* Language Section */}
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Language
        </div>
        {languages.map(lang => (
          <DropdownMenuItem 
            key={lang} 
            onClick={() => setLanguage(lang)} 
            className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 min-h-[40px] touch-manipulation flex items-center justify-between ${language === lang ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold shadow-sm" : "text-gray-700"}`}
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>{languageNames[lang]}</span>
            </div>
            {language === lang && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-gray-200 my-2" />

        {/* User Section */}
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Account
        </div>
        {user ? (
          <>
            <div className="px-3 py-2 text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg mx-1 mb-2 border border-gray-100">
              <div className="font-medium text-gray-800">{user.user_metadata?.full_name || 'User'}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
            <DropdownMenuItem asChild>
              <Link 
                to="/settings" 
                className="flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 transition-all duration-300 rounded-lg mx-1 text-gray-700 hover:text-blue-700 px-3 py-2 transform hover:scale-105 min-h-[40px] touch-manipulation"
              >
                <User className="w-4 h-4 mr-3" />
                <span className="font-medium">{t('accountSettings')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/history" 
                className="flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-green-50 transition-all duration-300 rounded-lg mx-1 text-gray-700 hover:text-green-700 px-3 py-2 transform hover:scale-105 min-h-[40px] touch-manipulation"
              >
                <History className="w-4 h-4 mr-3" />
                <span className="font-medium">{t('history')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleSignOut} 
              className="text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50 hover:text-red-700 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer font-medium transform hover:scale-105 min-h-[40px] touch-manipulation"
            >
              <LogOut className="w-4 h-4 mr-3" />
              {t('signOut')}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link 
              to="/auth" 
              className="flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-50 transition-all duration-300 rounded-lg mx-1 text-gray-700 hover:text-emerald-700 px-3 py-2 transform hover:scale-105 min-h-[40px] touch-manipulation"
            >
              <UserCircle className="w-4 h-4 mr-3" />
              <span className="font-medium">{t('signIn')}</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UnifiedSettingsMenu;

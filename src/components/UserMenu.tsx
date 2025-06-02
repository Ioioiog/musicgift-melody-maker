
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, LogOut, Settings, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" className="relative overflow-hidden group bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50 hover:border-emerald-300 text-gray-700 hover:text-emerald-700 transition-all duration-300 rounded-xl px-4 py-2.5 shadow-lg hover:shadow-xl hover:bg-white/90 flex items-center space-x-2">
          <UserCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{t('signIn')}</span>
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative overflow-hidden group bg-white/80 backdrop-blur-sm border-2 border-rose-200/50 hover:border-rose-300 text-gray-700 hover:text-rose-700 transition-all duration-300 rounded-xl px-4 py-2.5 shadow-lg hover:shadow-xl hover:bg-white/90 flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span className="hidden md:inline text-sm font-medium">
            {user.user_metadata?.full_name || user.email?.split('@')[0] || t('user')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md shadow-2xl border-2 border-pink-200 rounded-xl p-2 animate-in slide-in-from-top-2 duration-200">
        <div className="px-3 py-2 text-sm text-gray-600 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg mx-1 mb-2 border border-pink-100">
          <div className="font-medium text-gray-800">{user.user_metadata?.full_name || 'User'}</div>
          <div className="text-xs text-gray-500 truncate">{user.email}</div>
        </div>
        <DropdownMenuSeparator className="bg-pink-200 my-2" />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 rounded-lg mx-1 text-gray-700 hover:text-pink-700 px-3 py-2 transform hover:scale-105">
            <Settings className="w-4 h-4 mr-3" />
            <span className="font-medium">{t('accountSettings')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-pink-200 my-2" />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer font-medium transform hover:scale-105">
          <LogOut className="w-4 h-4 mr-3" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

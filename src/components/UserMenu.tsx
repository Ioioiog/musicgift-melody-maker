
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
        <Button variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-300 rounded-full px-4 py-2 font-medium shadow-md hover:shadow-lg flex items-center space-x-2">
          <UserCircle className="w-4 h-4" />
          <span>{t('signIn')}</span>
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-300 text-green-700 hover:text-green-800 transition-all duration-300 rounded-full px-4 py-2 font-medium shadow-md hover:shadow-lg flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span className="hidden md:inline">
            {user.user_metadata?.full_name || user.email?.split('@')[0] || t('user')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md shadow-xl border-2 border-green-100 rounded-xl p-1">
        <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50/50 rounded-lg mx-1 mb-1">
          {user.email}
        </div>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center cursor-pointer hover:bg-green-50 transition-colors duration-200 rounded-lg mx-1 text-gray-700 hover:text-green-700">
            <Settings className="w-4 h-4 mr-2" />
            {t('accountSettings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg mx-1">
          <LogOut className="w-4 h-4 mr-2" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

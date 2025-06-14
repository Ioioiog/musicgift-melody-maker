
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, BarChart3, Target, Settings, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CookiePreferences } from '@/hooks/useCookieConsent';

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: CookiePreferences;
  onSave: (preferences: CookiePreferences) => void;
}

const CookieSettings: React.FC<CookieSettingsProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave
}) => {
  const { t } = useLanguage();
  const [localPreferences, setLocalPreferences] = React.useState<CookiePreferences>(preferences);

  React.useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleToggle = (type: keyof CookiePreferences) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    
    setLocalPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSave = () => {
    onSave(localPreferences);
    onClose();
  };

  const cookieCategories = [
    {
      key: 'essential' as const,
      icon: Shield,
      required: true,
      description: t('cookieEssentialDesc', 'Necessary for the website to function properly. These cookies enable core functionality such as security, network management, and accessibility.')
    },
    {
      key: 'analytics' as const,
      icon: BarChart3,
      required: false,
      description: t('cookieAnalyticsDesc', 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.')
    },
    {
      key: 'marketing' as const,
      icon: Target,
      required: false,
      description: t('cookieMarketingDesc', 'Used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.')
    },
    {
      key: 'preferences' as const,
      icon: Settings,
      required: false,
      description: t('cookiePreferencesDesc', 'Enable the website to remember information that changes how it behaves, such as your preferred language or currency.')
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {t('cookieSettings', 'Cookie Settings')}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            {t('cookieSettingsDesc', 'Manage your cookie preferences. You can enable or disable different types of cookies below.')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {cookieCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.key} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <Icon className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Label className="text-sm font-semibold">
                            {t(`cookie${category.key.charAt(0).toUpperCase() + category.key.slice(1)}`, category.key)}
                          </Label>
                          {category.required && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                              {t('required', 'Required')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={localPreferences[category.key]}
                      onCheckedChange={() => handleToggle(category.key)}
                      disabled={category.required}
                      className="shrink-0"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator />

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
            {t('savePreferences', 'Save Preferences')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookieSettings;

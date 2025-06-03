import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePackages } from '@/hooks/usePackageData';
import { useLanguage } from '@/contexts/LanguageContext';

const StaticPackageManager = () => {
  const { data: packages = [], isLoading } = usePackages();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Static Package Management</h2>
        <Badge variant="secondary">Read-only view</Badge>
      </div>

      <div className="grid gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">
                    {pkg.value === 'personal' ? '🎁' : 
                     pkg.value === 'business' ? '💼' : 
                     pkg.value === 'premium' ? '🌟' : 
                     pkg.value === 'artist' ? '🎤' : 
                     pkg.value === 'instrumental' ? '🎶' : 
                     pkg.value === 'remix' ? '🔁' : '🎁'}
                  </span>
                  {t(pkg.label_key)}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{pkg.value}</Badge>
                  {pkg.tag && <Badge variant="secondary">{pkg.tag}</Badge>}
                  {pkg.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag.tag_type}</Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Price</p>
                  <p className="text-lg font-bold text-purple-600">{pkg.price} RON</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Steps</p>
                  <p className="text-lg font-semibold">{pkg.steps.length}</p>
                </div>
              </div>

              {pkg.description_key && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Description</p>
                  <p className="text-sm text-gray-700 italic">{t(pkg.description_key)}</p>
                </div>
              )}

              {pkg.includes && pkg.includes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Includes ({pkg.includes.length})</p>
                  <div className="space-y-1">
                    {pkg.includes.slice(0, 3).map((include, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">✓</span>
                        {t(include.include_key)}
                      </div>
                    ))}
                    {pkg.includes.length > 3 && (
                      <p className="text-sm text-purple-600 ml-6">+{pkg.includes.length - 3} more features</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Steps Overview</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {pkg.steps.map((step) => (
                    <div key={step.id} className="bg-gray-50 rounded p-2">
                      <p className="text-xs font-medium">Step {step.step_number}</p>
                      <p className="text-xs text-gray-600">{t(step.title_key)}</p>
                      <p className="text-xs text-purple-600">{step.fields.length} fields</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Static Package System</h3>
              <p className="text-blue-800 text-sm">
                Packages are now managed statically in the codebase at <code className="bg-blue-100 px-1 rounded">src/data/packages.ts</code>. 
                This provides better type safety, version control, and deployment consistency. To modify packages, 
                update the TypeScript file and redeploy the application.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaticPackageManager;

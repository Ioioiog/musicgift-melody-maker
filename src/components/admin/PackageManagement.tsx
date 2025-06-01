
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertCircle, Search, Package as PackageIcon, ChevronDown } from 'lucide-react';
import { usePackages } from '@/hooks/usePackageData';
import { useTranslation } from '@/hooks/useTranslations';

const PackageManagement = () => {
  const { data: packages = [], isLoading } = usePackages();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPackages = packages.filter(pkg => 
    pkg.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t(pkg.label_key).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTagColor = (tag?: string) => {
    switch (tag) {
      case 'popular': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'new': return 'bg-green-100 text-green-800';
      case 'gift': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackageIcon = (value: string) => {
    switch (value) {
      case 'personal': return '🎁';
      case 'business': return '💼';
      case 'premium': return '🌟';
      case 'artist': return '🎤';
      case 'instrumental': return '🎶';
      case 'remix': return '🔁';
      default: return '📦';
    }
  };

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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PackageIcon className="w-6 h-6" />
            Package Management
          </h2>
          <p className="text-gray-600 text-sm">View package configurations</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Static Data Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-blue-800">Static Package System</div>
            <div className="text-sm text-blue-700">
              Packages are managed via static data (packages.ts) for better type safety and deployment consistency.
            </div>
          </div>
        </div>
      </div>

      {/* Packages List */}
      <div className="space-y-4">
        {filteredPackages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchTerm ? `No packages found matching "${searchTerm}"` : 'No packages found.'}
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {filteredPackages.map((pkg) => (
              <AccordionItem key={pkg.id || pkg.value} value={pkg.value} className="border rounded-lg">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{getPackageIcon(pkg.value)}</span>
                        <div className="text-left">
                          <h3 className="text-lg font-semibold">{t(pkg.label_key)}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{pkg.price} RON</Badge>
                            <Badge variant="outline">{pkg.value}</Badge>
                            {pkg.tag && (
                              <Badge className={getTagColor(pkg.tag)}>
                                {pkg.tag}
                              </Badge>
                            )}
                            {pkg.tags?.map((tag, index) => (
                              <Badge key={index} variant="secondary">{tag.tag_type}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-6">
                      {/* Package Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Package Info</h4>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Value:</span> {pkg.value}</p>
                            <p><span className="font-medium">Price:</span> {pkg.price} RON</p>
                            {pkg.tagline_key && (
                              <p><span className="font-medium">Tagline:</span> {t(pkg.tagline_key)}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Configuration</h4>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Steps:</span> {pkg.steps.length}</p>
                            <p><span className="font-medium">Includes:</span> {pkg.includes?.length || 0}</p>
                            {pkg.delivery_time_key && (
                              <p><span className="font-medium">Delivery:</span> {t(pkg.delivery_time_key)}</p>
                            )}
                          </div>
                        </div>

                        {pkg.description_key && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Description</h4>
                            <p className="text-sm text-gray-600">{t(pkg.description_key)}</p>
                          </div>
                        )}
                      </div>

                      {/* Includes Section */}
                      {pkg.includes && pkg.includes.length > 0 && (
                        <div>
                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center space-x-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                              <span>Package Includes ({pkg.includes.length})</span>
                              <ChevronDown className="w-4 h-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {pkg.includes.map((include, index) => (
                                  <div key={index} className="flex items-center text-sm bg-green-50 p-2 rounded">
                                    <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">✓</span>
                                    {t(include.include_key)}
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      )}

                      {/* Steps Section */}
                      <div>
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center space-x-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                            <span>Form Steps ({pkg.steps.length})</span>
                            <ChevronDown className="w-4 h-4" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <div className="space-y-3">
                              {pkg.steps.map((step) => (
                                <div key={step.id} className="border rounded-lg p-4 bg-gray-50">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium">Step {step.step_number}: {t(step.title_key)}</h5>
                                    <Badge variant="outline">{step.fields.length} fields</Badge>
                                  </div>
                                  
                                  <Collapsible>
                                    <CollapsibleTrigger className="flex items-center space-x-2 text-xs text-gray-600 hover:text-gray-800">
                                      <span>View Fields</span>
                                      <ChevronDown className="w-3 h-3" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="mt-2">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {step.fields.map((field) => (
                                          <div key={field.id} className="bg-white p-2 rounded border text-xs">
                                            <div className="font-medium">{field.field_name}</div>
                                            <div className="text-gray-500">
                                              {field.field_type} {field.required && '(required)'}
                                            </div>
                                            {field.options && field.options.length > 0 && (
                                              <div className="text-purple-600">{field.options.length} options</div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Static Package System</h3>
              <p className="text-blue-800 text-sm">
                Packages are managed statically in <code className="bg-blue-100 px-1 rounded">src/data/packages.ts</code>. 
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

export default PackageManagement;

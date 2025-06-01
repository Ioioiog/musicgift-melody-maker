
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Database } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PackageCreationWizard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Package Creation Wizard</h2>
          <p className="text-gray-600">Create dynamic packages with custom forms</p>
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          The Package Creation Wizard requires additional database tables to be set up. 
          Please create the necessary package management schema first.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Database Setup Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            To use the Package Creation Wizard, you need to set up the following database tables:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li><code>package_info</code> - Store package details and pricing</li>
            <li><code>steps</code> - Define form steps for each package</li>
            <li><code>step_fields</code> - Configure form fields for each step</li>
            <li><code>field_validation</code> - Set up validation rules for fields</li>
            <li><code>field_dependencies</code> - Configure conditional field logic</li>
          </ul>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong> Create the package management database schema 
              to enable dynamic package creation and form configuration.
            </p>
          </div>

          <Button disabled className="w-full">
            Create Package (Requires Database Setup)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageCreationWizard;

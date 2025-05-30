
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Mail } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                You don't have permission to access this page. This area is restricted to administrators only.
              </p>
              
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Request Access
                  </Link>
                </Button>
              </div>
              
              <div className="pt-4 border-t text-sm text-gray-500">
                <p>If you believe this is an error, please contact your administrator.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccessDenied;

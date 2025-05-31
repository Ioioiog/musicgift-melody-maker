
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AIPackageDataProcessor from './AIPackageDataProcessor';

const AIPackageGenerator = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<{
    success: boolean;
    message: string;
    packageId?: string;
  } | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: 'Description Required',
        description: 'Please provide a package description.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedData(null);
    setProcessingResult(null);

    try {
      console.log('Calling AI generation function...');
      
      const { data, error } = await supabase.functions.invoke('generate-package-ai', {
        body: {
          input_description: description,
          input_price: price || null,
          input_delivery_time: deliveryTime || null,
        },
      });

      console.log('AI generation response:', data, error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate package');
      }

      if (!data?.success || !data?.generated_data) {
        console.error('Invalid response from AI generation:', data);
        throw new Error(data?.error || 'Invalid response from AI generation');
      }

      console.log('Successfully generated data:', data.generated_data);
      setGeneratedData(data.generated_data);
      setIsProcessing(true);

      toast({
        title: 'Package Generated',
        description: 'AI has generated the package structure. Processing data...',
      });

    } catch (error) {
      console.error('Error generating package:', error);
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate package with AI',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProcessingSuccess = (packageId: string) => {
    setIsProcessing(false);
    setProcessingResult({
      success: true,
      message: 'Package created successfully!',
      packageId,
    });
  };

  const handleProcessingError = (error: string) => {
    setIsProcessing(false);
    setProcessingResult({
      success: false,
      message: error,
    });
  };

  const resetForm = () => {
    setDescription('');
    setPrice('');
    setDeliveryTime('');
    setGeneratedData(null);
    setProcessingResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5" />
            <span>AI Package Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Package Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the music package you want to create (e.g., 'A professional mixing and mastering service for artists')"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (RON) - Optional</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 150"
                value={price}
                onChange={(e) => setPrice(e.target.value ? parseInt(e.target.value) : '')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="deliveryTime">Delivery Time - Optional</Label>
              <Input
                id="deliveryTime"
                placeholder="e.g., 3-5 days"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || isProcessing || !description.trim()}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Package
                </>
              )}
            </Button>
            
            {(generatedData || processingResult) && (
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            )}
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-600" />
              <span className="text-blue-800">Processing generated data...</span>
            </div>
          )}

          {/* Processing Result */}
          {processingResult && (
            <div className={`flex items-center p-4 rounded-lg ${
              processingResult.success 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {processingResult.success ? (
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 mr-2 text-red-600" />
              )}
              <span>{processingResult.message}</span>
              {processingResult.packageId && (
                <span className="ml-2 text-sm opacity-75">
                  (ID: {processingResult.packageId})
                </span>
              )}
            </div>
          )}

          {/* Generated Data Preview */}
          {generatedData && !isProcessing && !processingResult && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">Generated Package Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                  {JSON.stringify(generatedData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Data Processor Component */}
      {generatedData && isProcessing && (
        <AIPackageDataProcessor
          generatedData={generatedData}
          onSuccess={handleProcessingSuccess}
          onError={handleProcessingError}
        />
      )}
    </div>
  );
};

export default AIPackageGenerator;

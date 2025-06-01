
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SunoPrompt {
  title: string;
  description: string;
  prompt: string;
}

interface SunoPromptsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
}

const SunoPromptsDialog = ({ isOpen, onClose, orderData }: SunoPromptsDialogProps) => {
  const [prompts, setPrompts] = useState<SunoPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generatePrompts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-suno-prompts', {
        body: { orderData }
      });

      if (error) throw error;

      if (data.success && data.prompts) {
        setPrompts(data.prompts);
      } else {
        throw new Error('Failed to generate prompts');
      }
    } catch (error) {
      console.error('Error generating prompts:', error);
      toast({
        title: 'Error generating prompts',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard',
        description: 'Prompt has been copied to your clipboard'
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive'
      });
    }
  };

  React.useEffect(() => {
    if (isOpen && prompts.length === 0) {
      generatePrompts();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Music className="w-5 h-5 text-purple-600" />
            <span>Suno.AI Song Prompts - Order #{orderData?.id?.slice(0, 8)}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Generating AI prompts...</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Generated prompts optimized for Suno.AI music generation
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generatePrompts}
                  disabled={isLoading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>

              {prompts.map((prompt, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{prompt.title}</h3>
                      <p className="text-sm text-gray-600">{prompt.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      Variation {index + 1}
                    </Badge>
                  </div>

                  <div className="bg-gray-50 rounded-md p-3 relative">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {prompt.prompt}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(prompt.prompt)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {prompts.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">How to use these prompts:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Copy your preferred prompt variation</li>
                    <li>2. Go to Suno.AI and create a new song</li>
                    <li>3. Paste the prompt in the description field</li>
                    <li>4. Adjust any additional settings as needed</li>
                    <li>5. Generate your personalized song</li>
                  </ol>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SunoPromptsDialog;

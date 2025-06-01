
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw, Music, Edit, Save, Check, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SunoPrompt {
  title: string;
  description: string;
  lyrics: string;
  technicalTags: string;
  prompt: string;
}

interface EditablePrompt extends SunoPrompt {
  isEditing: boolean;
  editedTitle: string;
  editedDescription: string;
  editedLyrics: string;
  editedTechnicalTags: string;
  editedPrompt: string;
}

interface SunoPromptsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
}

const SunoPromptsDialog = ({ isOpen, onClose, orderData }: SunoPromptsDialogProps) => {
  const [prompts, setPrompts] = useState<EditablePrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPrompt, setSavedPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const generatePrompts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-suno-prompts', {
        body: { orderData }
      });

      if (error) throw error;

      if (data.success && data.prompts) {
        const editablePrompts = data.prompts.map((prompt: SunoPrompt) => ({
          ...prompt,
          isEditing: false,
          editedTitle: prompt.title,
          editedDescription: prompt.description,
          editedLyrics: prompt.lyrics || '',
          editedTechnicalTags: prompt.technicalTags || '',
          editedPrompt: prompt.prompt
        }));
        setPrompts(editablePrompts);
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

  const toggleEdit = (index: number) => {
    setPrompts(prev => prev.map((prompt, i) => 
      i === index 
        ? { ...prompt, isEditing: !prompt.isEditing }
        : prompt
    ));
  };

  const updateEditedField = (
    index: number, 
    field: 'editedTitle' | 'editedDescription' | 'editedLyrics' | 'editedTechnicalTags' | 'editedPrompt', 
    value: string
  ) => {
    setPrompts(prev => prev.map((prompt, i) => 
      i === index 
        ? { ...prompt, [field]: value }
        : prompt
    ));
  };

  const saveEdit = (index: number) => {
    setPrompts(prev => prev.map((prompt, i) => 
      i === index 
        ? { 
            ...prompt, 
            title: prompt.editedTitle,
            description: prompt.editedDescription,
            lyrics: prompt.editedLyrics,
            technicalTags: prompt.editedTechnicalTags,
            prompt: prompt.editedPrompt,
            isEditing: false 
          }
        : prompt
    ));
    
    toast({
      title: 'Changes saved',
      description: 'Your edits have been saved successfully'
    });
  };

  const savePromptForOrder = (index: number) => {
    const prompt = prompts[index];
    setSavedPrompt(prompt.prompt);
    
    toast({
      title: 'Prompt saved',
      description: 'This prompt has been saved as the optimized version for this order'
    });
  };

  React.useEffect(() => {
    if (isOpen && prompts.length === 0) {
      generatePrompts();
    }
  }, [isOpen]);

  const getLanguage = () => {
    return orderData?.form_data?.language || 'English';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Music className="w-5 h-5 text-purple-600" />
            <span>Suno.AI Song Prompts with Lyrics - Order #{orderData?.id?.slice(0, 8)}</span>
            <Badge variant="outline" className="ml-2">
              <Globe className="w-3 h-3 mr-1" />
              {getLanguage()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Generating AI prompts with lyrics in {getLanguage()}...</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Generated prompts with complete lyrics in <strong>{getLanguage()}</strong>, optimized for Suno.AI music generation
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
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      {prompt.isEditing ? (
                        <>
                          <Input
                            value={prompt.editedTitle}
                            onChange={(e) => updateEditedField(index, 'editedTitle', e.target.value)}
                            className="font-semibold text-lg"
                            placeholder="Song title"
                          />
                          <Input
                            value={prompt.editedDescription}
                            onChange={(e) => updateEditedField(index, 'editedDescription', e.target.value)}
                            className="text-sm"
                            placeholder="Description"
                          />
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold text-lg">{prompt.title}</h3>
                          <p className="text-sm text-gray-600">{prompt.description}</p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge variant="outline">
                        Variation {index + 1}
                      </Badge>
                      {savedPrompt === prompt.prompt && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          <Check className="w-3 h-3 mr-1" />
                          Saved
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Lyrics Section */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-purple-700 flex items-center">
                      <Music className="w-4 h-4 mr-1" />
                      Song Lyrics ({getLanguage()})
                    </h4>
                    <div className="bg-purple-50 rounded-md p-4 relative">
                      {prompt.isEditing ? (
                        <Textarea
                          value={prompt.editedLyrics}
                          onChange={(e) => updateEditedField(index, 'editedLyrics', e.target.value)}
                          className="min-h-[150px] font-mono text-sm"
                          placeholder="Complete song lyrics..."
                        />
                      ) : (
                        <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                          {prompt.lyrics}
                        </pre>
                      )}
                      
                      {!prompt.isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(prompt.lyrics)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Technical Tags Section */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-blue-700">Technical Tags</h4>
                    <div className="bg-blue-50 rounded-md p-3 relative">
                      {prompt.isEditing ? (
                        <Textarea
                          value={prompt.editedTechnicalTags}
                          onChange={(e) => updateEditedField(index, 'editedTechnicalTags', e.target.value)}
                          className="min-h-[80px] font-mono text-sm"
                          placeholder="Suno.AI technical tags..."
                        />
                      ) : (
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {prompt.technicalTags}
                        </pre>
                      )}
                      
                      {!prompt.isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(prompt.technicalTags)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Complete Prompt Section */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700">Complete Suno.AI Prompt</h4>
                    <div className="bg-gray-50 rounded-md p-4 relative">
                      {prompt.isEditing ? (
                        <Textarea
                          value={prompt.editedPrompt}
                          onChange={(e) => updateEditedField(index, 'editedPrompt', e.target.value)}
                          className="min-h-[120px] font-mono text-sm"
                          placeholder="Complete Suno.AI prompt combining lyrics and technical tags..."
                        />
                      ) : (
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {prompt.prompt}
                        </pre>
                      )}
                      
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {prompt.isEditing ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveEdit(index)}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleEdit(index)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(prompt.prompt)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {!prompt.isEditing && (
                    <div className="flex justify-end pt-2">
                      <Button
                        variant={savedPrompt === prompt.prompt ? "default" : "outline"}
                        size="sm"
                        onClick={() => savePromptForOrder(index)}
                        disabled={savedPrompt === prompt.prompt}
                      >
                        {savedPrompt === prompt.prompt ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Saved as Optimized
                          </>
                        ) : (
                          'Save as Optimized'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {prompts.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">How to use these prompts with lyrics:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Review and edit the generated lyrics in <strong>{getLanguage()}</strong> as needed</li>
                    <li>2. Adjust technical tags to match your musical vision</li>
                    <li>3. Save your preferred optimized version</li>
                    <li>4. Copy the complete prompt (lyrics + technical tags)</li>
                    <li>5. Go to Suno.AI and create a new song</li>
                    <li>6. Paste the complete prompt in Suno.AI</li>
                    <li>7. Generate your personalized multilingual song</li>
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

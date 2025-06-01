import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Copy, RefreshCw, Music, Edit, Save, Check, Globe, Database, Clock, User, AlertTriangle, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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

interface ExistingPrompt {
  id: string;
  title: string;
  description: string | null;
  lyrics: string;
  technical_tags: string;
  prompt: string;
  created_at: string;
  created_by: string | null;
  is_optimized: boolean;
}

interface SunoPromptsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
}

const SunoPromptsDialog = ({ isOpen, onClose, orderData }: SunoPromptsDialogProps) => {
  const [prompts, setPrompts] = useState<EditablePrompt[]>([]);
  const [existingPrompts, setExistingPrompts] = useState<ExistingPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPromptId, setSavedPromptId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showingExisting, setShowingExisting] = useState(false);
  const [isRegeneratingVersions, setIsRegeneratingVersions] = useState(false);
  const [expandedPrompts, setExpandedPrompts] = useState<Set<number>>(new Set([0])); // First prompt expanded by default
  const { toast } = useToast();

  const generateNewPrompts = async () => {
    setIsGenerating(true);
    try {
      console.log('Generating new prompts for order:', orderData?.id);
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
        setShowingExisting(false);
        toast({
          title: 'New prompts generated',
          description: 'Fresh AI-generated prompts are now ready for use'
        });
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
      setIsGenerating(false);
    }
  };

  const generateAdditionalVersions = async () => {
    setIsRegeneratingVersions(true);
    try {
      console.log('Generating additional versions for order:', orderData?.id);
      const { data, error } = await supabase.functions.invoke('generate-suno-prompts', {
        body: { orderData }
      });

      if (error) throw error;

      if (data.success && data.prompts) {
        const newEditablePrompts = data.prompts.map((prompt: SunoPrompt) => ({
          ...prompt,
          isEditing: false,
          editedTitle: prompt.title,
          editedDescription: prompt.description,
          editedLyrics: prompt.lyrics || '',
          editedTechnicalTags: prompt.technicalTags || '',
          editedPrompt: prompt.prompt
        }));
        
        // Add new versions to existing prompts
        setPrompts(prev => [...prev, ...newEditablePrompts]);
        
        toast({
          title: 'Additional versions generated',
          description: `Generated ${data.prompts.length} new versions. Original saved prompts remain unchanged.`
        });
      } else {
        throw new Error('Failed to generate additional versions');
      }
    } catch (error) {
      console.error('Error generating additional versions:', error);
      toast({
        title: 'Error generating additional versions',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsRegeneratingVersions(false);
    }
  };

  const loadExistingPrompts = async () => {
    if (!orderData?.id) {
      console.log('No order ID provided, cannot load prompts');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Loading existing prompts for order:', orderData.id);
      const { data: existingPromptsData, error } = await supabase
        .from('suno_prompts')
        .select('*')
        .eq('order_id', orderData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (existingPromptsData && existingPromptsData.length > 0) {
        console.log('Found existing prompts:', existingPromptsData.length);
        setExistingPrompts(existingPromptsData);
        
        // Convert existing prompts to editable format for display
        const editablePrompts = existingPromptsData.map((prompt: any) => ({
          title: prompt.title,
          description: prompt.description || '',
          lyrics: prompt.lyrics,
          technicalTags: prompt.technical_tags,
          prompt: prompt.prompt,
          isEditing: false,
          editedTitle: prompt.title,
          editedDescription: prompt.description || '',
          editedLyrics: prompt.lyrics,
          editedTechnicalTags: prompt.technical_tags,
          editedPrompt: prompt.prompt
        }));
        
        setPrompts(editablePrompts);
        setShowingExisting(true);
        
        // Set the optimized prompt ID
        const optimizedPrompt = existingPromptsData.find(p => p.is_optimized);
        if (optimizedPrompt) {
          setSavedPromptId(optimizedPrompt.id);
        }
        
        toast({
          title: 'Existing prompts loaded',
          description: `Found ${existingPromptsData.length} saved prompt${existingPromptsData.length > 1 ? 's' : ''}`
        });
      } else {
        console.log('No existing prompts found, generating new ones');
        // No existing prompts, generate new ones
        await generateNewPrompts();
      }
    } catch (error) {
      console.error('Error loading existing prompts:', error);
      toast({
        title: 'Error loading prompts',
        description: 'Generating new prompts instead',
        variant: 'destructive'
      });
      await generateNewPrompts();
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

  const savePromptToDatabase = async (index: number) => {
    if (!orderData?.id) {
      toast({
        title: 'Error',
        description: 'Order ID is required to save prompt',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    const prompt = prompts[index];

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You must be logged in to save prompts',
          variant: 'destructive'
        });
        return;
      }

      // First, unmark any existing optimized prompts for this order
      await supabase
        .from('suno_prompts')
        .update({ is_optimized: false })
        .eq('order_id', orderData.id)
        .eq('is_optimized', true);

      // Save the new optimized prompt
      const { data: newPrompt, error } = await supabase
        .from('suno_prompts')
        .insert({
          order_id: orderData.id,
          title: prompt.title,
          description: prompt.description,
          lyrics: prompt.lyrics,
          technical_tags: prompt.technicalTags,
          prompt: prompt.prompt,
          language: getLanguage(),
          is_optimized: true,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setSavedPromptId(newPrompt.id);
      
      toast({
        title: 'Prompt saved to database',
        description: 'This prompt has been saved as the optimized version for this order',
        duration: 5000
      });

    } catch (error) {
      console.error('Error saving prompt to database:', error);
      toast({
        title: 'Error saving prompt',
        description: 'Failed to save prompt to database. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getVersionLabel = (index: number) => {
    if (showingExisting && index < existingPrompts.length) {
      return 'Saved';
    }
    if (showingExisting) {
      return `New Version ${index - existingPrompts.length + 1}`;
    }
    return `Variation ${index + 1}`;
  };

  const togglePromptExpansion = (index: number) => {
    const newExpanded = new Set(expandedPrompts);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedPrompts(newExpanded);
  };

  const expandAllPrompts = () => {
    setExpandedPrompts(new Set(prompts.map((_, index) => index)));
  };

  const collapseAllPrompts = () => {
    setExpandedPrompts(new Set());
  };

  // Updated useEffect to properly handle order changes
  React.useEffect(() => {
    if (isOpen && orderData?.id) {
      console.log('Dialog opened for order:', orderData.id);
      // Reset all state when order changes
      setPrompts([]);
      setExistingPrompts([]);
      setSavedPromptId(null);
      setShowingExisting(false);
      setIsLoading(false);
      setIsGenerating(false);
      setIsSaving(false);
      setIsRegeneratingVersions(false);
      
      // Load prompts for this specific order
      loadExistingPrompts();
    }
  }, [isOpen, orderData?.id]);

  const getLanguage = () => {
    return orderData?.form_data?.language || 'English';
  };

  const isPromptSavedInDatabase = (index: number) => {
    return savedPromptId !== null;
  };

  const getCreatedByInfo = (index: number) => {
    if (showingExisting && existingPrompts[index]) {
      return {
        createdAt: new Date(existingPrompts[index].created_at).toLocaleDateString(),
        createdBy: existingPrompts[index].created_by,
        isOptimized: existingPrompts[index].is_optimized
      };
    }
    return null;
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
            {showingExisting && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                <Clock className="w-3 h-3 mr-1" />
                {prompts.length > existingPrompts.length ? 'Mixed Versions' : 'Existing Prompts'}
              </Badge>
            )}
            {savedPromptId && (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <Database className="w-3 h-3 mr-1" />
                Saved in DB
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Loading prompts...</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    {showingExisting 
                      ? `Showing ${existingPrompts.length} saved prompts${prompts.length > existingPrompts.length ? ` and ${prompts.length - existingPrompts.length} new versions` : ''} in ${getLanguage()}`
                      : `Generated prompts with complete lyrics in ${getLanguage()}, optimized for Suno.AI music generation`
                    }
                  </p>
                  {showingExisting && existingPrompts.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Last saved: {new Date(existingPrompts[0].created_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {prompts.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={expandAllPrompts}
                      >
                        Expand All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={collapseAllPrompts}
                      >
                        Collapse All
                      </Button>
                    </>
                  )}
                  {showingExisting ? (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isRegeneratingVersions}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {isRegeneratingVersions ? 'Generating...' : 'Generate 3 More Versions'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center">
                              <Plus className="w-5 h-5 text-blue-500 mr-2" />
                              Generate Additional Versions?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will generate 3 additional AI prompt versions while keeping your existing saved prompts unchanged. 
                              You'll be able to compare all versions and choose which one to save as the optimized version.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={generateAdditionalVersions}>
                              Generate More Versions
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isGenerating}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Replace All with New
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center">
                              <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                              Replace with Completely New Prompts?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will generate completely new AI prompts and replace what you're currently viewing. 
                              Your saved prompts in the database will remain unchanged. Are you sure you want to continue?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={generateNewPrompts}>
                              Generate New Prompts
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateNewPrompts}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Regenerate'}
                    </Button>
                  )}
                </div>
              </div>

              {isRegeneratingVersions && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="font-medium text-blue-900">Generating 3 additional versions...</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Your existing saved prompts will remain unchanged. New versions will be added for comparison.
                  </p>
                </div>
              )}

              {prompts.map((prompt, index) => {
                const createdInfo = getCreatedByInfo(index);
                const versionLabel = getVersionLabel(index);
                const isNewVersion = showingExisting && index >= existingPrompts.length;
                const isExpanded = expandedPrompts.has(index);
                
                return (
                  <Collapsible
                    key={index}
                    open={isExpanded}
                    onOpenChange={() => togglePromptExpansion(index)}
                  >
                    <div className={`border rounded-lg ${isNewVersion ? 'border-blue-300 bg-blue-50' : ''}`}>
                      <CollapsibleTrigger asChild>
                        <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-semibold text-lg">{prompt.title}</h3>
                                <Badge variant={isNewVersion ? "default" : "outline"} className={isNewVersion ? "bg-blue-100 text-blue-800 border-blue-300" : ""}>
                                  {versionLabel} {index + 1}
                                </Badge>
                                {isNewVersion && (
                                  <Badge className="bg-green-100 text-green-800 border-green-300">
                                    <Plus className="w-3 h-3 mr-1" />
                                    New
                                  </Badge>
                                )}
                                {createdInfo && (
                                  <>
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {createdInfo.createdAt}
                                    </Badge>
                                    {createdInfo.isOptimized && (
                                      <Badge className="bg-green-100 text-green-800 border-green-300">
                                        <Check className="w-3 h-3 mr-1" />
                                        Optimized
                                      </Badge>
                                    )}
                                  </>
                                )}
                                {isPromptSavedInDatabase(index) && !showingExisting && (
                                  <Badge className="bg-green-100 text-green-800 border-green-300">
                                    <Check className="w-3 h-3 mr-1" />
                                    Saved in DB
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{prompt.description}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-4 pb-4 space-y-4">
                          {prompt.isEditing && (
                            <div className="space-y-2">
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
                            </div>
                          )}

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

                          {!prompt.isEditing && (!showingExisting || isNewVersion) && (
                            <div className="flex justify-end pt-2">
                              <Button
                                variant={isPromptSavedInDatabase(index) ? "default" : "outline"}
                                size="sm"
                                onClick={() => savePromptToDatabase(index)}
                                disabled={isSaving}
                              >
                                {isSaving ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                  </>
                                ) : isPromptSavedInDatabase(index) ? (
                                  <>
                                    <Database className="w-4 h-4 mr-2" />
                                    Saved to Database
                                  </>
                                ) : (
                                  <>
                                    <Database className="w-4 h-4 mr-2" />
                                    Save as Optimized Version
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}

              {prompts.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">How to use these prompts with lyrics:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Click on any prompt above to expand and view its details</li>
                    <li>2. Review and edit the {showingExisting ? 'existing' : 'generated'} lyrics in <strong>{getLanguage()}</strong> as needed</li>
                    <li>3. Adjust technical tags to match your musical vision</li>
                    {(!showingExisting || prompts.length > existingPrompts.length) && <li>4. Save your preferred version as the optimized version to the database</li>}
                    <li>{(!showingExisting || prompts.length > existingPrompts.length) ? '5' : '4'}. Copy the complete prompt (lyrics + technical tags)</li>
                    <li>{(!showingExisting || prompts.length > existingPrompts.length) ? '6' : '5'}. Go to Suno.AI and create a new song</li>
                    <li>{(!showingExisting || prompts.length > existingPrompts.length) ? '7' : '6'}. Paste the complete prompt in Suno.AI</li>
                    <li>{(!showingExisting || prompts.length > existingPrompts.length) ? '8' : '7'}. Generate your personalized multilingual song</li>
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

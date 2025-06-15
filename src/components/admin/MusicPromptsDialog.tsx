
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

interface MusicPrompt {
  title: string;
  description: string;
  lyrics: string;
  technicalTags: string;
  prompt: string;
}

interface EditablePrompt extends MusicPrompt {
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

interface MusicPromptsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
}

const MusicPromptsDialog = ({ isOpen, onClose, orderData }: MusicPromptsDialogProps) => {
  const [prompts, setPrompts] = useState<EditablePrompt[]>([]);
  const [existingPrompts, setExistingPrompts] = useState<ExistingPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPromptId, setSavedPromptId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showingExisting, setShowingExisting] = useState(false);
  const [isRegeneratingVersions, setIsRegeneratingVersions] = useState(false);
  const [expandedPrompts, setExpandedPrompts] = useState<Set<number>>(new Set([0]));
  const { toast } = useToast();

  const generateNewPrompts = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { orderData }
      });

      if (error) throw error;

      if (data.success && data.prompts) {
        const editablePrompts = data.prompts.map((prompt: MusicPrompt) => ({
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
          description: 'Fresh content prompts are now ready for use'
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
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { orderData }
      });

      if (error) throw error;

      if (data.success && data.prompts) {
        const newEditablePrompts = data.prompts.map((prompt: MusicPrompt) => ({
          ...prompt,
          isEditing: false,
          editedTitle: prompt.title,
          editedDescription: prompt.description,
          editedLyrics: prompt.lyrics || '',
          editedTechnicalTags: prompt.technicalTags || '',
          editedPrompt: prompt.prompt
        }));
        
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
      return;
    }

    setIsLoading(true);
    try {
      // Use type casting to work around TypeScript issues with the renamed table
      const { data: existingPromptsData, error } = await (supabase as any)
        .from('music_prompts')
        .select('*')
        .eq('order_id', orderData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (existingPromptsData && existingPromptsData.length > 0) {
        setExistingPrompts(existingPromptsData);
        
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
        
        const optimizedPrompt = existingPromptsData.find((p: any) => p.is_optimized);
        if (optimizedPrompt) {
          setSavedPromptId(optimizedPrompt.id);
        }
        
        toast({
          title: 'Existing prompts loaded',
          description: `Found ${existingPromptsData.length} saved prompt${existingPromptsData.length > 1 ? 's' : ''}`
        });
      } else {
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
      await (supabase as any)
        .from('music_prompts')
        .update({ is_optimized: false })
        .eq('order_id', orderData.id)
        .eq('is_optimized', true);

      // Save the new optimized prompt
      const { data: newPrompt, error } = await (supabase as any)
        .from('music_prompts')
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

  React.useEffect(() => {
    if (isOpen && orderData?.id) {
      setPrompts([]);
      setExistingPrompts([]);
      setSavedPromptId(null);
      setShowingExisting(false);
      setIsLoading(false);
      setIsGenerating(false);
      setIsSaving(false);
      setIsRegeneratingVersions(false);
      
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
      <DialogContent className="w-[95vw] max-w-5xl h-[90vh] max-h-[90vh] overflow-hidden flex flex-col p-3 sm:p-6">
        <DialogHeader className="flex-shrink-0 pb-3 sm:pb-4">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-lg sm:text-xl">
            <div className="flex items-center space-x-2">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <span className="text-sm sm:text-base">Music Generation Prompts - Order #{orderData?.id?.slice(0, 8)}</span>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Badge variant="outline" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                {getLanguage()}
              </Badge>
              {showingExisting && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {prompts.length > existingPrompts.length ? 'Mixed Versions' : 'Existing Prompts'}
                </Badge>
              )}
              {savedPromptId && (
                <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                  <Database className="w-3 h-3 mr-1" />
                  Saved in DB
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span className="text-sm sm:text-base">Loading prompts...</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-gray-600">
                    {showingExisting 
                      ? `Showing ${existingPrompts.length} saved prompts${prompts.length > existingPrompts.length ? ` and ${prompts.length - existingPrompts.length} new versions` : ''} in ${getLanguage()}`
                      : `Generated prompts with complete lyrics in ${getLanguage()}, optimized for music generation`
                    }
                  </p>
                  {showingExisting && existingPrompts.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Last saved: {new Date(existingPrompts[0].created_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {prompts.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={expandAllPrompts}
                        className="text-xs sm:text-sm"
                      >
                        Expand All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={collapseAllPrompts}
                        className="text-xs sm:text-sm"
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
                            className="text-xs sm:text-sm"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            {isRegeneratingVersions ? 'Generating...' : 'Generate 3 More'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[90vw] max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center text-sm sm:text-base">
                              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2" />
                              Generate Additional Versions?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-xs sm:text-sm">
                              This will generate 3 additional content prompt versions while keeping your existing saved prompts unchanged. 
                              You'll be able to compare all versions and choose which one to save as the optimized version.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={generateAdditionalVersions} className="w-full sm:w-auto">
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
                            className="text-xs sm:text-sm"
                          >
                            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Replace All
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[90vw] max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center text-sm sm:text-base">
                              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2" />
                              Replace with New Prompts?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-xs sm:text-sm">
                              This will generate completely new content prompts and replace what you're currently viewing. 
                              Your saved prompts in the database will remain unchanged. Are you sure you want to continue?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={generateNewPrompts} className="w-full sm:w-auto">
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
                      className="text-xs sm:text-sm"
                    >
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {isGenerating ? 'Generating...' : 'Regenerate'}
                    </Button>
                  )}
                </div>
              </div>

              {isRegeneratingVersions && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-600" />
                    <span className="font-medium text-blue-900 text-sm sm:text-base">Generating 3 additional versions...</span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-700 mt-1">
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
                        <div className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3">
                                <h3 className="font-semibold text-base sm:text-lg truncate">{prompt.title}</h3>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                  <Badge variant={isNewVersion ? "default" : "outline"} className={`text-xs ${isNewVersion ? "bg-blue-100 text-blue-800 border-blue-300" : ""}`}>
                                    {versionLabel} {index + 1}
                                  </Badge>
                                  {isNewVersion && (
                                    <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
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
                                        <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                                          <Check className="w-3 h-3 mr-1" />
                                          Optimized
                                        </Badge>
                                      )}
                                    </>
                                  )}
                                  {isPromptSavedInDatabase(index) && !showingExisting && (
                                    <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                                      <Check className="w-3 h-3 mr-1" />
                                      Saved in DB
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{prompt.description}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 sm:space-y-4">
                          {prompt.isEditing && (
                            <div className="space-y-2">
                              <Input
                                value={prompt.editedTitle}
                                onChange={(e) => updateEditedField(index, 'editedTitle', e.target.value)}
                                className="font-semibold text-sm sm:text-lg"
                                placeholder="Song title"
                              />
                              <Input
                                value={prompt.editedDescription}
                                onChange={(e) => updateEditedField(index, 'editedDescription', e.target.value)}
                                className="text-xs sm:text-sm"
                                placeholder="Description"
                              />
                            </div>
                          )}

                          {/* Lyrics Section */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-xs sm:text-sm text-purple-700 flex items-center">
                              <Music className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Song Lyrics ({getLanguage()})
                            </h4>
                            <div className="bg-purple-50 rounded-md p-3 sm:p-4 relative">
                              {prompt.isEditing ? (
                                <Textarea
                                  value={prompt.editedLyrics}
                                  onChange={(e) => updateEditedField(index, 'editedLyrics', e.target.value)}
                                  className="min-h-[120px] sm:min-h-[150px] font-mono text-xs sm:text-sm"
                                  placeholder="Complete song lyrics..."
                                />
                              ) : (
                                <pre className="text-xs sm:text-sm whitespace-pre-wrap font-mono leading-relaxed pr-8">
                                  {prompt.lyrics}
                                </pre>
                              )}
                              
                              {!prompt.isEditing && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 right-2 h-6 w-6 sm:h-8 sm:w-8 p-1"
                                  onClick={() => copyToClipboard(prompt.lyrics)}
                                >
                                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Technical Tags Section */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-xs sm:text-sm text-blue-700">Technical Tags</h4>
                            <div className="bg-blue-50 rounded-md p-3 relative">
                              {prompt.isEditing ? (
                                <Textarea
                                  value={prompt.editedTechnicalTags}
                                  onChange={(e) => updateEditedField(index, 'editedTechnicalTags', e.target.value)}
                                  className="min-h-[60px] sm:min-h-[80px] font-mono text-xs sm:text-sm"
                                  placeholder="Music generation technical tags..."
                                />
                              ) : (
                                <pre className="text-xs sm:text-sm whitespace-pre-wrap font-mono pr-8">
                                  {prompt.technicalTags}
                                </pre>
                              )}
                              
                              {!prompt.isEditing && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 right-2 h-6 w-6 sm:h-8 sm:w-8 p-1"
                                  onClick={() => copyToClipboard(prompt.technicalTags)}
                                >
                                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Complete Prompt Section */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-xs sm:text-sm text-gray-700">Complete Music Generation Prompt</h4>
                            <div className="bg-gray-50 rounded-md p-3 sm:p-4 relative">
                              {prompt.isEditing ? (
                                <Textarea
                                  value={prompt.editedPrompt}
                                  onChange={(e) => updateEditedField(index, 'editedPrompt', e.target.value)}
                                  className="min-h-[100px] sm:min-h-[120px] font-mono text-xs sm:text-sm"
                                  placeholder="Complete music generation prompt combining lyrics and technical tags..."
                                />
                              ) : (
                                <pre className="text-xs sm:text-sm whitespace-pre-wrap font-mono pr-16 sm:pr-20">
                                  {prompt.prompt}
                                </pre>
                              )}
                              
                              <div className="absolute top-2 right-2 flex space-x-1">
                                {prompt.isEditing ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => saveEdit(index)}
                                    className="h-6 w-6 sm:h-8 sm:w-8 p-1"
                                  >
                                    <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleEdit(index)}
                                      className="h-6 w-6 sm:h-8 sm:w-8 p-1"
                                    >
                                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(prompt.prompt)}
                                      className="h-6 w-6 sm:h-8 sm:w-8 p-1"
                                    >
                                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
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
                                className="text-xs sm:text-sm"
                              >
                                {isSaving ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                                    Saving...
                                  </>
                                ) : isPromptSavedInDatabase(index) ? (
                                  <>
                                    <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    Saved to Database
                                  </>
                                ) : (
                                  <>
                                    <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">How to use these prompts with lyrics:</h4>
                  <ol className="text-xs sm:text-sm text-blue-800 space-y-1">
                    <li>1. Click on any prompt above to expand and view its details</li>
                    <li>2. Review and edit the {showingExisting ? 'existing' : 'generated'} lyrics in <strong>{getLanguage()}</strong> as needed</li>
                    <li>3. Adjust technical tags to match your musical vision</li>
                    {(!showingExisting || prompts.length > existingPrompts.length) && <li>4. Save your preferred version as the optimized version to the database</li>}
                    <li>{(!showingExisting || prompts.length > existingPrompts.length) ? '5' : '4'}. Copy the complete prompt (lyrics + technical tags)</li>
                    <li>{(!showingExisting || prompts.length > existingPrompts.length) ? '6' : '5'}. Go to your preferred music generation platform</li>
                    <li>{(!showingExisting || prompts.length > existingPrompts.length) ? '7' : '6'}. Paste the complete prompt in the generation tool</li>
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

export default MusicPromptsDialog;

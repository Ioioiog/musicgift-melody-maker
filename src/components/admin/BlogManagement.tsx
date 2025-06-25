
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, Calendar, User, Tag, Globe, Languages } from "lucide-react";
import { useAllBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from "@/hooks/useBlogPosts";
import { BlogPost, CreateBlogPostData, CreateBlogPostTranslations, BlogPostTranslations } from "@/types/blog";
import { getAvailableLanguages, hasTranslation, generateSlugFromTitle } from "@/utils/blogTranslations";

const BlogManagement = () => {
  const { data: posts = [], isLoading } = useAllBlogPosts();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('ro');
  const [translations, setTranslations] = useState<CreateBlogPostTranslations>({});
  const [defaultLanguage, setDefaultLanguage] = useState('ro');
  const [category, setCategory] = useState('Music Tips');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [readTime, setReadTime] = useState(5);

  const availableLanguages = [
    { code: 'ro', name: 'Romanian' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pl', name: 'Polish' },
    { code: 'it', name: 'Italian' }
  ];

  const categories = [
    'Music Tips',
    'Industry Insights', 
    'Client Stories',
    'Behind the Scenes',
    'Trends',
    'General'
  ];

  const resetForm = () => {
    setTranslations({});
    setDefaultLanguage('ro');
    setCategory('Music Tips');
    setAuthor('');
    setStatus('draft');
    setIsFeatured(false);
    setTags([]);
    setReadTime(5);
    setCurrentLanguage('ro');
    setEditingPost(null);
  };

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      // Convert BlogPostTranslations to CreateBlogPostTranslations format
      const convertedTranslations: CreateBlogPostTranslations = {};
      Object.keys(post.translations || {}).forEach(lang => {
        const translation = post.translations[lang];
        convertedTranslations[lang] = {
          title: translation.title,
          excerpt: translation.excerpt,
          content: translation.content,
          meta_title: translation.meta_title,
          meta_description: translation.meta_description,
          slug: translation.slug || generateSlugFromTitle(translation.title)
        };
      });
      setTranslations(convertedTranslations);
      setDefaultLanguage(post.default_language || 'ro');
      setCategory(post.category);
      setAuthor(post.author);
      setStatus(post.status);
      setIsFeatured(post.is_featured);
      setTags(post.tags || []);
      setReadTime(post.read_time || 5);
      setCurrentLanguage(post.default_language || 'ro');
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleTranslationChange = (field: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [currentLanguage]: {
        ...prev[currentLanguage],
        [field]: value,
        ...(field === 'title' && !prev[currentLanguage]?.slug ? { slug: generateSlugFromTitle(value) } : {})
      }
    }));
  };

  const getCurrentTranslation = () => {
    return translations[currentLanguage] || {
      title: '',
      excerpt: '',
      content: '',
      meta_title: '',
      meta_description: '',
      slug: ''
    };
  };

  const handleSubmit = async () => {
    const currentTranslation = getCurrentTranslation();
    if (!currentTranslation.title || !currentTranslation.content || !author) {
      return;
    }

    // Ensure current language has slug and convert to proper format
    const updatedTranslations: BlogPostTranslations = {};
    Object.keys(translations).forEach(lang => {
      const translation = translations[lang];
      updatedTranslations[lang] = {
        ...translation,
        slug: translation.slug || generateSlugFromTitle(translation.title)
      };
    });

    if (editingPost) {
      await updatePost.mutateAsync({
        id: editingPost.id,
        translations: updatedTranslations,
        default_language: defaultLanguage,
        category,
        author,
        status,
        is_featured: isFeatured,
        tags,
        read_time: readTime,
        published_at: status === 'published' ? new Date().toISOString() : undefined,
      });
    } else {
      const createData: CreateBlogPostData = {
        translations,
        default_language: defaultLanguage,
        category,
        author,
        status,
        is_featured: isFeatured,
        tags,
        read_time: readTime,
        published_at: status === 'published' ? new Date().toISOString() : undefined,
      };
      await createPost.mutateAsync(createData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await deletePost.mutateAsync(id);
  };

  const handleTagsChange = (tagsString: string) => {
    const newTags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setTags(newTags);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-600">Create, edit, and manage your multi-language blog posts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
              <DialogDescription>
                {editingPost ? 'Update your multi-language blog post' : 'Create a new multi-language blog post'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Language Selector */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Languages className="w-5 h-5 text-gray-600" />
                <div className="flex items-center gap-2">
                  <Label>Editing Language:</Label>
                  <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            {lang.name}
                            {hasTranslation(translations as BlogPostTranslations, lang.code) && (
                              <Badge variant="secondary" className="text-xs">✓</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Label>Default Language:</Label>
                  <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content ({availableLanguages.find(l => l.code === currentLanguage)?.name})</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={getCurrentTranslation().title}
                        onChange={(e) => handleTranslationChange('title', e.target.value)}
                        placeholder={`Enter post title in ${availableLanguages.find(l => l.code === currentLanguage)?.name}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={getCurrentTranslation().slug}
                        onChange={(e) => handleTranslationChange('slug', e.target.value)}
                        placeholder="Auto-generated from title"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={getCurrentTranslation().excerpt}
                      onChange={(e) => handleTranslationChange('excerpt', e.target.value)}
                      placeholder="Brief description of the post"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={getCurrentTranslation().content}
                      onChange={(e) => handleTranslationChange('content', e.target.value)}
                      placeholder="Write your post content here (HTML supported)"
                      rows={10}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Author name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="read_time">Read Time (minutes)</Label>
                      <Input
                        id="read_time"
                        type="number"
                        value={readTime}
                        onChange={(e) => setReadTime(parseInt(e.target.value) || 5)}
                        placeholder="5"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="music, tips, creativity"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={isFeatured}
                      onCheckedChange={setIsFeatured}
                    />
                    <Label htmlFor="is_featured">Featured Post</Label>
                  </div>
                </TabsContent>
                
                <TabsContent value="seo" className="space-y-4">
                  <div>
                    <Label htmlFor="meta_title">Meta Title ({availableLanguages.find(l => l.code === currentLanguage)?.name})</Label>
                    <Input
                      id="meta_title"
                      value={getCurrentTranslation().meta_title}
                      onChange={(e) => handleTranslationChange('meta_title', e.target.value)}
                      placeholder="SEO title (leave empty to use post title)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="meta_description">Meta Description ({availableLanguages.find(l => l.code === currentLanguage)?.name})</Label>
                    <Textarea
                      id="meta_description"
                      value={getCurrentTranslation().meta_description}
                      onChange={(e) => handleTranslationChange('meta_description', e.target.value)}
                      placeholder="SEO description (leave empty to use excerpt)"
                      rows={3}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={createPost.isPending || updatePost.isPending}>
                {editingPost ? 'Update' : 'Create'} Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => {
          const availableLangs = getAvailableLanguages(post.translations || {});
          const localizedPost = post.localizedVersion;
          
          return (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{localizedPost?.title || 'No title'}</CardTitle>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                      {post.is_featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {post.category}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                      {post.views && post.views > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views} views
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Available in:</span>
                      {availableLangs.map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/blog/${localizedPost?.slug}`} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(post)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{localizedPost?.title}"? This will delete all translations and cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              {localizedPost?.excerpt && (
                <CardContent>
                  <p className="text-gray-600">{localizedPost.excerpt}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BlogManagement;

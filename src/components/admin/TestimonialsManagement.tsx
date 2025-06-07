
import { useState } from "react";
import { useTestimonialsAdmin } from "@/hooks/useTestimonials";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { VideoUpload } from "@/components/ui/video-upload";
import type { Testimonial } from "@/hooks/useTestimonials";

const TestimonialsManagement = () => {
  const { data: testimonials, isLoading } = useTestimonialsAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    stars: 5,
    text: "",
    context: "",
    youtube_link: "",
    video_url: "",
    display_order: 0,
    approved: false
  });

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      stars: 5,
      text: "",
      context: "",
      youtube_link: "",
      video_url: "",
      display_order: 0,
      approved: false
    });
    setEditingTestimonial(null);
  };

  const handleVideoUploaded = (url: string) => {
    setFormData({ ...formData, video_url: url });
  };

  const handleRemoveVideo = () => {
    setFormData({ ...formData, video_url: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingTestimonial.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Testimonial updated successfully" });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Testimonial created successfully" });
      }
      
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({ 
        title: "Error", 
        description: "Failed to save testimonial", 
        variant: "destructive" 
      });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      location: testimonial.location || "",
      stars: testimonial.stars,
      text: testimonial.text || "",
      context: testimonial.context || "",
      youtube_link: testimonial.youtube_link || "",
      video_url: testimonial.video_url || "",
      display_order: testimonial.display_order,
      approved: testimonial.approved
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Testimonial deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete testimonial", 
        variant: "destructive" 
      });
    }
  };

  const toggleApproval = async (testimonial: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ approved: !testimonial.approved })
        .eq('id', testimonial.id);
      
      if (error) throw error;
      toast({ 
        title: "Success", 
        description: `Testimonial ${!testimonial.approved ? 'approved' : 'unapproved'}` 
      });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] });
    } catch (error) {
      console.error('Error updating testimonial approval:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update testimonial", 
        variant: "destructive" 
      });
    }
  };

  if (isLoading) {
    return <div>Loading testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonials Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stars">Stars (1-5)</Label>
                  <Input
                    id="stars"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.stars}
                    onChange={(e) => setFormData({ ...formData, stars: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="youtube_link">YouTube Embed Link</Label>
                <Input
                  id="youtube_link"
                  value={formData.youtube_link}
                  onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                />
              </div>

              <div className="border-t pt-4">
                <VideoUpload
                  onVideoUploaded={handleVideoUploaded}
                  currentVideoUrl={formData.video_url}
                  onRemoveVideo={handleRemoveVideo}
                />
              </div>

              <div>
                <Label htmlFor="text">Testimonial Text</Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="context">Context</Label>
                <Textarea
                  id="context"
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="approved"
                  checked={formData.approved}
                  onCheckedChange={(checked) => setFormData({ ...formData, approved: checked })}
                />
                <Label htmlFor="approved">Approved</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTestimonial ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {testimonial.name}
                    <Badge variant={testimonial.approved ? "default" : "secondary"}>
                      {testimonial.approved ? "Approved" : "Pending"}
                    </Badge>
                  </CardTitle>
                  {testimonial.location && (
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={testimonial.approved ? "outline" : "default"}
                    onClick={() => toggleApproval(testimonial)}
                  >
                    {testimonial.approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(testimonial)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                {testimonial.text && (
                  <p className="text-sm italic">"{testimonial.text}"</p>
                )}
                {testimonial.youtube_link && (
                  <p className="text-xs text-blue-600">YouTube: {testimonial.youtube_link}</p>
                )}
                {testimonial.video_url && (
                  <p className="text-xs text-green-600">Uploaded Video: {testimonial.video_url}</p>
                )}
                <p className="text-xs text-gray-500">
                  Order: {testimonial.display_order} | Created: {new Date(testimonial.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!testimonials?.length && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No testimonials yet. Add your first testimonial!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestimonialsManagement;


import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { VideoUpload } from "@/components/ui/video-upload";

const TestimonialSubmissionForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    stars: 5,
    text: "",
    youtube_link: "",
    video_url: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      stars: 5,
      text: "",
      youtube_link: "",
      video_url: ""
    });
  };

  const handleVideoUploaded = (url: string) => {
    setFormData({ ...formData, video_url: url });
  };

  const handleRemoveVideo = () => {
    setFormData({ ...formData, video_url: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a testimonial",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([{
          ...formData,
          approved: false,
          display_order: 0
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your testimonial has been submitted for review. Thank you for your feedback!"
      });
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to submit testimonial. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, onStarClick: (stars: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onStarClick(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-white/80 mb-4">Please log in to share your testimonial</p>
        <Button onClick={() => window.location.href = '/auth'} variant="outline">
          Log In
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={resetForm}
        >
          <Plus className="w-4 h-4 mr-2" />
          Share Your Experience
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country (optional)"
              />
            </div>
          </div>
          
          <div>
            <Label>Rating *</Label>
            <div className="mt-2">
              {renderStars(formData.stars, (stars) => setFormData({ ...formData, stars }))}
            </div>
          </div>

          <div>
            <Label htmlFor="text">Your Testimonial *</Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows={4}
              required
              placeholder="Share your experience with our service..."
            />
          </div>

          <div>
            <Label htmlFor="youtube_link">Your MusicGift song link (Optional)</Label>
            <Input
              id="youtube_link"
              value={formData.youtube_link}
              onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
            />
            <p className="text-sm text-gray-500 mt-1">
              If you have a video testimonial on YouTube, paste the embed link here
            </p>
          </div>

          <div className="border-t pt-4">
            <VideoUpload
              onVideoUploaded={handleVideoUploaded}
              currentVideoUrl={formData.video_url}
              onRemoveVideo={handleRemoveVideo}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Testimonial"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialSubmissionForm;

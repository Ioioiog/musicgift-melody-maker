
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Play, Check, X, Download } from "lucide-react";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TestimonialsManagement = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Fetch testimonials from Supabase
  const { data: supabaseTestimonials = [], refetch } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }
      
      return data;
    }
  });

  const handleApproveTestimonial = async (id: string) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ approved: true })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve testimonial",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Testimonial approved successfully"
    });
    refetch();
  };

  const handleRejectTestimonial = async (id: string) => {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Testimonial deleted successfully"
    });
    refetch();
  };

  const handleExportToStatic = async () => {
    setIsExporting(true);
    try {
      // Get all approved testimonials from Supabase
      const approvedSupabaseTestimonials = supabaseTestimonials.filter(t => t.approved);
      
      // Combine static and Supabase testimonials
      const allTestimonials = [
        ...staticTestimonials,
        ...approvedSupabaseTestimonials.map(t => ({
          id: t.id,
          name: t.name,
          location: t.location,
          stars: t.stars,
          message: t.text,
          context: t.context,
          youtube_link: t.youtube_link,
          video_url: t.video_url,
          display_order: t.display_order,
          approved: t.approved
        }))
      ];

      // Sort by display_order
      allTestimonials.sort((a, b) => a.display_order - b.display_order);

      // Generate the TypeScript file content
      const fileContent = `export const testimonials = ${JSON.stringify(allTestimonials, null, 2)};`;

      // Create and download the file
      const blob = new Blob([fileContent], { type: 'text/typescript' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'testimonials.ts';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${allTestimonials.length} testimonials to testimonials.ts file. Replace the existing file in src/data/testimonials.ts with this file.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export testimonials",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewVideo = (testimonial: any) => {
    if (testimonial.youtube_link) {
      window.open(testimonial.youtube_link, '_blank');
    } else if (testimonial.video_url) {
      window.open(testimonial.video_url, '_blank');
    }
  };

  // Combine static and Supabase testimonials
  const approvedStaticTestimonials = staticTestimonials.filter(t => t.approved);
  const approvedSupabaseTestimonials = supabaseTestimonials.filter(t => t.approved);
  const pendingSupabaseTestimonials = supabaseTestimonials.filter(t => !t.approved);

  const renderTestimonialCard = (testimonial: any, isFromSupabase = false) => (
    <Card key={testimonial.id} className={!testimonial.approved && isFromSupabase ? "border-orange-200 bg-orange-50" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {testimonial.name}
              <Badge variant={testimonial.approved ? "default" : "secondary"}>
                {testimonial.approved ? "Approved" : "Pending"}
              </Badge>
              <Badge variant="outline" className="text-blue-600">
                {isFromSupabase ? "Database" : "Static"}
              </Badge>
              {(testimonial.youtube_link || testimonial.video_url) && (
                <Badge variant="outline" className="text-red-600">
                  <Play className="w-3 h-3 mr-1" />
                  Video
                </Badge>
              )}
            </CardTitle>
            {testimonial.location && (
              <p className="text-sm text-gray-600">{testimonial.location}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(testimonial.youtube_link || testimonial.video_url) && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleViewVideo(testimonial)}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            {isFromSupabase && !testimonial.approved && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => handleApproveTestimonial(testimonial.id)}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleRejectTestimonial(testimonial.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            {[...Array(testimonial.stars)].map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
            <span className="text-sm text-gray-500 ml-2">({testimonial.stars}/5)</span>
          </div>
          {(testimonial.message || testimonial.text) && (
            <p className="text-sm italic">"{testimonial.message || testimonial.text}"</p>
          )}
          {testimonial.context && (
            <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
              Context: {testimonial.context}
            </p>
          )}
          {testimonial.youtube_link && (
            <p className="text-xs text-red-600">YouTube: {testimonial.youtube_link}</p>
          )}
          {testimonial.video_url && (
            <p className="text-xs text-purple-600">Video: {testimonial.video_url}</p>
          )}
          <p className="text-xs text-gray-500">
            Display Order: {testimonial.display_order}
          </p>
          {isFromSupabase && (
            <p className="text-xs text-gray-500">
              Submitted: {new Date(testimonial.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonials Management</h2>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleExportToStatic}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Exporting..." : "Export to Static File"}
          </Button>
          <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="font-medium">Mixed Source Management</p>
            <p>Static testimonials from code + Dynamic testimonials from database</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Pending Testimonials from Database */}
        {pendingSupabaseTestimonials.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-700">
              Pending Testimonials - Database ({pendingSupabaseTestimonials.length})
            </h3>
            <div className="grid gap-4">
              {pendingSupabaseTestimonials.map((testimonial) => renderTestimonialCard(testimonial, true))}
            </div>
          </div>
        )}

        {/* Approved Testimonials */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">
            Approved Testimonials ({approvedStaticTestimonials.length + approvedSupabaseTestimonials.length})
          </h3>
          <div className="grid gap-4">
            {/* Static Approved Testimonials */}
            {approvedStaticTestimonials.map((testimonial) => renderTestimonialCard(testimonial, false))}
            
            {/* Database Approved Testimonials */}
            {approvedSupabaseTestimonials.map((testimonial) => renderTestimonialCard(testimonial, true))}
          </div>
        </div>

        {(staticTestimonials.length === 0 && supabaseTestimonials.length === 0) && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No testimonials found.</p>
              <p className="text-sm text-gray-400 mt-2">
                Static testimonials are managed in <code>src/data/testimonials.ts</code> and dynamic ones are submitted through the form.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManagement;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Play } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const TestimonialsManagement = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null);

  const handleViewVideo = (testimonial: any) => {
    if (testimonial.youtube_link) {
      window.open(testimonial.youtube_link, '_blank');
    }
  };

  const approvedTestimonials = testimonials.filter(t => t.approved);
  const pendingTestimonials = testimonials.filter(t => !t.approved);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonials Management</h2>
        <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <p className="font-medium">Static Testimonials Mode</p>
          <p>Testimonials are now managed in code at <code>src/data/testimonials.ts</code></p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Approved Testimonials */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">
            Approved Testimonials ({approvedTestimonials.length})
          </h3>
          <div className="grid gap-4">
            {approvedTestimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {testimonial.name}
                        <Badge variant="default">Approved</Badge>
                        {testimonial.youtube_link && (
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
                      {testimonial.youtube_link && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewVideo(testimonial)}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
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
                    {testimonial.message && (
                      <p className="text-sm italic">"{testimonial.message}"</p>
                    )}
                    {testimonial.context && (
                      <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
                        Context: {testimonial.context}
                      </p>
                    )}
                    {testimonial.youtube_link && (
                      <p className="text-xs text-red-600">YouTube: {testimonial.youtube_link}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Display Order: {testimonial.display_order}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pending Testimonials */}
        {pendingTestimonials.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-700">
              Pending Testimonials ({pendingTestimonials.length})
            </h3>
            <div className="grid gap-4">
              {pendingTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {testimonial.name}
                          <Badge variant="secondary">Pending</Badge>
                          {testimonial.youtube_link && (
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
                        {testimonial.youtube_link && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleViewVideo(testimonial)}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
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
                      {testimonial.message && (
                        <p className="text-sm italic">"{testimonial.message}"</p>
                      )}
                      {testimonial.context && (
                        <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
                          Context: {testimonial.context}
                        </p>
                      )}
                      {testimonial.youtube_link && (
                        <p className="text-xs text-red-600">YouTube: {testimonial.youtube_link}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Display Order: {testimonial.display_order}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {testimonials.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No testimonials found in the static data.</p>
              <p className="text-sm text-gray-400 mt-2">
                Add testimonials to <code>src/data/testimonials.ts</code> to see them here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManagement;


import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const orderSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  package: z.string().min(1, "Please select a package"),
  story: z.string().min(50, "Please provide at least 50 characters for your story"),
  musicStyle: z.string().optional(),
  specialRequests: z.string().optional(),
  deliveryAddress: z.string().optional(),
  isGift: z.boolean().default(false),
  recipientName: z.string().optional(),
  recipientEmail: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

const Order = () => {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      package: "",
      story: "",
      musicStyle: "",
      specialRequests: "",
      deliveryAddress: "",
      isGift: false,
      recipientName: "",
      recipientEmail: "",
    },
  });

  const packages = [
    { value: "personal", label: "Pachet Personal - 300 RON", price: 300 },
    { value: "business", label: "Pachet Business - 500 RON", price: 500 },
    { value: "premium", label: "Pachet Premium - 500 RON", price: 500 },
    { value: "artist", label: "Pachet Artist - 8000 RON", price: 8000 },
    { value: "instrumental", label: "Pachet Instrumental - 500 RON", price: 500 },
    { value: "remix", label: "Pachet Remix - 500 RON", price: 500 },
  ];

  const addons = [
    { id: "rush", label: "Livrare rapidă (24–48h)", price: 100 },
    { id: "commercial", label: "Drepturi comerciale", price: 100 },
    { id: "distribution", label: "Distribuție Mango Records", price: 200 },
    { id: "video", label: "Videoclip personalizat", price: 149 },
    { id: "audioMessage", label: "Mesaj audio de la expeditor", price: 100 },
    { id: "extended", label: "Melodie extinsă (3 strofe)", price: 49 },
  ];

  const selectedPackage = packages.find(p => p.value === form.watch("package"));
  const totalAddonPrice = selectedAddons.reduce((sum, addonId) => {
    const addon = addons.find(a => a.id === addonId);
    return sum + (addon?.price || 0);
  }, 0);
  const totalPrice = (selectedPackage?.price || 0) + totalAddonPrice;

  const handleAddonChange = (addonId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddons(prev => [...prev, addonId]);
    } else {
      setSelectedAddons(prev => prev.filter(id => id !== addonId));
    }
  };

  const onSubmit = (data: OrderFormData) => {
    console.log("Order submitted:", { ...data, addons: selectedAddons, totalPrice });
    toast({
      title: "Order Submitted!",
      description: "Thank you for your order. We'll contact you soon to confirm the details.",
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">Place Your Order</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Let's create something magical together. Fill out the form below to get started.
          </p>
        </div>
      </section>

      {/* Order Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your first name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your last name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Package Selection */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Package Selection</h3>
                        <FormField
                          control={form.control}
                          name="package"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Choose Package *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a package" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {packages.map((pkg) => (
                                    <SelectItem key={pkg.value} value={pkg.value}>
                                      {pkg.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Add-ons */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Add-ons (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {addons.map((addon) => (
                            <div key={addon.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={addon.id}
                                checked={selectedAddons.includes(addon.id)}
                                onCheckedChange={(checked) => handleAddonChange(addon.id, checked as boolean)}
                              />
                              <Label htmlFor={addon.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {addon.label} (+{addon.price} RON)
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Project Details</h3>
                        <FormField
                          control={form.control}
                          name="story"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Story *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us your story... What's the occasion? Who is this for? What emotions do you want to capture?"
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="musicStyle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Music Style</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Pop, Rock, Acoustic, Jazz..." {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="specialRequests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Special Requests</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Any special requests or additional information..."
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Gift Options */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Gift Options</h3>
                        <FormField
                          control={form.control}
                          name="isGift"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>This is a gift</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        {form.watch("isGift") && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                            <FormField
                              control={form.control}
                              name="recipientName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Recipient Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Gift recipient's name" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="recipientEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Recipient Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="Gift recipient's email" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>

                      <Button type="submit" className="w-full bg-gradient-purple hover:opacity-90 text-white py-3 text-lg">
                        Place Order - {totalPrice} RON
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPackage && (
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="font-medium">{selectedPackage.label.split(' - ')[0]}</span>
                      <span className="font-bold">{selectedPackage.price} RON</span>
                    </div>
                  )}
                  
                  {selectedAddons.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Add-ons:</h4>
                      {selectedAddons.map((addonId) => {
                        const addon = addons.find(a => a.id === addonId);
                        return addon ? (
                          <div key={addonId} className="flex justify-between items-center text-sm">
                            <span>{addon.label}</span>
                            <span>+{addon.price} RON</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-lg font-bold pt-4 border-t">
                    <span>Total:</span>
                    <span className="text-purple-600">{totalPrice} RON</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 pt-4">
                    <p className="mb-2">✓ Professional quality guaranteed</p>
                    <p className="mb-2">✓ Unlimited revisions</p>
                    <p className="mb-2">✓ 100% satisfaction guarantee</p>
                    <p>✓ Secure payment processing</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Order;

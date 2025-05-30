
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderWizard from "@/components/OrderWizard";
import UserMenu from "@/components/UserMenu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Order = () => {
  const { toast } = useToast();

  const handleOrderComplete = async (orderData: any) => {
    try {
      console.log("Order completed:", orderData);
      
      // Here you can save the order to Supabase if needed
      // For now, we'll just show the success message
      
      toast({
        title: "Comandă trimisă!",
        description: "Mulțumim pentru comandă. Vă vom contacta în curând pentru confirmarea detaliilor."
      });
    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la salvarea comenzii. Încercați din nou.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-gradient-purple backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="text-white font-bold text-xl">Music Gift</div>
            </div>
            <UserMenu />
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-purple text-white px-0 py-0">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">Plasează Comanda</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Să creăm ceva magic împreună. Completează formularul de mai jos pentru a începe.
          </p>
        </div>
      </section>

      {/* Order Wizard Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <OrderWizard onComplete={handleOrderComplete} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Order;

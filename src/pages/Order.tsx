import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderWizard from "@/components/OrderWizard";
import { useToast } from "@/hooks/use-toast";
const Order = () => {
  const {
    toast
  } = useToast();
  const handleOrderComplete = (orderData: any) => {
    console.log("Order completed:", orderData);
    toast({
      title: "Comandă trimisă!",
      description: "Mulțumim pentru comandă. Vă vom contacta în curând pentru confirmarea detaliilor."
    });
  };
  return <div className="min-h-screen">
      <Navigation />
      
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
    </div>;
};
export default Order;
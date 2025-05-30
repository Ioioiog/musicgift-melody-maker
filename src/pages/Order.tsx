
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderWizard from "@/components/OrderWizard";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { migratePackageData } from "@/utils/migratePackageData";
import { useEffect, useState } from "react";

const Order = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [migrationCompleted, setMigrationCompleted] = useState(false);

  useEffect(() => {
    // Run migration on first load (in production, this would be a one-time admin action)
    const runMigration = async () => {
      try {
        console.log("Checking if migration is needed...");
        const result = await migratePackageData();
        if (result.success) {
          console.log("Migration completed successfully");
        }
      } catch (error) {
        console.log("Migration may have already been run or there was an error:", error);
      } finally {
        setMigrationCompleted(true);
      }
    };

    runMigration();
  }, []);

  const handleOrderComplete = async (orderData: any) => {
    try {
      console.log("Order completed:", orderData);

      toast({
        title: t('orderSent'),
        description: t('orderThankYou')
      });
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: t('orderError'),
        description: t('orderErrorMessage'),
        variant: "destructive"
      });
    }
  };

  if (!migrationCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up dynamic packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="py-8 bg-gray-80">
        <div className="container mx-auto px-4">
          <OrderWizard onComplete={handleOrderComplete} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Order;

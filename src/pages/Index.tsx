
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setupSupabase } from "@/utils/supabaseSetup";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // Initialize Supabase on app start
  useEffect(() => {
    const initApp = async () => {
      try {
        const success = await setupSupabase();
        setIsSetupComplete(success);
      } catch (error) {
        console.error("Failed to initialize Supabase:", error);
        // Even if setup fails, we allow the app to continue in offline mode
        setIsSetupComplete(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    initApp();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-crimson" />
        <span className="ml-2 text-lg">Conectando ao banco de dados...</span>
      </div>
    );
  }

  // Redirect to home page
  return <Navigate to="/dashboard" />;
};

export default Index;

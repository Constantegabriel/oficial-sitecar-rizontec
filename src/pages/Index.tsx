
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
        // Tentar inicializar Supabase
        const success = await setupSupabase().catch((error) => {
          console.error("Erro ao configurar Supabase:", error);
          return false;
        });
        
        setIsSetupComplete(success);
        
        console.log("Inicialização do Supabase:", success ? "Sucesso" : "Falha");
      } catch (error) {
        console.error("Falha ao inicializar Supabase:", error);
        // Even if setup fails, we allow the app to continue in offline mode
        setIsSetupComplete(false);
      } finally {
        // Sempre permitir que o aplicativo continue, mesmo sem Supabase
        setTimeout(() => setIsLoading(false), 500); // Pequeno atraso para evitar flashes
      }
    };
    
    initApp();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-crimson" />
        <span className="ml-2 text-lg">Inicializando aplicação...</span>
      </div>
    );
  }

  // Redirect to dashboard page
  return <Navigate to="/dashboard" />;
};

export default Index;

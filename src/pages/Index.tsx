
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simple initialization without Supabase
  useEffect(() => {
    // Simply redirect after a short timeout for a smooth experience
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-t-crimson border-r-transparent border-b-transparent border-l-transparent rounded-full"></div>
        <span className="ml-2 text-lg">Inicializando aplicação...</span>
      </div>
    );
  }

  // Redirect to dashboard page
  return <Navigate to="/dashboard" />;
};

export default Index;

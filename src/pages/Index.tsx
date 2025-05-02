
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { setupSupabase } from "@/utils/supabaseSetup";

const Index = () => {
  // Initialize Supabase on app start
  useEffect(() => {
    setupSupabase();
  }, []);

  // Redirect to home page
  return <Navigate to="/" />;
};

export default Index;

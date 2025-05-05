
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Check for saved login in localStorage on mount
  useEffect(() => {
    setLoading(false);
  }, []);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-t-crimson border-r-transparent border-b-transparent border-l-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 ml-16 sm:ml-64">
        <Outlet />
      </main>
    </div>
  );
}

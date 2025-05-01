
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import CarList from "@/components/CarList";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useCars } from "@/contexts/CarContext";

export default function InventoryPage() {
  const location = useLocation();
  const { setFilters, clearFilters } = useCars();
  
  // Parse search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search');
    
    if (searchTerm) {
      setFilters({
        brand: searchTerm
      });
    } else {
      clearFilters();
    }
  }, [location.search, setFilters, clearFilters]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-6 pb-16">
          <h1 className="text-3xl font-bold mb-6">Nosso Estoque</h1>
          
          <SearchFilters />
          
          <div className="mt-8">
            <CarList />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

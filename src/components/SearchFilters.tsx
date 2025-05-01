
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CarFilters } from "@/types";
import { useCars } from "@/contexts/CarContext";

export default function SearchFilters() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<CarFilters>({});
  const navigate = useNavigate();
  const { setFilters: applyFilters, clearFilters } = useCars();
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Simple search implementation - navigate to inventory with search term
      navigate(`/estoque?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleFilterChange = (key: keyof CarFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleApplyFilters = () => {
    applyFilters(filters);
    setIsFilterOpen(false);
    navigate("/estoque");
  };
  
  const handleResetFilters = () => {
    setFilters({});
    clearFilters();
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder="Buscar carros..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-full" 
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {isFilterOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        
        <Button onClick={() => navigate("/estoque")}>
          Ver Estoque
        </Button>
      </div>
      
      {/* Filters Panel */}
      {isFilterOpen && (
        <div className="bg-secondary p-4 rounded-lg mb-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Brand filter */}
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input 
                id="brand" 
                placeholder="Ex: Toyota" 
                value={filters.brand || ""}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
              />
            </div>
            
            {/* Model filter */}
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input 
                id="model" 
                placeholder="Ex: Corolla" 
                value={filters.model || ""}
                onChange={(e) => handleFilterChange("model", e.target.value)}
              />
            </div>
            
            {/* Color filter */}
            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Input 
                id="color" 
                placeholder="Ex: Preto" 
                value={filters.color || ""}
                onChange={(e) => handleFilterChange("color", e.target.value)}
              />
            </div>
            
            {/* Year range */}
            <div className="flex gap-2">
              <div className="space-y-2 flex-1">
                <Label htmlFor="minYear">Ano Mín.</Label>
                <Input 
                  id="minYear" 
                  type="number" 
                  placeholder="Ex: 2015" 
                  value={filters.minYear || ""}
                  onChange={(e) => handleFilterChange("minYear", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="maxYear">Ano Máx.</Label>
                <Input 
                  id="maxYear" 
                  type="number" 
                  placeholder="Ex: 2023" 
                  value={filters.maxYear || ""}
                  onChange={(e) => handleFilterChange("maxYear", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
            
            {/* Price range */}
            <div className="flex gap-2">
              <div className="space-y-2 flex-1">
                <Label htmlFor="minPrice">Preço Mín.</Label>
                <Input 
                  id="minPrice" 
                  type="number" 
                  placeholder="Ex: 50000" 
                  value={filters.minPrice || ""}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="maxPrice">Preço Máx.</Label>
                <Input 
                  id="maxPrice" 
                  type="number" 
                  placeholder="Ex: 100000" 
                  value={filters.maxPrice || ""}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
            
            {/* KM range */}
            <div className="flex gap-2">
              <div className="space-y-2 flex-1">
                <Label htmlFor="minKm">KM Mín.</Label>
                <Input 
                  id="minKm" 
                  type="number" 
                  placeholder="Ex: 0" 
                  value={filters.minKm || ""}
                  onChange={(e) => handleFilterChange("minKm", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="maxKm">KM Máx.</Label>
                <Input 
                  id="maxKm" 
                  type="number" 
                  placeholder="Ex: 50000" 
                  value={filters.maxKm || ""}
                  onChange={(e) => handleFilterChange("maxKm", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleResetFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={handleApplyFilters}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

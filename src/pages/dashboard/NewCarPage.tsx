
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useCars } from "@/contexts/CarContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Car } from "@/types";

export default function NewCarPage() {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    km: 0,
    color: "",
    description: "",
    images: ["", "", ""], // Up to 3 images
    featured: false
  });
  
  const { addCar } = useCars();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    
    setFormData({
      ...formData,
      images: newImages
    });
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      featured: checked
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Filter out empty image URLs
      const filteredImages = formData.images.filter(img => img.trim() !== '');
      
      // Create car object without typecasting for now
      const carData = {
        ...formData,
        images: filteredImages
      };
      
      // Add the car with the proper type to satisfy TypeScript
      addCar(carData as Omit<Car, 'id' | 'createdAt' | 'updatedAt' | 'status'>);
      
      toast({
        title: "Carro adicionado com sucesso",
        description: "O carro foi adicionado ao inventário"
      });
      
      // Navigate back to inventory
      navigate("/dashboard/estoque");
    } catch (error) {
      toast({
        title: "Erro ao adicionar carro",
        description: "Ocorreu um erro ao adicionar o carro",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Adicionar Novo Anúncio</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input 
                id="brand" 
                name="brand" 
                placeholder="Ex: Toyota" 
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input 
                id="model" 
                name="model" 
                placeholder="Ex: Corolla" 
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Input 
                  id="year" 
                  name="year" 
                  type="number" 
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  placeholder="Ex: 2022" 
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <Input 
                  id="color" 
                  name="color" 
                  placeholder="Ex: Preto" 
                  value={formData.color}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number"
                  min="0" 
                  step="0.01"
                  placeholder="Ex: 90000" 
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="km">Quilometragem</Label>
                <Input 
                  id="km" 
                  name="km" 
                  type="number"
                  min="0" 
                  placeholder="Ex: 15000" 
                  value={formData.km}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="featured"
                checked={formData.featured}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="featured">Destacar anúncio</Label>
            </div>
          </div>
          
          {/* Description and Images */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Descreva o veículo, seus opcionais e características..." 
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Imagens (URLs)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Adicione URLs de imagens para o carro (máximo 3)
              </p>
              
              {formData.images.map((url, index) => (
                <Input 
                  key={index}
                  placeholder={`URL da imagem ${index + 1}`}
                  value={url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="mb-2"
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate("/dashboard/estoque")}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Anúncio"}
          </Button>
        </div>
      </form>
    </div>
  );
}


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { WhatsappIcon } from "./icons";
import { useState } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface CarDetailsModalProps {
  car: Car;
}

export default function CarDetailsModal({ car }: CarDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasImages = car.images && car.images.length > 0;
  
  const goToNextImage = () => {
    if (!hasImages) return;
    setCurrentImageIndex(prev => 
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const goToPrevImage = () => {
    if (!hasImages) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };
  
  const currentImage = hasImages 
    ? car.images[currentImageIndex] 
    : "https://placehold.co/800x500?text=Sem+Imagem";

  return (
    <div>
      <DialogHeader className="mb-4">
        <DialogTitle className="text-2xl font-bold">
          {car.brand} {car.model}
        </DialogTitle>
        <DialogDescription>
          {car.year} • {car.km.toLocaleString()} km • {car.color}
        </DialogDescription>
      </DialogHeader>
      
      {/* Image gallery with navigation */}
      <div className="relative mb-6">
        {/* Main image */}
        <div 
          className="h-64 sm:h-80 bg-center bg-cover rounded-lg mb-2" 
          style={{ backgroundImage: `url(${currentImage})` }}
        />
        
        {/* Arrows for navigation */}
        {hasImages && car.images.length > 1 && (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full"
              onClick={goToPrevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full"
              onClick={goToNextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
        
        {/* Thumbnails */}
        {hasImages && (
          <div className="flex gap-2 overflow-x-auto py-2">
            {car.images.map((img, idx) => (
              <div 
                key={idx}
                className={`w-20 h-16 flex-shrink-0 bg-center bg-cover rounded cursor-pointer border-2 ${idx === currentImageIndex ? 'border-crimson' : 'border-transparent'}`}
                style={{ backgroundImage: `url(${img})` }}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Price and badges */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold text-crimson">
          {formatCurrency(car.price)}
        </div>
        <div className="flex gap-2">
          {car.featured && (
            <Badge className="bg-crimson">Destaque</Badge>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">Detalhes</TabsTrigger>
          <TabsTrigger value="description" className="flex-1">Descrição</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <div className="grid grid-cols-2 gap-y-3">
            <div>
              <span className="text-muted-foreground">Marca:</span>
              <p className="font-medium">{car.brand}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Modelo:</span>
              <p className="font-medium">{car.model}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Ano:</span>
              <p className="font-medium">{car.year}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Quilometragem:</span>
              <p className="font-medium">{car.km.toLocaleString()} km</p>
            </div>
            <div>
              <span className="text-muted-foreground">Cor:</span>
              <p className="font-medium">{car.color}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="description" className="pt-4">
          <p className="text-muted-foreground">
            {car.description}
          </p>
        </TabsContent>
      </Tabs>
      
      <div className="flex gap-2 mt-6">
        <a 
          href={`https://wa.me/5511999999999?text=Olá, estou interessado no ${car.brand} ${car.model} ${car.year}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full bg-[#25D366] hover:bg-[#25D366]/90">
            <WhatsappIcon className="h-4 w-4 mr-2" />
            Contato via WhatsApp
          </Button>
        </a>
        
        <a 
          href="https://instagram.com"
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="outline" className="w-full">
            <Instagram className="h-4 w-4 mr-2" />
            Instagram
          </Button>
        </a>
      </div>
    </div>
  );
}

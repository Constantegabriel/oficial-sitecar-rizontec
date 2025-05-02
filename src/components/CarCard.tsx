
import { Car } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Info } from "lucide-react";
import { WhatsappIcon } from "./icons";
import CarDetailsModal from "./CarDetailsModal";
import { useState } from "react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  // State to control dialog open/close
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get default image or placeholder
  const defaultImage = car.images && car.images.length > 0 
    ? car.images[0] 
    : "https://placehold.co/600x400?text=Sem+Imagem";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-crimson border-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div 
          className="relative cursor-pointer" 
          onClick={() => setIsDialogOpen(true)}
        >
          <div 
            className="h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${defaultImage})` }}
          />
          
          {car.featured && (
            <Badge className="absolute top-2 right-2 bg-crimson">
              Destaque
            </Badge>
          )}
        </div>
        
        <DialogContent className="max-w-3xl w-[90vw] max-h-[80vh] overflow-y-auto overflow-x-hidden">
          <DialogTitle>
            <VisuallyHidden>{car.brand} {car.model} - Detalhes</VisuallyHidden>
          </DialogTitle>
          <CarDetailsModal car={car} />
        </DialogContent>
      </Dialog>
      
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold text-lg">{car.brand} {car.model}</h3>
          
          <div className="text-xl font-semibold text-crimson">
            {formatCurrency(car.price)}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Ano:</span>
              <span className="font-medium text-foreground">{car.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>KM:</span>
              <span className="font-medium text-foreground">{car.km.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Cor:</span>
              <span className="font-medium text-foreground">{car.color}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsDialogOpen(true)}
            >
              <Info className="h-4 w-4 mr-2" />
              Detalhes
            </Button>
            
            <a 
              href={`https://wa.me/5511999999999?text=Olá, estou interessado no ${car.brand} ${car.model} ${car.year}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full bg-[#25D366] hover:bg-[#25D366]/90">
                <WhatsappIcon className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

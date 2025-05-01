
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const promotions = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763",
    title: "Promoção de lançamento",
    description: "Carros 0km com até 20% de desconto!",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888",
    title: "Seminovos premium",
    description: "Condições especiais para modelos selecionados",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
    title: "Financiamento facilitado",
    description: "Aprovação em minutos com taxas a partir de 0.99%",
  },
];

export default function PromotionSwiper() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchPosition, setTouchPosition] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchDown = touchPosition;
    
    if (touchDown === null) {
      return;
    }
    
    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;
    
    if (diff > 5) {
      goToNextSlide();
    }
    
    if (diff < -5) {
      goToPrevSlide();
    }
    
    setTouchPosition(null);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? promotions.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Auto-play functionality
  useEffect(() => {
    let interval: number;
    
    if (isAutoPlaying) {
      interval = window.setInterval(() => {
        setCurrentSlide((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
      }, 5000);
    }
    
    return () => {
      window.clearInterval(interval);
    };
  }, [isAutoPlaying]);

  // Reset auto-play after 10 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [currentSlide, isAutoPlaying]);

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg mb-8">
      {/* Swiper content */}
      <div 
        className="flex transition-transform duration-500 ease-out h-[30vh] md:h-[40vh] lg:h-[50vh]" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {promotions.map((promotion, index) => (
          <div 
            key={promotion.id} 
            className="min-w-full relative"
          >
            <div 
              className="absolute inset-0 bg-center bg-cover bg-no-repeat" 
              style={{ 
                backgroundImage: `url(${promotion.image})`,
                filter: 'brightness(0.4)'
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {promotion.title}
              </h2>
              <p className="text-lg md:text-xl">
                {promotion.description}
              </p>
              <Button 
                className="mt-4 bg-crimson hover:bg-crimson/90 text-white"
              >
                Ver ofertas
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full" 
        onClick={goToPrevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full" 
        onClick={goToNextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {promotions.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              currentSlide === index ? "bg-crimson w-4" : "bg-white/60"
            )}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

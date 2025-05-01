
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromotionSwiper from "@/components/PromotionSwiper";
import SearchFilters from "@/components/SearchFilters";
import CarList from "@/components/CarList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, Instagram, Whatsapp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero section with promotion swiper */}
        <section className="container mx-auto px-4">
          <PromotionSwiper />
        </section>
        
        {/* Search filters */}
        <section>
          <SearchFilters />
        </section>
        
        {/* Featured cars */}
        <section className="container mx-auto px-4 mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Veículos em Destaque</h2>
            <Link to="/estoque">
              <Button variant="outline" className="flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Ver Todos
              </Button>
            </Link>
          </div>
          
          <CarList limit={6} />
        </section>
        
        {/* About section */}
        <section className="bg-secondary/50 py-16 mt-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-4">Sobre a RizonTec</h2>
                <p className="text-muted-foreground mb-6">
                  A RizonTec é uma loja de veículos premium que oferece os melhores carros do mercado
                  com condições especiais e garantia de procedência. Com anos de experiência,
                  buscamos proporcionar a melhor experiência na compra do seu veículo.
                </p>
                <div className="flex gap-4">
                  <Link to="/sobre">
                    <Button variant="outline">
                      Saiba Mais
                    </Button>
                  </Link>
                  <Link to="/contato">
                    <Button className="bg-crimson hover:bg-crimson/90">
                      Fale Conosco
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="bg-[url('https://images.unsplash.com/photo-1560253023-3ec5d502959f')] bg-cover bg-center h-80 rounded-lg shadow-lg"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Social media section */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mb-4">Conecte-se conosco</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Siga nossas redes sociais para ficar por dentro das novidades, 
              promoções e conteúdos exclusivos sobre o mundo automotivo.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-purple-600 to-pink-500 text-white py-3 px-6 rounded-lg flex items-center"
              >
                <Instagram className="h-5 w-5 mr-2" />
                Instagram
              </a>
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white py-3 px-6 rounded-lg flex items-center"
              >
                <Whatsapp className="h-5 w-5 mr-2" />
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

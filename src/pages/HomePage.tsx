
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromotionSwiper from "@/components/PromotionSwiper";
import SearchFilters from "@/components/SearchFilters";
import CarList from "@/components/CarList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, Instagram } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";

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
                <div className="bg-[url('data:image/jpeg;base64,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')] bg-cover bg-center h-80 rounded-lg shadow-lg"></div>
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
                href="https://wa.me/5548998143419" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white py-3 px-6 rounded-lg flex items-center"
              >
                <WhatsappIcon className="h-5 w-5 mr-2" />
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

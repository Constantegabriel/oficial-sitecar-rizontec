
import { Instagram, Mail, MapPin, Phone, Smartphone } from "lucide-react";
import { WhatsappIcon } from "./icons";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-12">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              <span className="text-crimson">Rizon</span>Tec
            </h3>
            <p className="text-muted-foreground mb-4">
              Uma loja de automóveis premium, oferecendo os melhores carros com 
              condições especiais e garantia de procedência.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-crimson hover:bg-crimson/90 text-white p-2 rounded-full"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-crimson hover:bg-crimson/90 text-white p-2 rounded-full"
              >
                <WhatsappIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-crimson transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/estoque" className="text-muted-foreground hover:text-crimson transition-colors">
                  Ver estoque completo
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-muted-foreground hover:text-crimson transition-colors">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-crimson transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/financiamento" className="text-muted-foreground hover:text-crimson transition-colors">
                  Financiamento
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-crimson" />
                <span className="text-muted-foreground">
                  Av. das Concessionárias, 1234, São Paulo - SP
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-crimson" />
                <span className="text-muted-foreground">(11) 3333-4444</span>
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-crimson" />
                <span className="text-muted-foreground">(11) 99999-8888</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-crimson" />
                <span className="text-muted-foreground">contato@rizontec.com.br</span>
              </li>
            </ul>
            <div className="mt-4">
              <Button variant="outline" className="w-full border-crimson text-crimson hover:bg-crimson/10">
                <Phone className="h-4 w-4 mr-2" /> Ligue Agora
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-6 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RizonTec. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

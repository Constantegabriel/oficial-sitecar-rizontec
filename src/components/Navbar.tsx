
import { Button } from "@/components/ui/button";
import { LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import LoginForm from "@/components/LoginForm";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="bg-background border-b border-border">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Logo and Slogan */}
        <div className="flex flex-col">
          <Link to="/" className="text-2xl font-bold text-white">
            <span className="text-crimson">Rizon</span>Tec
          </Link>
          <span className="text-xs text-muted-foreground">
            Sua nova experiência em carros
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm hover:text-crimson transition-colors">
            Início
          </Link>
          <Link to="/estoque" className="text-sm hover:text-crimson transition-colors">
            Estoque
          </Link>
          <Link to="/sobre" className="text-sm hover:text-crimson transition-colors">
            Sobre
          </Link>
          <Link to="/contato" className="text-sm hover:text-crimson transition-colors">
            Contato
          </Link>
        </div>

        {/* Login Button / Dashboard Link - More subtle styling */}
        <div className="flex items-center">
          {user ? (
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-crimson hover:bg-crimson/10 opacity-80 hover:opacity-100">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-crimson hover:bg-crimson/10 opacity-80 hover:opacity-100">
                  <LogIn className="h-4 w-4 mr-1" /> Login
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md overflow-hidden">
                <LoginForm />
              </DialogContent>
            </Dialog>
          )}

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-4 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-crimson" />
            ) : (
              <Menu className="h-6 w-6 text-crimson" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-4 py-2 space-y-2 bg-secondary/50">
            <Link 
              to="/"
              className="block p-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/estoque"
              className="block p-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Estoque
            </Link>
            <Link 
              to="/sobre"
              className="block p-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link 
              to="/contato"
              className="block p-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

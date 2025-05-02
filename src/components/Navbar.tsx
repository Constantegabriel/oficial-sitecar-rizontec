
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
          
          {/* Login Button / Dashboard Link no Desktop */}
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
        </div>

        {/* Mobile Menu Button - Removed login button here */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-crimson" />
          ) : (
            <Menu className="h-6 w-6 text-crimson" />
          )}
        </Button>
      </nav>

      {/* Mobile Menu with animation */}
      <div 
        className={`md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: '61px', height: 'calc(100vh - 61px)' }}
      >
        <div className="px-4 py-6 space-y-4 flex flex-col h-full">
          <div className="space-y-4">
            <Link 
              to="/"
              className="block p-3 rounded-md hover:bg-secondary transition-colors transform transition-all duration-200 hover:translate-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/estoque"
              className="block p-3 rounded-md hover:bg-secondary transition-colors transform transition-all duration-200 hover:translate-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Estoque
            </Link>
            <Link 
              to="/sobre"
              className="block p-3 rounded-md hover:bg-secondary transition-colors transform transition-all duration-200 hover:translate-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link 
              to="/contato"
              className="block p-3 rounded-md hover:bg-secondary transition-colors transform transition-all duration-200 hover:translate-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>
            
            {/* Login Button / Dashboard Link in Mobile Menu */}
            <div className="pt-4 border-t border-border">
              {user ? (
                <Link 
                  to="/dashboard"
                  className="block w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="default" className="w-full justify-center">
                    <span className="mr-2">Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" className="w-full justify-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      <span>Login</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md overflow-hidden">
                    <LoginForm onClose={() => setMobileMenuOpen(false)} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

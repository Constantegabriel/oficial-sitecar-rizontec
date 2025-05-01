
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Smartphone, Send, Instagram, Whatsapp } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Mensagem enviada",
        description: "Agradecemos o seu contato. Retornaremos em breve!"
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center">Entre em Contato</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-secondary/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Envie-nos uma mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-crimson hover:bg-crimson/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Informações de Contato</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-crimson flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Endereço</h3>
                    <p className="text-muted-foreground">
                      Av. das Concessionárias, 1234<br />
                      Bairro Automotivo - São Paulo, SP<br />
                      CEP: 04000-000
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-crimson flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Telefone Fixo</h3>
                    <p className="text-muted-foreground">
                      (11) 3333-4444
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Smartphone className="h-6 w-6 text-crimson flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <p className="text-muted-foreground">
                      (11) 99999-8888
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-crimson flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">
                      contato@rizontec.com.br
                    </p>
                  </div>
                </div>
                
                <div className="pt-6">
                  <h3 className="font-medium mb-4">Redes Sociais</h3>
                  <div className="flex gap-3">
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-secondary hover:bg-secondary/80 p-3 rounded-full"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a 
                      href="https://wa.me/5511999999999" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-secondary hover:bg-secondary/80 p-3 rounded-full"
                    >
                      <Whatsapp className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                
                <div className="pt-6">
                  <h3 className="font-medium mb-4">Horário de Funcionamento</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Segunda à Sexta</span>
                      <span className="text-muted-foreground">8:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado</span>
                      <span className="text-muted-foreground">9:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo</span>
                      <span className="text-muted-foreground">Fechado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-6">Nossa Localização</h2>
            <div className="h-80 bg-secondary rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Mapa seria exibido aqui</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

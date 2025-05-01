
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Sobre a RizonTec</h1>
            
            <div className="bg-secondary/30 rounded-lg p-6 mb-8">
              <p className="italic text-lg text-muted-foreground">
                "Nossa missão é proporcionar a melhor experiência na compra do seu veículo, 
                com transparência, qualidade e atendimento personalizado."
              </p>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="mb-4">
                Fundada em 2015, a RizonTec nasceu com o propósito de revolucionar o mercado 
                de vendas de automóveis, trazendo um conceito moderno e tecnológico para o setor.
              </p>
              
              <p className="mb-4">
                Nossa equipe é formada por profissionais apaixonados por carros e comprometidos em 
                oferecer a melhor experiência de compra para nossos clientes. Aqui, você encontra 
                veículos seminovos e novos de alta qualidade, todos com garantia de procedência e 
                estado de conservação.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Nossos Diferenciais</h2>
              
              <ul className="list-disc ml-6 mb-6 space-y-2">
                <li>Garantia em todos os veículos</li>
                <li>Financiamento com as melhores taxas do mercado</li>
                <li>Transparência em todo o processo de venda</li>
                <li>Profissionais qualificados e atendimento personalizado</li>
                <li>Veículos certificados e com histórico completo</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Nossa História</h2>
              
              <p className="mb-4">
                Começamos como uma pequena loja na cidade de São Paulo, com apenas 5 funcionários 
                e um estoque reduzido. Com o passar dos anos, conquistamos a confiança de nossos clientes 
                e ampliamos nossa operação, sempre mantendo nosso compromisso com a qualidade e excelência.
              </p>
              
              <p className="mb-4">
                Hoje, somos referência no mercado de veículos premium, com instalações modernas e um 
                amplo estoque para atender às diversas necessidades de nossos clientes.
              </p>
              
              <div className="mt-8">
                <Link to="/contato">
                  <Button className="bg-crimson hover:bg-crimson/90">
                    Entre em Contato
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

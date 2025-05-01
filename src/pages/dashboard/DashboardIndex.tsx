
import { useCars } from "@/contexts/CarContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { 
  Car as CarIcon, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDown, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardIndex() {
  const { cars, transactions } = useCars();
  
  // Statistics calculations
  const availableCarsCount = cars.filter(car => car.status === 'available').length;
  const soldCarsCount = cars.filter(car => car.status === 'sold').length;
  const exchangedCarsCount = cars.filter(car => car.status === 'exchanged').length;
  
  const totalSalesValue = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExchangeValue = transactions
    .filter(t => t.type === 'exchange')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalTransactionsValue = totalSalesValue + totalExchangeValue;
  
  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Get recent cars added
  const recentCars = [...cars]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter(car => car.status === 'available')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Carros no Estoque
            </CardTitle>
            <CarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableCarsCount}</div>
            <p className="text-xs text-muted-foreground">
              Total de carros disponíveis
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Vendidos
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldCarsCount}</div>
            <p className="text-xs text-muted-foreground">
              Carros vendidos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Trocados
            </CardTitle>
            <ArrowDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exchangedCarsCount}</div>
            <p className="text-xs text-muted-foreground">
              Carros trocados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-crimson" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalTransactionsValue)}</div>
            <p className="text-xs text-muted-foreground">
              Vendas + Trocas
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cars */}
        <Card>
          <CardHeader>
            <CardTitle>Carros Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCars.length > 0 ? (
              <div className="space-y-2">
                {recentCars.map(car => (
                  <div key={car.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{car.brand} {car.model}</p>
                      <p className="text-sm text-muted-foreground">{car.year} • {car.color}</p>
                    </div>
                    <p className="font-semibold text-crimson">{formatCurrency(car.price)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum carro adicionado recentemente
              </p>
            )}
            
            <Link to="/dashboard/estoque">
              <button className="w-full text-center text-sm text-muted-foreground hover:text-crimson transition-colors">
                Ver todos os carros
              </button>
            </Link>
          </CardContent>
        </Card>
        
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransactions.length > 0 ? (
              <div className="space-y-2">
                {recentTransactions.map(transaction => {
                  const relatedCar = cars.find(car => car.id === transaction.carId);
                  return (
                    <div key={transaction.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        {transaction.type === 'sale' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {relatedCar ? `${relatedCar.brand} ${relatedCar.model}` : 'Carro desconhecido'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.type === 'sale' ? 'Venda' : 'Troca'}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-crimson">{formatCurrency(transaction.amount)}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma transação recente
              </p>
            )}
            
            <Link to="/dashboard/financeiro">
              <button className="w-full text-center text-sm text-muted-foreground hover:text-crimson transition-colors">
                Ver todas as transações
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

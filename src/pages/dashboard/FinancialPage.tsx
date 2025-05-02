
import { useCars } from "@/contexts/CarContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { DollarSign, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinancialPage() {
  const { transactions, cars } = useCars();
  
  // Calculate financial statistics
  const totalSales = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExchanges = transactions
    .filter(t => t.type === 'exchange')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalRevenue = totalSales + totalExchanges;
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get car details for a transaction
  const getCarDetails = (carId: string) => {
    return cars.find(car => car.id === carId);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Fluxo de Caixa</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              Total de carros vendidos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Trocas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExchanges)}</div>
            <p className="text-xs text-muted-foreground">
              Total de carros trocados
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
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Receita total do negócio
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Histórico de Transações</h2>
        
        <div className="space-y-3">
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-6 bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Nenhuma transação registrada</p>
            </div>
          ) : (
            sortedTransactions.map((transaction) => {
              const car = getCarDetails(transaction.carId);
              return (
                <div key={transaction.id} className="border rounded-md p-4 bg-card">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </div>
                      <div className="font-medium">
                        {car ? `${car.brand} ${car.model} (${car.year})` : 'Veículo não encontrado'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {transaction.type === 'sale' ? (
                        <span className="flex items-center text-green-500 text-sm">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Venda
                        </span>
                      ) : (
                        <span className="flex items-center text-yellow-500 text-sm">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          Troca
                        </span>
                      )}
                      
                      <div className="font-bold">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {transactions.length > 5 && (
          <div className="flex justify-center mt-4">
            <Button variant="outline">
              Carregar Mais
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

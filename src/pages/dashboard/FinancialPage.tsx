
import { useCars } from "@/contexts/CarContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Nenhuma transação registrada
                  </TableCell>
                </TableRow>
              ) : (
                sortedTransactions.map((transaction) => {
                  const car = getCarDetails(transaction.carId);
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell className="font-medium">
                        {car ? `${car.brand} ${car.model} (${car.year})` : 'Veículo não encontrado'}
                      </TableCell>
                      <TableCell>
                        {transaction.type === 'sale' ? (
                          <span className="flex items-center text-green-500">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Venda
                          </span>
                        ) : (
                          <span className="flex items-center text-yellow-500">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            Troca
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        {transactions.length > 0 && (
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

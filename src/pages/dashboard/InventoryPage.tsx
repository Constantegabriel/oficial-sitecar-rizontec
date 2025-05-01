
import { useCars } from "@/contexts/CarContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { Edit, Trash2, Search, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function InventoryPage() {
  const { cars, deleteCar, updateCar } = useCars();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<'sold' | 'exchanged' | 'deleted'>('sold');
  const [carToEdit, setCarToEdit] = useState<any>(null);
  
  // Filter cars based on search term
  const filteredCars = cars.filter(car => {
    if (car.status !== 'available') return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      car.brand.toLowerCase().includes(searchLower) ||
      car.model.toLowerCase().includes(searchLower) ||
      car.year.toString().includes(searchLower) ||
      car.color.toLowerCase().includes(searchLower)
    );
  });
  
  const handleDelete = () => {
    if (selectedCarId) {
      if (transactionType === 'deleted') {
        // Just remove the car from available list by marking it as "deleted"
        updateCar(selectedCarId, { 
          status: 'deleted', 
          updatedAt: new Date().toISOString() 
        });
        
        toast({
          title: "Anúncio excluído",
          description: "O anúncio foi removido do estoque"
        });
      } else {
        // Process as a sale or exchange transaction
        deleteCar(
          selectedCarId, 
          transactionType, 
          transactionAmount
        );
      }
      
      setSelectedCarId(null);
      setTransactionAmount(0);
    }
  };
  
  const handleUpdateCar = () => {
    if (carToEdit) {
      updateCar(carToEdit.id, carToEdit);
      setCarToEdit(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Estoque</h1>
        <Link to="/dashboard/novo-anuncio">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Anúncio
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar carros..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Carro</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>KM</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Nenhum carro encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell className="font-medium">
                    {car.brand} {car.model}
                  </TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>{car.color}</TableCell>
                  <TableCell>{car.km.toLocaleString()}</TableCell>
                  <TableCell>{formatCurrency(car.price)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setCarToEdit({ ...car })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="overflow-y-auto max-h-[80vh] overflow-x-hidden">
                          <DialogHeader>
                            <DialogTitle>Editar Anúncio</DialogTitle>
                          </DialogHeader>
                          {carToEdit && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-brand">Marca</Label>
                                  <Input 
                                    id="edit-brand" 
                                    value={carToEdit.brand}
                                    onChange={(e) => setCarToEdit({
                                      ...carToEdit,
                                      brand: e.target.value
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-model">Modelo</Label>
                                  <Input 
                                    id="edit-model" 
                                    value={carToEdit.model}
                                    onChange={(e) => setCarToEdit({
                                      ...carToEdit,
                                      model: e.target.value
                                    })}
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-year">Ano</Label>
                                  <Input 
                                    id="edit-year" 
                                    type="number"
                                    value={carToEdit.year}
                                    onChange={(e) => setCarToEdit({
                                      ...carToEdit,
                                      year: Number(e.target.value)
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-color">Cor</Label>
                                  <Input 
                                    id="edit-color" 
                                    value={carToEdit.color}
                                    onChange={(e) => setCarToEdit({
                                      ...carToEdit,
                                      color: e.target.value
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-km">KM</Label>
                                  <Input 
                                    id="edit-km" 
                                    type="number"
                                    value={carToEdit.km}
                                    onChange={(e) => setCarToEdit({
                                      ...carToEdit,
                                      km: Number(e.target.value)
                                    })}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="edit-price">Preço</Label>
                                <Input 
                                  id="edit-price" 
                                  type="number"
                                  value={carToEdit.price}
                                  onChange={(e) => setCarToEdit({
                                    ...carToEdit,
                                    price: Number(e.target.value)
                                  })}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Descrição</Label>
                                <Input 
                                  id="edit-description" 
                                  value={carToEdit.description}
                                  onChange={(e) => setCarToEdit({
                                    ...carToEdit,
                                    description: e.target.value
                                  })}
                                />
                              </div>
                              
                              <div className="flex justify-end gap-2 pt-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setCarToEdit(null)}
                                >
                                  Cancelar
                                </Button>
                                <Button onClick={handleUpdateCar}>
                                  Salvar Alterações
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedCarId(car.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remover Anúncio</DialogTitle>
                            <DialogDescription>
                              Escolha como deseja remover o anúncio do {car?.brand} {car?.model}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                variant={transactionType === 'deleted' ? 'default' : 'outline'}
                                onClick={() => setTransactionType('deleted')}
                                className="flex-1"
                              >
                                Apenas Excluir
                              </Button>
                              <Button
                                variant={transactionType === 'sold' ? 'default' : 'outline'}
                                onClick={() => setTransactionType('sold')}
                                className="flex-1"
                              >
                                Vendido
                              </Button>
                              <Button 
                                variant={transactionType === 'exchanged' ? 'default' : 'outline'}
                                onClick={() => setTransactionType('exchanged')}
                                className="flex-1"
                              >
                                Trocado
                              </Button>
                            </div>

                            {transactionType !== 'deleted' && (
                              <div className="space-y-2">
                                <Label htmlFor="transaction-amount">Valor da Transação</Label>
                                <Input 
                                  id="transaction-amount" 
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={transactionAmount}
                                  onChange={(e) => setTransactionAmount(Number(e.target.value))}
                                />
                              </div>
                            )}

                            <DialogFooter className="pt-2">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setSelectedCarId(null);
                                  setTransactionAmount(0);
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={handleDelete}
                              >
                                Confirmar
                              </Button>
                            </DialogFooter>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

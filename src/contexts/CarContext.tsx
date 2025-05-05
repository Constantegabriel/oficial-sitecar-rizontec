
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Car, Transaction, CarFilters } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Sample car data
const initialCars: Car[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    price: 120000,
    km: 10000,
    color: 'Branco',
    description: 'Toyota Corolla XEi 2.0 Flex, completo, único dono, revisões em concessionária.',
    images: ['/cor1.jpeg', '/cor2.jpeg', '/cor3.jpeg' ],
    featured: true,
    status: 'available',
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-10-15T10:30:00Z'
  },
  {
    id: '2',
    brand: 'Volkswagem',
    model: 'Nivus Comfortline',
    year: 2024,
    price: 150000,
    km: 0,
    color: 'Chumbo',
    description: 'Carro zero e completo.',
    images: ['/vol1.jpeg', '/vol2.jpeg', '/vol3.jpeg'],
    featured: false,
    status: 'available',
    createdAt: '2023-09-20T14:15:00Z',
    updatedAt: '2023-09-20T14:15:00Z'
  },
  {
    id: '3',
    brand: 'Bmw',
    model: '320i',
    year: 2024,
    price: 300000,
    km: 2000,
    color: 'Azul',
    description: 'Bmw Azul, zera.',
    images: ['/bm4.jpeg', '/bm3.jpeg', '/bmw2.jpeg'],
    featured: true,
    status: 'available',
    createdAt: '2024-01-05T09:45:00Z',
    updatedAt: '2024-01-05T09:45:00Z'
  },
];

// Sample transactions
const initialTransactions: Transaction[] = [];

interface CarContextType {
  cars: Car[];
  filteredCars: Car[];
  transactions: Transaction[];
  addCar: (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updateCar: (id: string, car: Partial<Car>) => Promise<void>;
  deleteCar: (id: string, status: 'sold' | 'exchanged' | 'deleted', amount: number) => Promise<void>;
  setFilters: (filters: CarFilters) => void;
  clearFilters: () => void;
  getCarById: (id: string) => Car | undefined;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export function CarProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>(() => {
    const savedCars = localStorage.getItem('cars');
    return savedCars ? JSON.parse(savedCars) : initialCars;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : initialTransactions;
  });
  
  const [filters, setFilters] = useState<CarFilters>({});
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const { toast } = useToast();

  // Save cars to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cars', JSON.stringify(cars));
  }, [cars]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Apply filters whenever cars or filters change
  useEffect(() => {
    const filtered = cars.filter(car => {
      if (car.status !== 'available') return false;
      if (filters.brand && car.brand !== filters.brand) return false;
      if (filters.model && car.model !== filters.model) return false;
      if (filters.minYear && car.year < filters.minYear) return false;
      if (filters.maxYear && car.year > filters.maxYear) return false;
      if (filters.minKm && car.km < filters.minKm) return false;
      if (filters.maxKm && car.km > filters.maxKm) return false;
      if (filters.minPrice && car.price < filters.minPrice) return false;
      if (filters.maxPrice && car.price > filters.maxPrice) return false;
      if (filters.color && car.color !== filters.color) return false;
      return true;
    });
    setFilteredCars(filtered);
  }, [cars, filters]);

  const addCar = async (carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      const now = new Date().toISOString();
      const newCar: Car = {
        ...carData,
        id: `car-${Date.now()}`,
        status: 'available',
        createdAt: now,
        updatedAt: now
      };
      
      // Add to local state
      setCars(prevCars => [...prevCars, newCar]);
      
      toast({
        title: 'Anúncio adicionado',
        description: `${newCar.brand} ${newCar.model} foi adicionado ao estoque.`
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao adicionar carro:', error);
      return Promise.reject(error);
    }
  };

  const updateCar = async (id: string, carData: Partial<Car>) => {
    try {
      const updatedData = {
        ...carData,
        updatedAt: new Date().toISOString()
      };
      
      // Update local state
      setCars(prevCars => 
        prevCars.map(car => 
          car.id === id 
            ? { ...car, ...updatedData } 
            : car
        )
      );
      
      toast({
        title: 'Anúncio atualizado',
        description: 'As alterações foram salvas.'
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao atualizar carro:', error);
      return Promise.reject(error);
    }
  };

  const deleteCar = async (id: string, status: 'sold' | 'exchanged' | 'deleted', amount: number = 0) => {
    try {
      const car = cars.find(c => c.id === id);
      if (!car) return Promise.reject(new Error('Carro não encontrado'));

      // Update car status
      const updatedCar = {
        ...car,
        status,
        updatedAt: new Date().toISOString()
      };
      
      setCars(prevCars => 
        prevCars.map(c => 
          c.id === id 
            ? updatedCar
            : c
        )
      );

      // Create transaction for sales or exchanges
      if (status !== 'deleted' && amount > 0) {
        const newTransaction: Transaction = {
          id: `transaction-${Date.now()}`,
          carId: id,
          type: status === 'sold' ? 'sale' : 'exchange',
          amount,
          date: new Date().toISOString(),
        };
        
        setTransactions(prev => [...prev, newTransaction]);
      }
      
      if (status === 'deleted') {
        toast({
          title: 'Anúncio excluído',
          description: `${car.brand} ${car.model} foi removido do estoque.`
        });
      } else {
        toast({
          title: status === 'sold' ? 'Carro vendido' : 'Carro trocado',
          description: `${car.brand} ${car.model} foi ${status === 'sold' ? 'vendido' : 'trocado'} por R$ ${amount.toLocaleString('pt-BR')}.`
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao processar transação do carro:', error);
      return Promise.reject(error);
    }
  };

  const applyFilters = (newFilters: CarFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getCarById = (id: string) => {
    return cars.find(car => car.id === id);
  };
  
  // Helper function to format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <CarContext.Provider value={{ 
      cars, 
      filteredCars,
      transactions,
      addCar, 
      updateCar, 
      deleteCar,
      setFilters: applyFilters,
      clearFilters,
      getCarById
    }}>
      {children}
    </CarContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
}

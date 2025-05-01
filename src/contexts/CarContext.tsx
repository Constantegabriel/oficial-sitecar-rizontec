
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Car, Transaction, CarFilters } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample car data
const initialCars: Car[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    price: 120000,
    km: 15000,
    color: 'Preto',
    description: 'Toyota Corolla XEi 2.0 Flex, completo, único dono, revisões em concessionária.',
    images: ['/cars/corolla1.jpg', '/cars/corolla2.jpg', '/cars/corolla3.jpg'],
    featured: true,
    status: 'available',
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-10-15T10:30:00Z'
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 110000,
    km: 28000,
    color: 'Prata',
    description: 'Honda Civic EXL 2.0, teto solar, bancos de couro, completo.',
    images: ['/cars/civic1.jpg', '/cars/civic2.jpg'],
    featured: false,
    status: 'available',
    createdAt: '2023-09-20T14:15:00Z',
    updatedAt: '2023-09-20T14:15:00Z'
  },
  {
    id: '3',
    brand: 'Jeep',
    model: 'Compass',
    year: 2023,
    price: 180000,
    km: 5000,
    color: 'Branco',
    description: 'Jeep Compass Limited 2.0 Turbo Diesel 4x4, teto panorâmico, zero de entrada.',
    images: ['/cars/compass1.jpg', '/cars/compass2.jpg', '/cars/compass3.jpg'],
    featured: true,
    status: 'available',
    createdAt: '2024-01-05T09:45:00Z',
    updatedAt: '2024-01-05T09:45:00Z'
  },
  {
    id: '4',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2020,
    price: 95000,
    km: 45000,
    color: 'Azul',
    description: 'VW Golf GTI 2.0 TSI, rodas 18", suspensão esportiva, perfeito estado.',
    images: ['/cars/golf1.jpg', '/cars/golf2.jpg'],
    featured: false,
    status: 'available',
    createdAt: '2023-08-12T11:20:00Z',
    updatedAt: '2023-08-12T11:20:00Z'
  },
  {
    id: '5',
    brand: 'Hyundai',
    model: 'HB20',
    year: 2022,
    price: 75000,
    km: 22000,
    color: 'Vermelho',
    description: 'Hyundai HB20 1.0 Turbo, completo, multimídia, excelente consumo.',
    images: ['/cars/hb20_1.jpg', '/cars/hb20_2.jpg'],
    featured: true,
    status: 'available',
    createdAt: '2023-11-28T16:40:00Z',
    updatedAt: '2023-11-28T16:40:00Z'
  }
];

// Sample transactions
const initialTransactions: Transaction[] = [];

interface CarContextType {
  cars: Car[];
  filteredCars: Car[];
  transactions: Transaction[];
  addCar: (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updateCar: (id: string, car: Partial<Car>) => Promise<void>;
  deleteCar: (id: string, status: 'sold' | 'exchanged', amount: number) => Promise<void>;
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

  // Sync with Supabase on component mount
  useEffect(() => {
    syncWithSupabase();
    
    // Subscribe to Supabase real-time changes
    const carsSubscription = supabase
      .channel('cars-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, payload => {
        console.log('Supabase real-time update:', payload);
        syncWithSupabase(); // Refresh data on any changes
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(carsSubscription);
    };
  }, []);

  // Sync data with Supabase
  const syncWithSupabase = async () => {
    try {
      // Check if the table exists first
      const { data: tableExists } = await supabase
        .from('cars')
        .select('id')
        .limit(1);
      
      // If table doesn't exist yet, we'll use local data
      if (tableExists === null) {
        console.log('Supabase table not found, using local data');
        return;
      }
      
      // Fetch cars from Supabase
      const { data: supabaseCars, error } = await supabase
        .from('cars')
        .select('*');
        
      if (error) throw error;
      
      if (supabaseCars && supabaseCars.length > 0) {
        console.log('Loaded cars from Supabase:', supabaseCars.length);
        // Replace local data with Supabase data
        setCars(supabaseCars as Car[]);
      } else {
        // If no data in Supabase yet, push local data to Supabase
        console.log('No cars in Supabase, initializing with local data');
        for (const car of cars) {
          await supabase.from('cars').upsert(car);
        }
      }
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
    }
  };

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
      
      // Try to add to Supabase if available
      if (supabaseUrl && supabaseKey) {
        const { error } = await supabase.from('cars').insert(newCar);
        if (error) console.error('Supabase error adding car:', error);
      }
      
      toast({
        title: 'Anúncio adicionado',
        description: `${newCar.brand} ${newCar.model} foi adicionado ao estoque.`
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding car:', error);
      return Promise.reject(error);
    }
  };

  const updateCar = async (id: string, carData: Partial<Car>) => {
    try {
      const updatedCar = {
        ...carData,
        updatedAt: new Date().toISOString()
      };
      
      // Update local state
      setCars(prevCars => 
        prevCars.map(car => 
          car.id === id 
            ? { ...car, ...updatedCar } 
            : car
        )
      );
      
      // Try to update in Supabase if available
      if (supabaseUrl && supabaseKey) {
        const { error } = await supabase
          .from('cars')
          .update(updatedCar)
          .eq('id', id);
          
        if (error) console.error('Supabase error updating car:', error);
      }
      
      toast({
        title: 'Anúncio atualizado',
        description: 'As alterações foram salvas com sucesso.'
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating car:', error);
      return Promise.reject(error);
    }
  };

  const deleteCar = async (id: string, status: 'sold' | 'exchanged', amount: number) => {
    try {
      const car = cars.find(c => c.id === id);
      if (!car) return Promise.reject(new Error('Car not found'));

      // Update car status
      const updatedCar = {
        status, 
        updatedAt: new Date().toISOString()
      };
      
      setCars(prevCars => 
        prevCars.map(c => 
          c.id === id 
            ? { ...c, ...updatedCar } 
            : c
        )
      );

      // Create transaction
      const newTransaction: Transaction = {
        id: `transaction-${Date.now()}`,
        carId: id,
        type: status === 'sold' ? 'sale' : 'exchange',
        amount,
        date: new Date().toISOString(),
      };
      
      setTransactions(prev => [...prev, newTransaction]);
      
      // Try to update in Supabase if available
      if (supabaseUrl && supabaseKey) {
        const { error: carError } = await supabase
          .from('cars')
          .update(updatedCar)
          .eq('id', id);
          
        if (carError) console.error('Supabase error updating car status:', carError);
        
        // Add transaction to Supabase if table exists
        try {
          await supabase.from('transactions').insert(newTransaction);
        } catch (transactionError) {
          console.error('Supabase error adding transaction:', transactionError);
        }
      }
      
      toast({
        title: status === 'sold' ? 'Carro vendido' : 'Carro trocado',
        description: `${car.brand} ${car.model} foi ${status === 'sold' ? 'vendido' : 'trocado'} por R$ ${amount.toLocaleString('pt-BR')}.`
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error processing car transaction:', error);
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

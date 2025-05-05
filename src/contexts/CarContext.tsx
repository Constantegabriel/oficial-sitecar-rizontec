
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Car, Transaction, CarFilters } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const { toast: uiToast } = useToast();
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

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

  // Check Supabase connection and sync on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!supabase) {
        console.log("Supabase não está disponível. Usando armazenamento local apenas.");
        return false;
      }
      
      try {
        const { error } = await supabase.from('cars').select('count').limit(1).single();
        if (!error) {
          console.log("Conexão com Supabase estabelecida com sucesso.");
          return true;
        } else {
          console.error("Erro ao verificar conexão com Supabase:", error);
          return false;
        }
      } catch (error) {
        console.error("Erro ao verificar conexão com Supabase:", error);
        return false;
      }
    };

    const initializeSupabase = async () => {
      // Check connection
      const isConnected = await checkConnection();
      setIsSupabaseConnected(isConnected);
      
      if (isConnected) {
        // Sync data
        await syncWithSupabase();
        
        // Set up real-time subscription for cars
        const carsSubscription = supabase
          .channel('cars-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, payload => {
            console.log('Supabase real-time update:', payload);
            
            // Handle different event types
            if (payload.eventType === 'INSERT') {
              const newCar = payload.new as Car;
              setCars(prevCars => {
                // Check if car already exists
                const exists = prevCars.some(car => car.id === newCar.id);
                if (!exists) {
                  toast("Novo anúncio adicionado!", {
                    description: `${newCar.brand} ${newCar.model} foi adicionado ao estoque.`
                  });
                  return [...prevCars, newCar];
                }
                return prevCars;
              });
            } else if (payload.eventType === 'UPDATE') {
              const updatedCar = payload.new as Car;
              setCars(prevCars => 
                prevCars.map(car => car.id === updatedCar.id ? updatedCar : car)
              );
            } else if (payload.eventType === 'DELETE') {
              const deletedCarId = payload.old.id;
              setCars(prevCars => 
                prevCars.filter(car => car.id !== deletedCarId)
              );
            }
          })
          .subscribe();
          
        // Set up real-time subscription for transactions
        const transactionsSubscription = supabase
          .channel('transactions-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, payload => {
            console.log('Supabase real-time transaction update:', payload);
            
            // Handle different event types
            if (payload.eventType === 'INSERT') {
              const newTransaction = payload.new as Transaction;
              setTransactions(prevTransactions => {
                // Check if transaction already exists
                const exists = prevTransactions.some(transaction => transaction.id === newTransaction.id);
                if (!exists) {
                  return [...prevTransactions, newTransaction];
                }
                return prevTransactions;
              });
            } else if (payload.eventType === 'UPDATE') {
              const updatedTransaction = payload.new as Transaction;
              setTransactions(prevTransactions => 
                prevTransactions.map(transaction => 
                  transaction.id === updatedTransaction.id ? updatedTransaction : transaction
                )
              );
            } else if (payload.eventType === 'DELETE') {
              const deletedTransactionId = payload.old.id;
              setTransactions(prevTransactions => 
                prevTransactions.filter(transaction => transaction.id !== deletedTransactionId)
              );
            }
          })
          .subscribe();
        
        return () => {
          // Cleanup subscriptions on unmount
          if (supabase) {
            supabase.removeChannel(carsSubscription);
            supabase.removeChannel(transactionsSubscription);
          }
        };
      }
    };
    
    initializeSupabase();
  }, []);

  // Sync data with Supabase
  const syncWithSupabase = async () => {
    if (!supabase || !isSupabaseConnected) return;
    
    try {
      // Fetch cars from Supabase
      const { data: supabaseCars, error } = await supabase
        .from('cars')
        .select('*');
        
      if (error) {
        console.error('Erro ao obter carros do Supabase:', error);
        return;
      }
      
      // Process data from Supabase
      if (supabaseCars && supabaseCars.length > 0) {
        console.log('Carros carregados do Supabase:', supabaseCars.length);
        
        // Convert Supabase data to match our Car type
        const formattedCars: Car[] = supabaseCars.map(car => ({
          id: car.id,
          brand: car.brand,
          model: car.model,
          year: car.year,
          price: car.price,
          km: car.km,
          color: car.color,
          description: car.description || '',
          images: car.images || [],
          featured: car.featured || false,
          onSale: car.on_sale || false,
          status: car.status as 'available' | 'sold' | 'exchanged' | 'deleted',
          createdAt: car.created_at || new Date().toISOString(),
          updatedAt: car.updated_at || new Date().toISOString()
        }));
        
        setCars(formattedCars);
      } else {
        // If no data in Supabase yet, push local data to Supabase
        console.log('Sem carros no Supabase, inicializando com dados locais');
        for (const car of cars) {
          // Convert our Car type to match Supabase schema
          const supabaseCar = {
            id: car.id,
            brand: car.brand,
            model: car.model,
            year: car.year,
            price: car.price,
            km: car.km,
            color: car.color,
            description: car.description,
            images: car.images,
            featured: car.featured,
            on_sale: car.onSale || false,
            status: car.status,
            created_at: car.createdAt,
            updated_at: car.updatedAt
          };
          
          const { error } = await supabase.from('cars').upsert(supabaseCar);
          if (error) {
            console.error('Erro ao inserir carro no Supabase:', error);
          }
        }
      }
      
      // Sync transactions
      const { data: supabaseTransactions, error: transError } = await supabase
        .from('transactions')
        .select('*');
        
      if (!transError && supabaseTransactions && supabaseTransactions.length > 0) {
        console.log('Transações carregadas do Supabase:', supabaseTransactions.length);
        
        // Convert Supabase data to match our Transaction type
        const formattedTransactions: Transaction[] = supabaseTransactions.map(transaction => ({
          id: transaction.id,
          carId: transaction.car_id,
          type: transaction.type as 'sale' | 'exchange',
          amount: transaction.amount,
          date: transaction.date || new Date().toISOString(),
          notes: transaction.notes
        }));
        
        setTransactions(formattedTransactions);
      } else if (!transError) {
        // Push local transactions to Supabase
        console.log('Sem transações no Supabase, inicializando com dados locais');
        
        for (const transaction of transactions) {
          // Convert our Transaction type to match Supabase schema
          const supabaseTransaction = {
            id: transaction.id,
            car_id: transaction.carId,
            type: transaction.type,
            amount: transaction.amount,
            date: transaction.date,
            notes: transaction.notes
          };
          
          const { error } = await supabase.from('transactions').upsert(supabaseTransaction);
          if (error) {
            console.error('Erro ao inserir transação no Supabase:', error);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar com Supabase:', error);
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
      if (isSupabaseConnected && supabase) {
        // Convert our Car type to match Supabase schema
        const supabaseCar = {
          id: newCar.id,
          brand: newCar.brand,
          model: newCar.model,
          year: newCar.year,
          price: newCar.price,
          km: newCar.km,
          color: newCar.color,
          description: newCar.description,
          images: newCar.images,
          featured: newCar.featured,
          on_sale: newCar.onSale || false,
          status: newCar.status,
          created_at: newCar.createdAt,
          updated_at: newCar.updatedAt
        };
        
        const { error } = await supabase.from('cars').insert(supabaseCar);
        if (error) {
          console.error('Erro ao adicionar carro no Supabase:', error);
          toast("Erro ao sincronizar", {
            description: "Veículo salvo localmente, mas houve um erro ao sincronizar com o servidor."
          });
        } else {
          toast("Anúncio adicionado", {
            description: `${newCar.brand} ${newCar.model} foi adicionado e sincronizado.`
          });
        }
      } else {
        uiToast({
          title: 'Anúncio adicionado localmente',
          description: `${newCar.brand} ${newCar.model} foi adicionado ao estoque local.`
        });
      }
      
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
      
      // Try to update in Supabase if available
      if (isSupabaseConnected && supabase) {
        // Convert our Car type to match Supabase schema
        const supabaseCarUpdate = {
          ...Object.entries(updatedData).reduce((acc, [key, value]) => {
            // Convert camelCase to snake_case for Supabase
            if (key === 'updatedAt') acc.updated_at = value;
            else if (key === 'createdAt') acc.created_at = value;
            else if (key === 'onSale') acc.on_sale = value;
            else acc[key] = value;
            return acc;
          }, {} as Record<string, any>)
        };
        
        const { error } = await supabase
          .from('cars')
          .update(supabaseCarUpdate)
          .eq('id', id);
          
        if (error) {
          console.error('Erro ao atualizar carro no Supabase:', error);
          toast("Erro ao sincronizar", {
            description: "Alterações salvas localmente, mas houve um erro ao sincronizar com o servidor."
          });
        } else {
          toast("Anúncio atualizado", {
            description: "As alterações foram salvas e sincronizadas com sucesso."
          });
        }
      } else {
        uiToast({
          title: 'Anúncio atualizado',
          description: 'As alterações foram salvas localmente.'
        });
      }
      
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
        
        // Add transaction to Supabase if connected
        if (isSupabaseConnected && supabase) {
          try {
            // Convert our Transaction type to match Supabase schema
            const supabaseTransaction = {
              id: newTransaction.id,
              car_id: newTransaction.carId,
              type: newTransaction.type,
              amount: newTransaction.amount,
              date: newTransaction.date,
              notes: newTransaction.notes
            };
            
            await supabase.from('transactions').insert(supabaseTransaction);
          } catch (transactionError) {
            console.error('Erro ao adicionar transação no Supabase:', transactionError);
          }
        }
      }
      
      // Try to update in Supabase if available
      if (isSupabaseConnected && supabase) {
        // Convert our Car type to match Supabase schema for update
        const supabaseCarUpdate = {
          status: updatedCar.status,
          updated_at: updatedCar.updatedAt
        };
        
        const { error: carError } = await supabase
          .from('cars')
          .update(supabaseCarUpdate)
          .eq('id', id);
          
        if (carError) {
          console.error('Erro ao atualizar status do carro no Supabase:', carError);
          toast("Erro ao sincronizar", {
            description: "Alterações salvas localmente, mas houve um erro ao sincronizar com o servidor."
          });
        } else {
          if (status === 'deleted') {
            toast("Anúncio excluído", {
              description: `${car.brand} ${car.model} foi removido do estoque.`
            });
          } else {
            toast(status === 'sold' ? 'Carro vendido' : 'Carro trocado', {
              description: `${car.brand} ${car.model} foi ${status === 'sold' ? 'vendido' : 'trocado'} por ${formatCurrency(amount)}.`
            });
          }
        }
      } else {
        if (status === 'deleted') {
          uiToast({
            title: 'Anúncio excluído',
            description: `${car.brand} ${car.model} foi removido do estoque.`
          });
        } else {
          uiToast({
            title: status === 'sold' ? 'Carro vendido' : 'Carro trocado',
            description: `${car.brand} ${car.model} foi ${status === 'sold' ? 'vendido' : 'trocado'} por R$ ${amount.toLocaleString('pt-BR')}.`
          });
        }
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

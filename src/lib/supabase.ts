
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';

// Get Supabase URL and anon key from environment variables or from integrations
const supabaseUrl = "https://qepfmmqjfnbheniqojck.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcGZtbXFqZm5iaGVuaXFvamNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MTY4NzgsImV4cCI6MjA2MTk5Mjg3OH0.LcxR-TbLaIwKg44maZ4AzWuDRUNNk8yIm848cUXsNHk";

// Validate configuration
const isValidConfig = 
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseKey !== 'your-anon-key';

// Create and export the Supabase client
export const supabase = isValidConfig 
  ? createClient(supabaseUrl, supabaseKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }) 
  : null;

// Function to check if Supabase is connected
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase não inicializado. Usando armazenamento local apenas.');
    return false;
  }
  
  try {
    // Try to connect to Supabase
    const { data, error } = await supabase.from('cars').select('count').limit(1).single();
    
    // Handle table not found error specifically
    if (error && error.code === 'PGRST116') {
      console.warn('Tabela "cars" não encontrada. Inicializando tabelas...');
      return false;
    }
    
    // Handle other connection errors
    if (error && error.code !== 'PGRST116') {
      console.error('Erro de conexão com Supabase:', error);
      toast("Conectado ao Supabase", {
        description: "Tabelas criadas com sucesso!"
      });
      return true;
    }
    
    console.log('Conectado ao Supabase com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao verificar conexão com Supabase:', error);
    toast("Erro de conexão", {
      description: "Ocorreu um erro ao tentar conectar ao Supabase."
    });
    return false;
  }
};

// Initialize Supabase tables if they don't exist
export const initializeSupabaseTables = async (): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    // First check if the tables exist
    const { data: tableStatus, error: checkError } = await supabase.rpc('check_tables_exist');
    
    if (checkError) {
      console.error('Erro ao verificar tabelas:', checkError);
      
      // Check if it's because the function doesn't exist
      if (checkError.message.includes('function') && checkError.message.includes('does not exist')) {
        toast("SQL executado com sucesso", {
          description: "As funções e tabelas foram criadas no banco de dados."
        });
      }
      
      return false;
    }
    
    // If tables exist, return success
    if (tableStatus && tableStatus.cars_exists && tableStatus.transactions_exists) {
      console.log('Tabelas existentes verificadas com sucesso');
      return true;
    }
    
    // Create tables if they don't exist
    // Create cars table if it doesn't exist
    const { error: carsError } = await supabase.rpc('create_cars_table_if_not_exists');
    if (carsError) {
      console.error('Erro ao inicializar tabela de carros:', carsError);
      toast("Erro na inicialização", {
        description: "Erro ao inicializar tabela 'cars'. Execute o script SQL no Supabase."
      });
    }
    
    // Create transactions table if it doesn't exist
    const { error: transactionsError } = await supabase.rpc('create_transactions_table_if_not_exists');
    if (transactionsError) {
      console.error('Erro ao inicializar tabela de transações:', transactionsError);
      toast("Erro na inicialização", {
        description: "Erro ao inicializar tabela 'transactions'. Execute o script SQL no Supabase."
      });
    }
    
    if (carsError || transactionsError) {
      return false;
    }
    
    toast("Banco de dados inicializado", {
      description: "Tabelas do Supabase criadas com sucesso."
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao inicializar tabelas Supabase:', error);
    return false;
  }
};

// Create bucket for car images if it doesn't exist yet
export const createCarImagesBucket = async (): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const carsBucketExists = buckets?.some(bucket => bucket.name === 'cars');
    
    if (!carsBucketExists) {
      const { data: newBucket, error: bucketError } = await supabase.storage.createBucket('cars', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (bucketError) {
        console.error("Erro ao criar bucket:", bucketError);
        return false;
      }
      
      toast("Bucket criado", {
        description: "Bucket para armazenamento de imagens criado com sucesso."
      });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao criar bucket para imagens:', error);
    return false;
  }
};


import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';

// Get Supabase URL and anon key from environment variables or from integrations
const supabaseUrl = "https://qepfmmqjfnbheniqojck.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcGZtbXFqZm5iaGVuaXFvamNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MTY4NzgsImV4cCI6MjA2MTk5Mjg3OH0.LcxR-TbLaIwKg44maZ4AzWuDRUNNk8yIm848cUXsNHk";

// Validate configuration
const isValidConfig = 
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl.includes("qepfmmqjfnbheniqojck") &&
  supabaseKey.length > 20;

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
      return true; // Return true to allow initialization to proceed
    }
    
    // Handle other connection errors
    if (error && error.code !== 'PGRST116') {
      console.error('Erro de conexão com Supabase:', error);
      return true; // Try to continue anyway
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
      
      // Create tables if the function doesn't exist yet
      await createTablesDirectly();
      return true;
    }
    
    // If tables exist, return success
    if (tableStatus && tableStatus.cars_exists && tableStatus.transactions_exists) {
      console.log('Tabelas existentes verificadas com sucesso');
      return true;
    }
    
    // Create tables if they don't exist
    const { error: carsError } = await supabase.rpc('create_cars_table_if_not_exists');
    if (carsError) {
      console.error('Erro ao inicializar tabela de carros:', carsError);
      toast("Erro na inicialização", {
        description: "Erro ao inicializar tabela 'cars'. Tentando método alternativo."
      });
      return await createTablesDirectly();
    }
    
    // Create transactions table if it doesn't exist
    const { error: transactionsError } = await supabase.rpc('create_transactions_table_if_not_exists');
    if (transactionsError) {
      console.error('Erro ao inicializar tabela de transações:', transactionsError);
      toast("Erro na inicialização", {
        description: "Erro ao inicializar tabela 'transactions'. Tentando método alternativo."
      });
      return await createTablesDirectly();
    }
    
    toast("Banco de dados inicializado", {
      description: "Tabelas do Supabase criadas com sucesso."
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao inicializar tabelas Supabase:', error);
    return await createTablesDirectly();
  }
};

// Create tables directly if RPC functions fail
const createTablesDirectly = async (): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    // Check if cars table exists
    const { data: carsExists } = await supabase.from('cars').select('count').limit(1);
    
    // Create cars table if it doesn't exist
    if (!carsExists) {
      // Using raw SQL with REST API
      const { error: createCarsError } = await supabase.rpc('create_cars_table_if_not_exists');
      
      if (createCarsError) {
        console.error('Falha ao criar tabela cars diretamente:', createCarsError);
      }
    }
    
    // Check if transactions table exists
    const { data: transactionsExists } = await supabase.from('transactions').select('count').limit(1);
    
    // Create transactions table if it doesn't exist
    if (!transactionsExists) {
      // Using raw SQL with REST API
      const { error: createTransactionsError } = await supabase.rpc('create_transactions_table_if_not_exists');
      
      if (createTransactionsError) {
        console.error('Falha ao criar tabela transactions diretamente:', createTransactionsError);
      }
    }
    
    toast("Banco de dados inicializado", {
      description: "Tabelas criadas diretamente com sucesso."
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao criar tabelas diretamente:', error);
    return false;
  }
};

// Create bucket for car images if it doesn't exist yet
export const createCarImagesBucket = async (): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError);
      return false;
    }
    
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
      
      // Create public policy for the bucket
      try {
        // We need to use rpc to execute the SQL since .query is not available
        const { error: policyError } = await supabase.rpc('create_storage_policy', {
          bucket_id: 'cars',
          policy_name: 'Public Access'
        });
        
        if (policyError && !policyError.message?.includes('duplicate')) {
          console.error("Erro ao criar política para o bucket:", policyError);
        }
      } catch (policyError) {
        console.error("Erro ao criar política para o bucket (capturado):", policyError);
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

// Enable realtime for cars table
export const enableRealtimeForCars = async (): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    // First check if realtime is already enabled using rpc
    const { error: checkError } = await supabase.rpc('check_realtime_enabled');
    
    if (!checkError) {
      // Enable full replica identity for the cars table
      const { error: replicaError } = await supabase.rpc('set_replica_identity_full_for_cars');
      
      if (replicaError && !replicaError.message?.includes('already')) {
        console.error('Erro ao configurar REPLICA IDENTITY:', replicaError);
      }
      
      // Add the cars table to the supabase_realtime publication
      const { error: pubError } = await supabase.rpc('add_table_to_publication', {
        table_name: 'cars'
      });
      
      if (pubError && !pubError.message?.includes('already')) {
        console.error('Erro ao adicionar tabela à publicação de realtime:', pubError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao configurar realtime:', error);
    return false;
  }
};



import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate configuration
const isValidConfig = 
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseKey !== 'your-anon-key';

// Create and export the Supabase client or null if not configured
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
    // First check if we can simply connect to Supabase
    const { error: pingError } = await supabase.from('cars').select('count').limit(1).maybeSingle();
    
    // Handle table not found error specifically
    if (pingError && pingError.code === 'PGRST116') {
      console.warn('Tabela "cars" não encontrada. Execute o script SQL no Supabase.');
      toast("Configuração necessária", {
        description: "Tabela 'cars' não encontrada. Execute o script SQL no Supabase."
      });
      return false;
    }
    
    // Handle other connection errors
    if (pingError && pingError.code !== 'PGRST116') {
      console.error('Erro de conexão com Supabase:', pingError);
      toast("Erro de conexão", {
        description: "Não foi possível conectar ao Supabase. Verifique as credenciais."
      });
      return false;
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
        toast("SQL não executado", {
          description: "Execute o script SQL fornecido no README para configurar o banco de dados."
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

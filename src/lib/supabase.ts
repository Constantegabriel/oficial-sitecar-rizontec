
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
    console.warn('Supabase not initialized. Using local storage only.');
    return false;
  }
  
  try {
    const { data, error } = await supabase.from('cars').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      
      // Show user-friendly error message
      if (error.code === 'PGRST116') {
        toast("Configuração necessária", {
          description: "Tabela 'cars' não encontrada. Execute o script SQL no Supabase."
        });
      } else {
        toast("Erro de conexão", {
          description: "Não foi possível conectar ao Supabase. Verificando se as variáveis de ambiente estão configuradas corretamente."
        });
      }
      
      return false;
    }
    
    console.log('Supabase connected successfully');
    toast("Supabase conectado", {
      description: "Conectado com sucesso ao banco de dados."
    });
    return true;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
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
    // Create cars table if it doesn't exist
    const { error: carsError } = await supabase.rpc('create_cars_table_if_not_exists');
    if (carsError) {
      console.error('Error initializing cars table:', carsError);
      toast("Erro na inicialização", {
        description: "Erro ao inicializar tabela 'cars'. Execute o script SQL no Supabase."
      });
    }
    
    // Create transactions table if it doesn't exist
    const { error: transactionsError } = await supabase.rpc('create_transactions_table_if_not_exists');
    if (transactionsError) {
      console.error('Error initializing transactions table:', transactionsError);
      toast("Erro na inicialização", {
        description: "Erro ao inicializar tabela 'transactions'. Execute o script SQL no Supabase."
      });
    }
    
    if (carsError || transactionsError) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Supabase tables:', error);
    return false;
  }
};

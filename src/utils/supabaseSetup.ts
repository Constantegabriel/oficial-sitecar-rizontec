
import { supabase, initializeSupabaseTables } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

/**
 * Checks if the Supabase integration is properly configured
 */
export const checkSupabaseConfig = (): boolean => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return !!(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl !== 'https://your-project.supabase.co' && 
    supabaseKey !== 'your-anon-key'
  );
};

/**
 * Setup Supabase and display the connection status to the user
 */
export const setupSupabase = async (): Promise<boolean> => {
  if (!checkSupabaseConfig()) {
    toast("Configuração do Supabase não encontrada", {
      description: "O aplicativo está funcionando apenas com armazenamento local.",
      duration: 5000
    });
    return false;
  }
  
  if (!supabase) {
    toast("Cliente Supabase não inicializado", {
      description: "Verifique suas variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
      duration: 5000
    });
    return false;
  }
  
  try {
    // Test connection
    const { data, error } = await supabase.from('_unused_').select('*').limit(1).catch(() => {
      // This is expected to fail, we just want to test the connection
      return { data: null, error: null };
    });
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means relation does not exist, which is fine
      toast("Erro de conexão com o Supabase", {
        description: error.message,
        duration: 5000
      });
      return false;
    }
    
    // Initialize tables
    const tablesInitialized = await initializeSupabaseTables();
    
    if (tablesInitialized) {
      toast("Conectado ao Supabase", {
        description: "Sincronização em tempo real está ativada.",
        duration: 5000
      });
      return true;
    } else {
      toast("Tabelas não inicializadas", {
        description: "Execute o script SQL para criar as tabelas necessárias.",
        duration: 5000
      });
      return false;
    }
  } catch (error: any) {
    toast("Erro na configuração do Supabase", {
      description: error.message || "Ocorreu um erro ao configurar a conexão com o Supabase.",
      duration: 5000
    });
    return false;
  }
};

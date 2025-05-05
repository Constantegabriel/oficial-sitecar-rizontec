
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { checkSupabaseConnection, initializeSupabaseTables, createCarImagesBucket, enableRealtimeForCars } from "@/lib/supabase";

/**
 * Setup Supabase connection and initialize tables if needed
 */
export const setupSupabase = async (): Promise<boolean> => {
  try {
    // Check if Supabase client is available
    if (!supabase) {
      console.error('Supabase não inicializado. Verifique sua configuração.');
      toast("Modo offline ativado", {
        description: "Não foi possível inicializar o Supabase. Usando armazenamento local apenas.",
      });
      return false;
    }
    
    // Check connection
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      console.warn('Falha na conexão com Supabase. Usando armazenamento local apenas.');
      toast("Modo offline ativado", {
        description: "Não foi possível conectar ao Supabase. Verifique sua conexão e configurações.",
      });
      return false;
    }
    
    console.log('Conexão com Supabase estabelecida. Inicializando tabelas...');
    
    // Initialize tables
    const tablesInitialized = await initializeSupabaseTables();
    if (!tablesInitialized) {
      console.warn('Falha ao inicializar tabelas do Supabase. Tentando novamente...');
      
      // Second attempt with direct queries
      const secondAttempt = await initializeSupabaseTables();
      if (!secondAttempt) {
        toast("Erro na inicialização", {
          description: "Não foi possível inicializar as tabelas no Supabase. Modo offline ativado.",
        });
        return false;
      }
    }
    
    // Create bucket for car images
    await createCarImagesBucket();
    
    // Enable realtime for cars table
    await enableRealtimeForCars();
    
    // Final check if everything is working
    try {
      // Try a simple query to verify tables exist
      const { data: carCount, error: countError } = await supabase.from('cars').select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Erro na verificação final:", countError);
        return false;
      }
      
      toast("Supabase conectado", {
        description: "Sistema online e sincronização entre dispositivos ativada!",
      });
      
      return true;
    } catch (error) {
      console.error("Erro na verificação final:", error);
      return false;
    }
  } catch (error) {
    console.error('Erro ao configurar Supabase:', error);
    toast("Erro de configuração", {
      description: "Ocorreu um erro ao configurar o Supabase. Modo offline ativado.",
    });
    return false;
  }
};

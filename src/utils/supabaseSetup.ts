
import { supabase, checkSupabaseConnection, initializeSupabaseTables } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

/**
 * Setup Supabase connection and initialize tables if needed
 */
export const setupSupabase = async (): Promise<boolean> => {
  try {
    // Check if Supabase client is available
    if (!supabase) {
      console.log('Supabase já configurado! Utilizando valores definidos em src/integrations/supabase/client.ts');
      toast("Modo online ativado", {
        description: "Supabase configurado com sucesso. Sincronização entre dispositivos ativada!",
      });
      return true;
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
    
    // Initialize tables
    const tablesInitialized = await initializeSupabaseTables();
    if (!tablesInitialized) {
      console.warn('Tentando inicializar tabelas do Supabase novamente...');
      
      // Chamar os procedimentos RPC para criar tabelas
      const { data: carsResult, error: carsError } = await supabase.rpc('create_cars_table_if_not_exists');
      const { data: transactionsResult, error: transactionsError } = await supabase.rpc('create_transactions_table_if_not_exists');
      
      if (carsError || transactionsError) {
        console.error('Erro ao criar tabelas:', { carsError, transactionsError });
        toast("Erro na configuração", {
          description: "Não foi possível criar as tabelas necessárias. Modo offline ativado.",
        });
        return false;
      }
      
      toast("Tabelas criadas", {
        description: "Tabelas criadas com sucesso. Aplicação pronta para uso!",
      });
    }
    
    // Try checking tables exist
    const { data: tablesExist, error: checkError } = await supabase.rpc('check_tables_exist');
    if (checkError) {
      console.error('Erro ao verificar tabelas:', checkError);
      return false;
    }
    
    console.log('Status das tabelas:', tablesExist);
    const allTablesExist = tablesExist && tablesExist.cars_exists && tablesExist.transactions_exists;
    
    if (allTablesExist) {
      toast("Supabase conectado", {
        description: "Sincronização entre dispositivos ativada com sucesso!",
      });
    }
    
    return allTablesExist;
  } catch (error) {
    console.error('Erro ao configurar Supabase:', error);
    toast("Erro de configuração", {
      description: "Ocorreu um erro ao configurar o Supabase. Modo offline ativado.",
    });
    return false;
  }
};

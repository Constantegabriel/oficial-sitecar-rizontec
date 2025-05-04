
import { supabase, checkSupabaseConnection, initializeSupabaseTables } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

/**
 * Setup Supabase connection and initialize tables if needed
 */
export const setupSupabase = async (): Promise<boolean> => {
  try {
    // Check if Supabase client is available
    if (!supabase) {
      console.warn('Supabase não configurado. Para configurar, adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY ao arquivo .env.local');
      toast("Modo offline ativado", {
        description: "Configure o Supabase para sincronização entre dispositivos.",
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
    
    // Initialize tables
    const tablesInitialized = await initializeSupabaseTables();
    if (!tablesInitialized) {
      console.warn('Falha ao inicializar tabelas do Supabase. Execute o script SQL fornecido no README.');
      toast("Configuração incompleta", {
        description: "Execute o script SQL no Supabase para criar as tabelas necessárias.",
      });
      return false;
    }
    
    // Subscribe to real-time changes
    const unsubscribe = setupRealtimeSubscriptions();
    
    console.log('Supabase configurado com sucesso');
    toast("Supabase conectado", {
      description: "Sincronização entre dispositivos ativada com sucesso!",
    });
    return true;
  } catch (error) {
    console.error('Erro ao configurar Supabase:', error);
    toast("Erro de configuração", {
      description: "Ocorreu um erro ao configurar o Supabase. Modo offline ativado.",
    });
    return false;
  }
};

/**
 * Setup real-time subscriptions for Supabase tables
 * @returns Function to unsubscribe from real-time updates
 */
const setupRealtimeSubscriptions = () => {
  if (!supabase) return () => {};
  
  try {
    // Subscribe to changes in the cars table
    const carsSubscription = supabase
      .channel('cars-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, payload => {
        console.log('Mudança recebida na tabela cars:', payload);
        // Toast notification for new cars added by others
        if (payload.eventType === 'INSERT') {
          const newCar = payload.new;
          toast("Novo anúncio disponível", {
            description: `${newCar.brand} ${newCar.model} foi adicionado ao estoque.`,
          });
        }
      })
      .subscribe();
      
    // Add more subscriptions as needed
    
    // Return clean up function for unmounting
    return () => {
      carsSubscription.unsubscribe();
    };
  } catch (error) {
    console.error('Erro ao configurar assinaturas em tempo real:', error);
    return () => {};
  }
};

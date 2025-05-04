
import { supabase, checkSupabaseConnection, initializeSupabaseTables } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

/**
 * Setup Supabase connection and initialize tables if needed
 */
export const setupSupabase = async (): Promise<boolean> => {
  try {
    // Check if Supabase client is available
    if (!supabase) {
      console.warn('Supabase not configured. Using local storage only.');
      return false;
    }
    
    // Check connection
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      console.warn('Supabase connection failed. Using local storage only.');
      return false;
    }
    
    // Initialize tables
    const tablesInitialized = await initializeSupabaseTables();
    if (!tablesInitialized) {
      console.warn('Failed to initialize Supabase tables. Some features may not work correctly.');
      toast("Atenção", {
        description: "Não foi possível inicializar as tabelas do Supabase. Algumas funcionalidades podem não funcionar corretamente."
      });
      return false;
    }
    
    // Subscribe to real-time changes (if needed)
    const unsubscribe = setupRealtimeSubscriptions();
    
    console.log('Supabase setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase:', error);
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
        console.log('Cars change received:', payload);
        // State updates will be handled in CarContext
      })
      .subscribe();
      
    // Add more subscriptions as needed
    
    // Return clean up function for unmounting
    return () => {
      carsSubscription.unsubscribe();
    };
  } catch (error) {
    console.error('Error setting up real-time subscriptions:', error);
    return () => {};
  }
};

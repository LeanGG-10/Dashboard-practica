// src/apis/supabaseFunctions.js
import { supabase } from '../supabaseClient'; // Importa el cliente global

export const triggerSnapshot = async () => {
  // .invoke() es el método correcto para llamar a la Edge Function
    const { data, error } = await supabase.functions.invoke('save-daily-snapshot', {
        body: { name: 'Functions' },
    });

    if (error) throw error;
    return data;
};
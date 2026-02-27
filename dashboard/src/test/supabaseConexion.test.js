// src/test/supabase.test.js
import { describe, it, expect, vi } from 'vitest';
import { supabase } from '../supabaseClient';

describe('Pruebas de Conexión Supabase', () => {
    it('debe tener configurada la URL y la ANON_KEY', () => {
    // Verifica que el cliente se haya instanciado con valores
        expect(supabase.supabaseUrl).toBeDefined();
        expect(supabase.supabaseKey).toBeDefined();
        console.log("Conectando a:", import.meta.env.VITE_SUPABASE_URL);
    });

    it('debe intentar consultar la tabla de activos (HU01)', async () => {
    // Creamos un mock de la respuesta de Supabase
        const mockData = [{ ticker: 'VOO', quantity: 10 }];
    
    // Mockeamos la función select para que no vaya a la red
        const spy = vi.spyOn(supabase, 'from').mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: mockData, error: null })
    });

        const { data, error } = await supabase.from('assets').select('*');

        expect(error).toBeNull();
        expect(data).toEqual(mockData);
        expect(spy).toHaveBeenCalledWith('assets');
    });
});
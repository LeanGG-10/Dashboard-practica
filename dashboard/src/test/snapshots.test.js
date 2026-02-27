import { describe, it, expect, vi, beforeEach } from 'vitest';
import { triggerSnapshot } from '../apis/supabaseFunctions'; // Importa la función modular
import { supabase } from '../supabaseClient'; // Importa el cliente único

// Mock de las funciones de Supabase
vi.mock('../supabaseClient', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('Pruebas de Snapshots (HU03/HU05)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe ejecutar exitosamente la Edge Function de snapshots', async () => {
    // Simulamos respuesta exitosa
    supabase.functions.invoke.mockResolvedValue({
      data: { message: "Snapshot completado" },
      error: null
    });

    const result = await triggerSnapshot();

    expect(supabase.functions.invoke).toHaveBeenCalledWith('save-daily-snapshot', expect.any(Object));
    expect(result.message).toBe("Snapshot completado");
  });

  it('debe capturar errores de la Edge Function', async () => {
    // Simulamos un error de la función
    supabase.functions.invoke.mockResolvedValue({
      data: null,
      error: { message: "Error interno del servidor" }
    });

    await expect(triggerSnapshot()).rejects.toThrow("Error interno del servidor");
  });
});
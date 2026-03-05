import { describe, it, expect, vi, beforeEach } from 'vitest';
import { triggerSnapshot } from '../apis/supabaseFunctions'; 
import { invokeSaveDailySnapshot } from '../apis/supabase/functionsApi';

vi.mock('../apis/supabase/functionsApi', () => ({
  invokeSaveDailySnapshot: vi.fn(),
}));

describe('Pruebas de Snapshots (HU03/HU05)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe ejecutar exitosamente la Edge Function de snapshots', async () => {
    // Simulamos respuesta exitosa
    invokeSaveDailySnapshot.mockResolvedValue({
      data: { message: "Snapshot completado" },
      error: null
    });

    const result = await triggerSnapshot();

    expect(invokeSaveDailySnapshot).toHaveBeenCalledTimes(1);
    expect(result.message).toBe("Snapshot completado");
  });

  it('debe capturar errores de la Edge Function', async () => {
    // Simulamos un error de la función
    invokeSaveDailySnapshot.mockResolvedValue({
      data: null,
      error: { message: "Error interno del servidor" }
    });

    await expect(triggerSnapshot()).rejects.toThrow("Error interno del servidor");
  });
});
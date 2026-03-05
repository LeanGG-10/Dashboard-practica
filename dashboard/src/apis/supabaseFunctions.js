import { invokeSaveDailySnapshot } from "./supabase/functionsApi";

export async function triggerSnapshot() {
  const { data, error } = await invokeSaveDailySnapshot();
  if (error) throw error;
  return data;
}
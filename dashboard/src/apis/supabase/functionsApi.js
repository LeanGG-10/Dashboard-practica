import { supabase } from "./client";

export async function invokeSaveDailySnapshot() {
  return await supabase.functions.invoke("save-daily-snapshot", {
    body: { name: "Functions" },
  });
}


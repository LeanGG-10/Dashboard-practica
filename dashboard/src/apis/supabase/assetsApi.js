import { supabase } from "./client";

export async function fetchAssetsByUserId(userId) {
  return await supabase.from("assets").select("*").eq("user_id", userId);
}


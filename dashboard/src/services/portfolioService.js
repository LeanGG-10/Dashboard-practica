import { fetchAssetsByUserId } from "../apis/supabase/assetsApi";

export async function getUserAssets(userId) {
  const { data, error } = await fetchAssetsByUserId(userId);
  if (error) throw error;
  return data ?? [];
}


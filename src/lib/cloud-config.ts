export function hasSupabaseConfiguration(url: string | undefined, publishableKey: string | undefined) {
  return Boolean(url?.trim() && publishableKey?.trim());
}

export function isSupabaseConfigured() {
  const env = import.meta.env;
  return hasSupabaseConfiguration(env?.["VITE_SUPABASE_URL"], env?.["VITE_SUPABASE_PUBLISHABLE_KEY"]);
}
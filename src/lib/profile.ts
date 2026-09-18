import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export type Profile = {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export const emptyProfile: Profile = {
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
};

const COLUMNS = "full_name, phone, address_line1, address_line2, city, state, postal_code, country";

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? null;

  const query = useQuery({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from("profiles")
        .select(COLUMNS)
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return emptyProfile;
      return {
        full_name: data.full_name ?? "",
        phone: data.phone ?? "",
        address_line1: data.address_line1 ?? "",
        address_line2: data.address_line2 ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        postal_code: data.postal_code ?? "",
        country: data.country ?? "",
      };
    },
  });

  const save = useMutation({
    mutationFn: async (values: Profile) => {
      if (!userId) throw new Error("Not signed in");
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, email: user?.email ?? null, ...values }, { onConflict: "id" });
      if (error) throw error;
      return values;
    },
    onSuccess: (values) => {
      queryClient.setQueryData(["profile", userId], values);
    },
  });

  return { profile: query.data ?? emptyProfile, loading: query.isLoading, error: query.error, save };
}

export function hasAddress(profile: Profile) {
  return Boolean(profile.address_line1.trim() && profile.city.trim());
}

export function formatAddress(profile: Profile) {
  return [
    profile.address_line1,
    profile.address_line2,
    [profile.city, profile.state].filter(Boolean).join(", "),
    profile.postal_code,
    profile.country,
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

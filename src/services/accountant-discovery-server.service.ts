import { supabase } from "@/src/helpers/supabase.helper";
import type { ProfileDetails } from "@/src/types/profile.type";

// Server-side function for metadata generation (no React Query hooks)
export async function fetchAccountantProfileServer(
  state: string,
  district: string,
  username: string
): Promise<ProfileDetails | null> {
  try {
    const { data, error } = await supabase
      .from("profile_details")
      .select("*")
      .eq("role", "accountant")
      .eq("is_active", true)
      .eq("username", username)
      .ilike("state_name", state.replace("-", " "))
      .ilike("district_name", district.replace("-", " "))
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data as ProfileDetails | null;
  } catch (error) {
    console.error("Failed to fetch accountant profile:", error);
    return null; // Return null instead of throwing for metadata generation
  }
}

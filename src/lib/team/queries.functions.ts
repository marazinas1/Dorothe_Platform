import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

export type PublicTeamMember = {
  id: string;
  full_name: string | null;
  public_title: string | null;
  public_photo_url: string | null;
  languages_spoken: string[] | null;
  specializations: string[] | null;
  sort_order: number;
};

export const listPublicTeam = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicTeamMember[]> => {
    // Visitors have no access to the profiles table at all. The narrow
    // profiles_public view (name, title, bio, photo, languages, specialisations
    // of website-visible active staff) is read server-side only.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("profiles_public" as never)
      .select(
        "id, full_name, public_title, public_photo_url, languages_spoken, specializations, sort_order",
      )
      .order("sort_order", { ascending: true });
    if (error) throw new Error(`Failed to load team: ${error.message}`);
    return (data ?? []) as unknown as PublicTeamMember[];
  },
);


export const publicTeamQueryOptions = queryOptions({
  queryKey: ["public_team"],
  queryFn: () => listPublicTeam(),
  staleTime: 60_000,
});

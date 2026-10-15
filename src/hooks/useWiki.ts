import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type WikiPage = {
  id: string;
  title: string;
  section: string;
  content: string;
  sort_order: number;
};

export const useWikiPages = () =>
  useQuery({
    queryKey: ["wiki"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wiki_pages")
        .select("id,title,section,content,sort_order")
        .order("section")
        .order("sort_order")
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as WikiPage[];
    },
  });

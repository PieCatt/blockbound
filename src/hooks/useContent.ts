import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/context/CartContext";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  read_time: string;
  gradient: string;
  content: string[];
};

const mapProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  category: row.category,
  price: Number(row.price),
  original_price: row.original_price != null ? Number(row.original_price) : null,
  img: row.img,
  images: Array.isArray(row.images) ? row.images : [],
  badge: row.badge,
  description: row.description,
  is_free: row.is_free,
  features: Array.isArray(row.features) ? row.features : [],
  embed_html: row.embed_html ?? null,
});

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_free", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });

export const useFreeProducts = () =>
  useQuery({
    queryKey: ["free-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_free", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });

export const useAllProducts = () =>
  useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });

export const usePosts = () =>
  useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Post[];
    },
  });

export const useCategoryImages = () =>
  useQuery({
    queryKey: ["category-images"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("name,image_url");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((r) => { if (r.image_url) map[r.name] = r.image_url; });
      return map;
    },
  });

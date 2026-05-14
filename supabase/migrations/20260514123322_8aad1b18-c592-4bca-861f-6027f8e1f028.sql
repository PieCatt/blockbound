
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS features text[] NOT NULL DEFAULT ARRAY['Stokta mevcut','24 ay garanti','Orijinal lisanslı ürün']::text[],
  ADD COLUMN IF NOT EXISTS embed_html text;

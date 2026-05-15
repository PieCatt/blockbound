export type ProductTag = {
  value: string;
  label: string;
  /** Higher = shown earlier on the home page */
  priority: number;
  /** Tailwind classes for the badge pill */
  badgeClass: string;
  /** Tailwind classes added to the card root for a themed border + glow */
  cardClass: string;
  /** HSL color for the animated gradient border */
  borderColor: string;
};

export const PRODUCT_TAGS: ProductTag[] = [
  {
    value: "Çok Satan",
    label: "Çok Satan",
    priority: 100,
    badgeClass: "bg-amber-500 text-amber-950 shadow-[0_0_20px_rgba(245,158,11,0.6)]",
    cardClass: "tag-border shadow-[0_0_30px_-5px_rgba(245,158,11,0.45)]",
    borderColor: "hsl(38 92% 55%)",
  },
  {
    value: "Yeni Çıkan",
    label: "Yeni Çıkan",
    priority: 90,
    badgeClass: "bg-emerald-500 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.6)]",
    cardClass: "tag-border shadow-[0_0_30px_-5px_rgba(16,185,129,0.45)]",
    borderColor: "hsl(160 84% 45%)",
  },
  {
    value: "Sınırlı",
    label: "Sınırlı",
    priority: 80,
    badgeClass: "bg-purple-500 text-purple-50 shadow-[0_0_20px_rgba(168,85,247,0.6)]",
    cardClass: "tag-border shadow-[0_0_30px_-5px_rgba(168,85,247,0.45)]",
    borderColor: "hsl(271 91% 65%)",
  },
  {
    value: "İndirim",
    label: "İndirim",
    priority: 70,
    badgeClass: "bg-rose-500 text-rose-50 shadow-[0_0_20px_rgba(244,63,94,0.6)]",
    cardClass: "tag-border shadow-[0_0_30px_-5px_rgba(244,63,94,0.45)]",
    borderColor: "hsl(350 89% 60%)",
  },
];

export const getTag = (badge?: string | null): ProductTag | undefined =>
  badge ? PRODUCT_TAGS.find((t) => t.value === badge) : undefined;

export const effectiveBadge = (item: { badge?: string | null; original_price?: number | null; price?: number }): string | null => {
  if (item.badge) return item.badge;
  if (item.original_price != null && item.price != null && item.original_price > item.price) return "İndirim";
  return null;
};

export const tagPriority = (item: { badge?: string | null; original_price?: number | null; price?: number }): number =>
  getTag(effectiveBadge(item))?.priority ?? 0;

export const sortByTagPriority = <T extends { badge?: string | null; original_price?: number | null; price?: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => tagPriority(b) - tagPriority(a));

export type ProductTag = {
  value: string;
  label: string;
  /** Higher = shown earlier on the home page */
  priority: number;
  /** Tailwind classes for the badge pill */
  badgeClass: string;
  /** Tailwind classes added to the card root for a themed border + glow */
  cardClass: string;
};

export const PRODUCT_TAGS: ProductTag[] = [
  {
    value: "Çok Satan",
    label: "Çok Satan",
    priority: 100,
    badgeClass: "bg-amber-500 text-amber-950 shadow-[0_0_20px_rgba(245,158,11,0.6)]",
    cardClass: "ring-2 ring-amber-500/70 shadow-[0_0_30px_-5px_rgba(245,158,11,0.45)]",
  },
  {
    value: "Yeni Çıkan",
    label: "Yeni Çıkan",
    priority: 90,
    badgeClass: "bg-emerald-500 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.6)]",
    cardClass: "ring-2 ring-emerald-500/70 shadow-[0_0_30px_-5px_rgba(16,185,129,0.45)]",
  },
  {
    value: "Sınırlı",
    label: "Sınırlı",
    priority: 80,
    badgeClass: "bg-purple-500 text-purple-50 shadow-[0_0_20px_rgba(168,85,247,0.6)]",
    cardClass: "ring-2 ring-purple-500/70 shadow-[0_0_30px_-5px_rgba(168,85,247,0.45)]",
  },
  {
    value: "İndirim",
    label: "İndirim",
    priority: 70,
    badgeClass: "bg-rose-500 text-rose-50 shadow-[0_0_20px_rgba(244,63,94,0.6)]",
    cardClass: "ring-2 ring-rose-500/70 shadow-[0_0_30px_-5px_rgba(244,63,94,0.45)]",
  },
];

export const getTag = (badge?: string | null): ProductTag | undefined =>
  badge ? PRODUCT_TAGS.find((t) => t.value === badge) : undefined;

export const tagPriority = (badge?: string | null): number =>
  getTag(badge)?.priority ?? 0;

export const sortByTagPriority = <T extends { badge?: string | null }>(items: T[]): T[] =>
  [...items].sort((a, b) => tagPriority(b.badge) - tagPriority(a.badge));

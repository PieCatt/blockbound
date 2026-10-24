import { useEffect, useRef, useState } from "react";
import { BookOpen, Loader2, Search } from "lucide-react";
import { useWikiPages } from "@/hooks/useWiki";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
};

const WikiSearch = ({ open, onClose, onSelect }: Props) => {
  const { data: pages = [] } = useWikiPages();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const s = q.trim().toLocaleLowerCase("tr");
  const results = s
    ? pages.filter((p) => (p.title + " " + p.content).toLocaleLowerCase("tr").includes(s)).slice(0, 8)
    : pages.slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Wiki araması"
        className="relative w-full max-w-xl rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Wiki'de ara..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <kbd className="text-[10px] text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sonuç yok.</p>
          ) : (
            results.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSelect(p.id); onClose(); }}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BookOpen className="h-3.5 w-3.5 text-primary-glow shrink-0" />
                  {p.title}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 ml-5 line-clamp-1">{p.section}</div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WikiSearch;

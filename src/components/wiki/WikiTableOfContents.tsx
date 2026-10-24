import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Heading } from "@/lib/wikiContent";

export function useSequentialHeading(target: number, resetKey: string) {
  const [index, setIndex] = useState(0);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    setIndex(0);
    const timer = window.setInterval(() => {
      setIndex((current) => current + Math.sign(targetRef.current - current));
    }, 160);
    return () => window.clearInterval(timer);
  }, [resetKey]);

  return index;
}

export default function WikiTableOfContents({ headings, activeId, articleId, onSelect }: {
  headings: Heading[];
  activeId: string | null;
  articleId: string;
  onSelect: (id: string) => void;
}) {
  const target = Math.max(0, headings.findIndex((heading) => heading.id === activeId));
  const index = useSequentialHeading(target, articleId);
  const listRef = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState({ top: 0, height: 0 });

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const item = list.children[index + 1];
      if (item instanceof HTMLElement) setMarker({ top: item.offsetTop, height: item.offsetHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [index, headings]);

  return (
    <aside aria-label="İçindekiler" className="hidden xl:block self-start sticky top-36 rounded-2xl p-4 bg-background/40 backdrop-blur-xl border border-border/40">
      <div ref={listRef} className="relative space-y-1">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 rounded-md border-l-2 border-primary-glow bg-secondary/50 transition-[transform,height] duration-150 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translateY(${marker.top}px)`, height: marker.height }}
        />
        {headings.map((heading, position) => (
          <Button
            key={heading.id}
            variant="ghost"
            onClick={() => onSelect(heading.id)}
            aria-current={position === target ? "location" : undefined}
            className={`relative block h-auto w-full whitespace-normal text-left text-sm font-normal px-3 py-1.5 hover:bg-secondary/30 transition-colors duration-150 motion-reduce:transition-none ${
              position === index ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {heading.text}
          </Button>
        ))}
      </div>
    </aside>
  );
}
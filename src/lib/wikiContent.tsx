import { Fragment, type ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { WikiPage } from "@/hooks/useWiki";

export type Heading = { id: string; text: string };

const slugify = (s: string, i: number) =>
  s.toLocaleLowerCase("tr").replace(/[^a-z0-9ğüşöçıi]+/g, "-").replace(/^-+|-+$/g, "") || `h-${i}`;

// Split content by headings "## Başlık"; "##+" = collapsible
export function parseBlocks(content: string) {
  const lines = content.split("\n");
  const blocks: { heading: string | null; collapsible: boolean; id: string; lines: string[] }[] = [];
  let cur = { heading: null as string | null, collapsible: false, id: "h-0", lines: [] as string[] };
  let idx = 0;
  const push = () => { if (cur.heading || cur.lines.some((l) => l.trim())) blocks.push(cur); };
  for (const line of lines) {
    const m = line.match(/^##(\+)?\s+(.*)$/);
    if (m) {
      push();
      idx++;
      const text = m[2].trim();
      cur = { heading: text, collapsible: !!m[1], id: slugify(text, idx), lines: [] };
    } else {
      cur.lines.push(line);
    }
  }
  push();
  return blocks;
}

function renderInline(text: string, pages: WikiPage[], onNavigate: (id: string) => void, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[\[([^\]]+)\]\]$/);
    if (!m) return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
    const target = pages.find((p) => p.title.toLocaleLowerCase("tr") === m[1].trim().toLocaleLowerCase("tr"));
    if (!target) return <Fragment key={`${keyPrefix}-${i}`}>{m[1]}</Fragment>;
    return (
      <HoverCard key={`${keyPrefix}-${i}`} openDelay={150}>
        <HoverCardTrigger asChild>
          <button
            onClick={() => onNavigate(target.id)}
            className="text-primary-glow font-semibold underline decoration-dotted underline-offset-4 hover:decoration-solid"
          >
            {target.title}
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 bg-background/90 backdrop-blur-xl border-border/50">
          <div className="text-xs font-bold uppercase tracking-wider text-primary-glow mb-1">{target.section}</div>
          <div className="font-semibold mb-1">{target.title}</div>
          <p className="text-xs text-muted-foreground line-clamp-3">{target.content.replace(/^##\+?\s+.*$/gm, "").trim()}</p>
        </HoverCardContent>
      </HoverCard>
    );
  });
}

function renderParagraphs(lines: string[], pages: WikiPage[], onNavigate: (id: string) => void, keyPrefix: string) {
  const text = lines.join("\n").trim();
  if (!text) return null;
  return text.split(/\n{2,}/).map((para, i) => (
    <p key={`${keyPrefix}-p-${i}`} className="text-muted-foreground leading-relaxed">
      {para.split("\n").map((line, j) => (
        <Fragment key={j}>
          {j > 0 && <br />}
          {renderInline(line, pages, onNavigate, `${keyPrefix}-l-${i}-${j}`)}
        </Fragment>
      ))}
    </p>
  ));
}

export function WikiArticleBody({ content, pages, onNavigate }: { content: string; pages: WikiPage[]; onNavigate: (id: string) => void }) {
  const blocks = parseBlocks(content);
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        if (!b.heading) {
          return <div key={i} className="space-y-4">{renderParagraphs(b.lines, pages, onNavigate, `b-${i}`)}</div>;
        }
        if (b.collapsible) {
          return (
            <Accordion key={i} type="single" collapsible>
              <AccordionItem value={b.id} className="border border-border/40 rounded-xl px-4 bg-secondary/20">
                <AccordionTrigger className="text-lg font-bold hover:no-underline py-3">
                  <span id={b.id} className="scroll-mt-28">{b.heading}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pb-2">{renderParagraphs(b.lines, pages, onNavigate, `b-${i}`)}</div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        }
        return (
          <div key={i} className="space-y-4">
            <h3 id={b.id} className="text-xl font-bold scroll-mt-28 pt-2">{b.heading}</h3>
            {renderParagraphs(b.lines, pages, onNavigate, `b-${i}`)}
          </div>
        );
      })}
    </div>
  );
}

export function extractHeadings(content: string): Heading[] {
  return parseBlocks(content)
    .filter((b) => b.heading)
    .map((b) => ({ id: b.id, text: b.heading! }));
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 180));
}

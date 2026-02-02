'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Section {
  title: string;
  content: string;
  index: number;
}

const SECTION_ICONS: Record<string, string> = {
  'spending extraction': 'receipt_long',
  'match against income': 'trending_up',
  'match against goals': 'flag',
  'verdict': 'gavel',
  'suggestions': 'lightbulb',
  'summary': 'summarize',
};

const SECTION_COLORS: Record<string, string> = {
  'spending extraction': 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200',
  'match against income': 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
  'match against goals': 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
  'verdict': 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-200',
  'suggestions': 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200',
  'summary': 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200',
};

function getSectionStyle(title: string): string {
  const key = Object.keys(SECTION_ICONS).find(k => title.toLowerCase().includes(k)) || 'summary';
  return SECTION_COLORS[key] ?? SECTION_COLORS['summary'];
}

function getSectionIcon(title: string): string {
  const key = Object.keys(SECTION_ICONS).find(k => title.toLowerCase().includes(k)) || 'summarize';
  return SECTION_ICONS[key] ?? 'summarize';
}

/** Min content length for a section to be shown (avoids empty cards). */
const MIN_SECTION_CONTENT_LENGTH = 20;

export function parseSections(raw: string): { intro: string; sections: Section[] } {
  if (!raw?.trim()) return { intro: '', sections: [] };

  // Split before each "1. **Title:**" style heading
  const parts = raw.split(/\n(?=\d+\.\s+\*\*[^*]+\*\*:?)/).filter(Boolean);

  let intro = '';
  const sections: Section[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    const firstNewline = part.indexOf('\n');
    const firstLine = firstNewline === -1 ? part : part.slice(0, firstNewline);
    const rest = firstNewline === -1 ? '' : part.slice(firstNewline + 1).trim();

    const numberedMatch = firstLine.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      const title = numberedMatch[1].replace(/\*\*/g, '').replace(/:$/, '').trim();
      sections.push({ title, content: rest, index: sections.length + 1 });
    } else if (sections.length === 0 && firstLine.length > 0) {
      // First chunk with no number = intro
      intro = part;
    }
  }

  return { intro, sections };
}

/** Returns only sections that have meaningful content (for scan/result modals). */
export function filterValidSections(
  sections: Section[],
  minContentLength = MIN_SECTION_CONTENT_LENGTH
): Section[] {
  return sections.filter(
    (s) =>
      s.title.trim().length > 0 &&
      s.content.trim().length >= minContentLength
  );
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-slate-800 dark:text-slate-100">{children}</strong>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-2 ml-4 list-disc space-y-1 text-slate-600 dark:text-slate-300 text-sm">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-2 ml-4 list-decimal space-y-1 text-slate-600 dark:text-slate-300 text-sm">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
};

interface SocraticInsightContentProps {
  insight: string;
  isLoading?: boolean;
}

export default function SocraticInsightContent({ insight, isLoading }: SocraticInsightContentProps) {
  const { intro, sections } = React.useMemo(() => {
    const parsed = parseSections(insight);
    const valid = filterValidSections(parsed.sections);
    return { intro: parsed.intro, sections: valid };
  }, [insight]);

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5 mt-6" />
      </div>
    );
  }

  if (!insight?.trim()) return null;

  return (
    <div className="space-y-5">
      {intro.trim() && (
        <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed border-l-2 border-teal-300 dark:border-teal-600 pl-4 py-1">
          {intro.trim()}
        </p>
      )}
      {sections.map((section) => (
        <section
          key={section.index}
          className={`rounded-2xl border p-5 ${getSectionStyle(section.title)}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-2xl opacity-90">
              {getSectionIcon(section.title)}
            </span>
            <h5 className="font-bold text-base m-0">
              {section.title}
            </h5>
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {section.content}
            </ReactMarkdown>
          </div>
        </section>
      ))}
    </div>
  );
}

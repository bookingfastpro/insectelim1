import { Fragment, ReactNode } from 'react';

/**
 * Rendu Markdown léger et sûr (aucun HTML injecté) :
 * titres (#, ##, ###), listes (-, *, 1.), **gras**, *italique*, [liens](url).
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${i++}`;
    if (match[2] !== undefined) {
      nodes.push(<strong key={key} className="font-semibold text-gray-900">{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      nodes.push(<em key={key}>{match[3]}</em>);
    } else {
      const href = match[5];
      const safe = /^(https?:|mailto:|tel:|\/|#)/i.test(href);
      nodes.push(
        safe ? (
          <a
            key={key}
            href={href}
            className="text-[#27ae60] font-medium underline underline-offset-2 hover:text-[#1e8449]"
            {...(/^https?:/i.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {match[4]}
          </a>
        ) : (
          <Fragment key={key}>{match[4]}</Fragment>
        )
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const elements: ReactNode[] = [];
  let paragraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const k = key++;
    elements.push(
      <p key={k} className="text-gray-700 leading-relaxed mb-5 text-lg">
        {paragraph.map((l, idx) => (
          <Fragment key={idx}>
            {idx > 0 && <br />}
            {renderInline(l, `p${k}-${idx}`)}
          </Fragment>
        ))}
      </p>
    );
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    const trimmed = line.trim();

    const heading = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      const text = renderInline(heading[2], `h${key}`);
      const k = key++;
      if (level === 1) {
        elements.push(<h2 key={k} className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-10 first:mt-0">{text}</h2>);
      } else if (level === 2) {
        elements.push(<h2 key={k} className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 mt-10 first:mt-0">{text}</h2>);
      } else {
        elements.push(<h3 key={k} className="text-xl md:text-2xl font-bold text-gray-900 mb-3 mt-8 first:mt-0">{text}</h3>);
      }
      continue;
    }

    const bullet = /^[-*•]\s+/;
    const numbered = /^\d+[.)]\s+/;
    if (bullet.test(trimmed) || numbered.test(trimmed)) {
      flushParagraph();
      const ordered = numbered.test(trimmed);
      const re = ordered ? numbered : bullet;
      const items: string[] = [trimmed.replace(re, '')];
      while (i + 1 < lines.length && re.test(lines[i + 1].trim())) {
        items.push(lines[++i].trim().replace(re, ''));
      }
      const k = key++;
      const ListTag = ordered ? 'ol' : 'ul';
      elements.push(
        <ListTag
          key={k}
          className={`${ordered ? 'list-decimal' : 'list-disc'} pl-6 space-y-2 mb-6 marker:text-[#27ae60]`}
        >
          {items.map((item, idx) => (
            <li key={idx} className="text-gray-700 leading-relaxed text-lg pl-1">
              {renderInline(item, `l${k}-${idx}`)}
            </li>
          ))}
        </ListTag>
      );
      continue;
    }

    if (trimmed === '') {
      flushParagraph();
      continue;
    }

    paragraph.push(trimmed);
  }
  flushParagraph();

  return <>{elements}</>;
}

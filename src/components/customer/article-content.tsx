import * as React from "react";
import { cn } from "@/lib/utils";

interface ArticleContentProps {
  content: string;
  className?: string;
}

/**
 * Parses inline markdown tokens (links, bold, italic, inline code) into React elements.
 */
function parseInlineFormatting(text: string): React.ReactNode[] {
  const regex =
    /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      // Link: [text](url)
      const href = match[3];
      const isExternal =
        href.startsWith("http://") || href.startsWith("https://");
      nodes.push(
        <a
          key={match.index}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="font-medium text-[#9200A8] underline underline-offset-2 hover:text-[#E90078] transition-colors"
        >
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      // Bold: **text**
      nodes.push(
        <strong key={match.index} className="font-bold text-[#35123F]">
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      // Italic: *text*
      nodes.push(
        <em key={match.index} className="italic text-[#35123F]/95">
          {match[5]}
        </em>
      );
    } else if (match[6]) {
      // Code: `text`
      nodes.push(
        <code
          key={match.index}
          className="rounded bg-[#FCE7F3]/60 px-1.5 py-0.5 font-mono text-xs text-[#9200A8] border border-[#EADDED]"
        >
          {match[6]}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

/**
 * Clean, safe, semantic renderer for article content formatted with standard Markdown syntax.
 */
export function ArticleContent({ content, className }: ArticleContentProps) {
  if (!content) return null;

  // Normalize Windows newlines and split into blocks separated by empty lines
  const normalized = content.replace(/\r\n/g, "\n");
  const blocks = normalized
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className={cn("prose-content space-y-6 text-[#35123F]", className)}>
      {blocks.map((block, index) => {
        // Heading 1 or Heading 2
        if (block.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="text-2xl font-bold tracking-tight text-[#35123F] sm:text-3xl mt-8 mb-4 border-b border-[#EADDED] pb-3"
            >
              {parseInlineFormatting(block.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        if (block.startsWith("# ")) {
          return (
            <h2
              key={index}
              className="text-2xl font-extrabold tracking-tight text-[#35123F] sm:text-3xl mt-8 mb-4"
            >
              {parseInlineFormatting(block.replace(/^#\s+/, ""))}
            </h2>
          );
        }

        // Heading 3
        if (block.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="text-xl font-bold tracking-tight text-[#35123F] sm:text-2xl mt-6 mb-3"
            >
              {parseInlineFormatting(block.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        // Heading 4
        if (block.startsWith("#### ")) {
          return (
            <h4
              key={index}
              className="text-lg font-bold tracking-tight text-[#35123F] mt-4 mb-2"
            >
              {parseInlineFormatting(block.replace(/^####\s+/, ""))}
            </h4>
          );
        }

        // Blockquote
        if (block.startsWith(">")) {
          const quoteLines = block
            .split("\n")
            .map((line) => line.replace(/^>\s?/, "").trim())
            .filter(Boolean);
          return (
            <blockquote
              key={index}
              className="border-l-4 border-[#9200A8] bg-[#FAF5FF] rounded-r-xl py-3.5 px-6 my-6 italic text-[#35123F] shadow-2xs leading-relaxed"
            >
              {quoteLines.map((line, i) => (
                <p key={i} className={i > 0 ? "mt-2" : ""}>
                  {parseInlineFormatting(line)}
                </p>
              ))}
            </blockquote>
          );
        }

        // Unordered list
        const lines = block.split("\n").map((l) => l.trim());
        const isBulletList = lines.every(
          (line) => line.startsWith("- ") || line.startsWith("* ")
        );
        if (isBulletList && lines.length > 0) {
          return (
            <ul
              key={index}
              className="space-y-2.5 my-4 pl-6 list-disc marker:text-[#9200A8]"
            >
              {lines.map((item, i) => (
                <li
                  key={i}
                  className="text-base sm:text-lg leading-relaxed text-[#35123F]/90"
                >
                  {parseInlineFormatting(item.replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        // Ordered list
        const isNumberedList = lines.every((line) => /^\d+\.\s+/.test(line));
        if (isNumberedList && lines.length > 0) {
          return (
            <ol
              key={index}
              className="space-y-2.5 my-4 pl-6 list-decimal marker:text-[#9200A8] marker:font-semibold"
            >
              {lines.map((item, i) => (
                <li
                  key={i}
                  className="text-base sm:text-lg leading-relaxed text-[#35123F]/90"
                >
                  {parseInlineFormatting(item.replace(/^\d+\.\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        // Default Paragraph (supports multi-line paragraph within the block)
        return (
          <p
            key={index}
            className="text-base sm:text-lg text-[#35123F]/90 leading-relaxed sm:leading-loose"
          >
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {parseInlineFormatting(line)}
                {lineIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

import { Lexer, type Token, type Tokens } from "marked";

export interface ArchiveSection {
  heading?: Tokens.Heading;
  subheading?: Tokens.Heading;
  image?: Tokens.Image;
  blocks: Token[];
}

/** Group each image with the text following it, retaining the author's source order. */
export function getArchiveSections(markdown: string): ArchiveSection[] {
  const sections: ArchiveSection[] = [];
  let current: ArchiveSection = { blocks: [] };
  const flush = () => {
    if (current.heading || current.image || current.blocks.length) sections.push(current);
    current = { blocks: [] };
  };
  for (const token of Lexer.lex(markdown)) {
    if (token.type === "space" || token.type === "def") continue;
    if (token.type === "heading" && (token as Tokens.Heading).depth <= 2) {
      flush();
      current.heading = token as Tokens.Heading;
    } else if (token.type === "heading" && (token as Tokens.Heading).depth === 3 && current.heading && !current.subheading && !current.image && !current.blocks.length) {
      current.subheading = token as Tokens.Heading;
    } else if (token.type === "paragraph" && token.tokens?.some((child: Token) => child.type === "image")) {
      let inline: Token[] = [];
      const addParagraph = () => {
        if (inline.some((child) => child.raw.trim())) {
          current.blocks.push({ type: "paragraph", raw: "", text: "", tokens: inline });
        }
        inline = [];
      };
      for (const child of token.tokens as Token[]) {
        if (child.type === "image") {
          addParagraph();
          if (current.image || current.blocks.length) flush();
          current.image = child as Tokens.Image;
        } else {
          inline.push(child);
        }
      }
      addParagraph();
    } else {
      current.blocks.push(token);
    }
  }
  flush();
  return sections;
}

export function safeArchiveLink(href: string): string | undefined {
  return /^(?:https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href.trim()) ? href.trim() : undefined;
}

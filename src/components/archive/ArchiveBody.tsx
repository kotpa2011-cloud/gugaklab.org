import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import type { MarkedToken, Token } from "marked";

import { getArchiveSections, safeArchiveLink } from "@/lib/archive-markdown";
import { resolveArchiveImage } from "@/lib/archive";
import styles from "./Archive.module.css";

function Inline({ tokens }: { tokens: Token[] }): ReactNode {
  return tokens.map((raw, index) => {
    const token = raw as MarkedToken;
    let child: ReactNode;
    switch (token.type) {
      case "strong": child = <strong><Inline tokens={token.tokens} /></strong>; break;
      case "em": child = <em><Inline tokens={token.tokens} /></em>; break;
      case "del": child = <del><Inline tokens={token.tokens} /></del>; break;
      case "codespan": child = <code>{token.text}</code>; break;
      case "br": child = <br />; break;
      case "link": {
        const href = safeArchiveLink(token.href);
        child = href ? <a href={href}><Inline tokens={token.tokens} /></a> : <Inline tokens={token.tokens} />;
        break;
      }
      case "text": child = token.tokens ? <Inline tokens={token.tokens} /> : token.text; break;
      case "escape": child = token.text; break;
      case "html": child = token.text; break;
      default: child = null;
    }
    return <Fragment key={index}>{child}</Fragment>;
  });
}

function Blocks({ tokens }: { tokens: Token[] }): ReactNode {
  return tokens.map((raw, index) => {
    const token = raw as MarkedToken;
    let child: ReactNode;
    switch (token.type) {
      case "paragraph": child = <p><Inline tokens={token.tokens} /></p>; break;
      case "text": child = <p>{token.tokens ? <Inline tokens={token.tokens} /> : token.text}</p>; break;
      case "heading": child = <h3><Inline tokens={token.tokens} /></h3>; break;
      case "list": {
        const items = token.items.map((item, i) => <li key={i}><Blocks tokens={item.tokens} /></li>);
        child = token.ordered ? <ol start={Number(token.start) || 1}>{items}</ol> : <ul>{items}</ul>;
        break;
      }
      case "blockquote": child = <blockquote><Blocks tokens={token.tokens} /></blockquote>; break;
      case "code": child = <pre><code>{token.text}</code></pre>; break;
      case "hr": child = <hr />; break;
      case "html": child = <p>{token.text}</p>; break;
      case "table": child = (
        <div className={styles.tableScroll}>
          <table><thead><tr>{token.header.map((cell, i) => <th key={i}><Inline tokens={cell.tokens} /></th>)}</tr></thead>
            <tbody>{token.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}><Inline tokens={cell.tokens} /></td>)}</tr>)}</tbody>
          </table>
        </div>
      ); break;
      default: child = null;
    }
    return <Fragment key={index}>{child}</Fragment>;
  });
}

export default function ArchiveBody({ markdown }: { markdown: string }) {
  return (
    <div className={styles.body}>
      {getArchiveSections(markdown).map((section, index) => (
        <section className={styles.bodySection} key={index}>
          {section.heading && <h2><Inline tokens={section.heading.tokens} /></h2>}
          <div className={`${styles.sectionRow}${section.image ? "" : ` ${styles.textOnly}`}`}>
            {section.image && (
              <figure className={styles.figure}>
                <Image
                  src={resolveArchiveImage(section.image.href)}
                  alt={section.image.text}
                  width={760}
                  height={428}
                  sizes="(max-width: 700px) calc(100vw - 92px), (max-width: 1100px) calc(100vw - 80px), 50vw"
                  priority={index === 0}
                />
                {section.image.title && <figcaption>{section.image.title}</figcaption>}
              </figure>
            )}
            {section.blocks.length > 0 && (
              <div className={styles.sectionCopy}><Blocks tokens={section.blocks} /></div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

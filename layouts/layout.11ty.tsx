import React from "react";
import Content from "./Content";

interface Props {
  title: string;
  author?: string;
  authorSlug?: string;
  authorPage?: boolean;
  related: { url: string; text: string }[];
  content: string;
}

const Layout: React.FC<Props> = ({
  title,
  author,
  authorSlug,
  authorPage,
  related,
  content,
}) => {
  return (
    <html translate="no">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link href="/corpus/index.css" rel="stylesheet" />
      </head>
      <main className="my-8 mx-8 max-w-2xl md:mx-auto">
        <article>
          <header className="my-4">
            <h1 className="text-3xl font-bold">{title}</h1>
            {author && !authorPage && (
              <h2 className="text-xl italic">
                <a href={`/corpus/jerriais/${authorSlug}`} rel="author">
                  {author}
                </a>
              </h2>
            )}
          </header>
          <Content>{content}</Content>
          <footer className="prose my-8">
            {related && (
              <>
                <h3>Viyiz étout</h3>
                <ul>
                  {related.map(({ url, text }) => (
                    <li key={url}>
                      <a href={url}>{text}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </footer>
        </article>
      </main>
    </html>
  );
};

export default Layout;

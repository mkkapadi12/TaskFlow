// Pick ONE theme — paste in index.css or import here
import 'highlight.js/styles/github-dark.css';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { ScrollArea } from '@/components/ui/scroll-area';

const MarkdownViewer = ({ url }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((t) => {
        setContent(t);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [url]);

  if (loading)
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Loading…
      </div>
    );

  if (error)
    return (
      <div className="text-destructive flex h-full items-center justify-center text-sm">
        Failed to load document.
      </div>
    );

  return (
    <ScrollArea className="h-full">
      <article className="prose prose-sm dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h1:border-b prose-h1:border-border/40 prose-h1:pb-2 prose-h2:border-b prose-h2:border-border/20 prose-h2:pb-1 prose-table:border-collapse prose-th:border prose-th:border-border/60 prose-th:bg-muted/60 prose-th:px-3 prose-th:py-2 prose-th:text-xs prose-th:font-semibold prose-th:uppercase prose-th:tracking-wider prose-td:border prose-td:border-border/40 prose-td:px-3 prose-td:py-2 prose-td:text-sm prose-code:bg-muted/60 prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0d1117] prose-pre:rounded-xl prose-pre:border prose-pre:border-border/30 prose-pre:p-0 prose-pre:overflow-hidden prose-pre:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:not-italic prose-a:text-primary prose-a:underline-offset-4 prose-img:rounded-xl prose-img:shadow-md prose-hr:border-border/40 prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-primary/60 mx-auto max-w-full px-4 py-6 sm:px-8 sm:py-10">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            // Wrap code blocks — adds filename-like header if lang present
            pre({ children, ...props }) {
              const child = children?.props;
              const lang = child?.className?.replace('language-', '') ?? '';
              return (
                <div className="border-border/30 my-4 overflow-hidden rounded-xl border">
                  {lang && (
                    <div className="border-border/20 flex items-center justify-between border-b bg-zinc-900 px-4 py-1.5">
                      <span className="font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
                        {lang}
                      </span>
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                    </div>
                  )}
                  <pre
                    {...props}
                    className="m-0! overflow-x-auto rounded-none! border-none! p-4"
                  >
                    {children}
                  </pre>
                </div>
              );
            },
            // Table wrapper — horizontal scroll on overflow
            table({ children }) {
              return (
                <div className="border-border/40 my-4 overflow-x-auto rounded-xl border">
                  <table className="w-full text-sm">{children}</table>
                </div>
              );
            },
            // Inline code — no background double-wrap
            code({ inline, className, children, ...props }) {
              if (inline) {
                return (
                  <code
                    className="bg-muted/70 text-primary rounded px-1.5 py-0.5 font-mono text-xs"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </ScrollArea>
  );
};

export default MarkdownViewer;

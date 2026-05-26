import { useEffect, useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';

const TextViewer = ({ url }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch text content');
        return r.text();
      })
      .then((t) => {
        setContent(t);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center p-6 text-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
          <p>Loading file content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive flex h-full items-center justify-center p-6 text-sm">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="bg-muted/5 h-full">
      <div className="mx-auto max-w-4xl p-3 sm:p-6">
        <pre className="bg-muted/40 border-border/40 text-foreground rounded-lg border p-3 font-mono text-[10px] leading-relaxed whitespace-pre-wrap sm:p-4 sm:text-xs">
          {content}
        </pre>
      </div>
    </ScrollArea>
  );
};

export default TextViewer;

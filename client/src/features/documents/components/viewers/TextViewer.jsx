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
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p>Loading file content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive text-sm p-6">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full bg-muted/5">
      <div className="p-6 max-w-4xl mx-auto">
        <pre className="whitespace-pre-wrap font-mono text-xs p-4 bg-muted/40 border border-border/40 rounded-lg text-foreground leading-relaxed">
          {content}
        </pre>
      </div>
    </ScrollArea>
  );
};

export default TextViewer;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.min(window.innerWidth - 32, 700);
    }
    return 700;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const width = entries[0].contentRect.width;
        // Keep it responsive, subtract padding/scrollbar width
        setContainerWidth(Math.max(200, Math.min(width - 32, 700)));
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex h-full flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex justify-center p-2 sm:p-4">
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <p className="text-muted-foreground text-sm">Loading PDF…</p>
            }
          >
            <Page pageNumber={currentPage} width={containerWidth} />
          </Document>
        </div>
      </ScrollArea>
      {/* Pagination bar */}
      <div className="border-border/30 bg-muted/20 flex items-center justify-center gap-3 border-b py-2">
        <Button
          size="icon-sm"
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          <DASHBOARD_ICONS.CHEVRONLEFT className="h-3 w-3" />
        </Button>
        <span className="text-muted-foreground text-xs">
          Page {currentPage} of {numPages ?? '…'}
        </span>
        <Button
          size="icon-sm"
          variant="outline"
          disabled={currentPage >= numPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          <DASHBOARD_ICONS.CHEVRONRIGHT className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default PDFViewer;

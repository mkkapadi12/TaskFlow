import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

import ImageViewer from './viewers/ImageViewer';
import MarkdownViewer from './viewers/MarkdownViewer';
import OfficeViewer from './viewers/OfficeViewer';
import PDFViewer from './viewers/PDFViewer';
import TextViewer from './viewers/TextViewer';

const getViewer = (ext) => {
  if (ext === 'pdf') return 'pdf';
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'image';
  if (ext === 'md' || ext === 'mdx') return 'markdown';
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext))
    return 'office';
  if (['txt', 'csv', 'json'].includes(ext)) return 'text';
  return null;
};

const DocumentPreviewModal = ({ doc, open, onClose }) => {
  if (!doc) return null;
  const ext = doc.name.split('.').pop().toLowerCase();
  const viewer = getViewer(ext);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex h-[90vh] w-full max-w-5xl flex-col gap-0 p-0 sm:max-w-5xl">
        <DialogHeader className="border-border/40 flex-row items-center justify-between border-b py-3 pr-12 pl-4">
          <div className="flex items-center gap-2">
            <DASHBOARD_ICONS.FILETEXT className="text-muted-foreground h-4 w-4" />
            <DialogTitle className="max-w-xs truncate text-sm font-semibold">
              {doc.name}
            </DialogTitle>
            <Badge className="px-1.5 text-[9px] uppercase">.{ext}</Badge>
          </div>
          <a href={doc.url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
              <DASHBOARD_ICONS.DOWNLOAD className="h-3 w-3" />
              Download
            </Button>
          </a>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {viewer === 'pdf' && <PDFViewer url={doc.url} />}
          {viewer === 'image' && <ImageViewer url={doc.url} name={doc.name} />}
          {viewer === 'markdown' && <MarkdownViewer url={doc.url} />}
          {viewer === 'office' && <OfficeViewer url={doc.url} />}
          {viewer === 'text' && <TextViewer url={doc.url} />}
          {!viewer && (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              Preview not available for this file type.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default DocumentPreviewModal;

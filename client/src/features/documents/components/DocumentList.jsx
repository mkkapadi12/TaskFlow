import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

import {
  useDeleteDocumentMutation,
  useGetDocumentsQuery,
} from '../document.api';

const formatBytes = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const EXT_COLORS = {
  pdf: 'bg-red-500/10 text-red-500',
  doc: 'bg-blue-500/10 text-blue-500',
  docx: 'bg-blue-500/10 text-blue-500',
  xls: 'bg-emerald-500/10 text-emerald-500',
  xlsx: 'bg-emerald-500/10 text-emerald-500',
  ppt: 'bg-orange-500/10 text-orange-500',
  pptx: 'bg-orange-500/10 text-orange-500',
  md: 'bg-blue-500/10 text-blue-500',
};

const getExt = (name) => name.split('.').pop()?.toLowerCase() || 'file';

const DocumentList = ({ projectId, isManager }) => {
  const { data, isLoading } = useGetDocumentsQuery(projectId);
  const [deleteDocument] = useDeleteDocumentMutation();
  const confirm = useAlertDialog();

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument({ projectId, documentId }).unwrap();
      toast.success('Document deleted');
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  if (isLoading)
    return (
      <p className="text-muted-foreground text-sm">Loading documents...</p>
    );

  const docs = data?.data || [];

  if (docs.length === 0) {
    return (
      <div className="border-border/50 rounded-lg border border-dashed py-8 text-center">
        <DASHBOARD_ICONS.FILETEXT className="text-muted-foreground/50 mx-auto mb-2 h-8 w-8" />
        <p className="text-muted-foreground text-sm">
          No documents uploaded yet.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-border/50 divide-y">
      {docs.map((doc) => {
        const ext = getExt(doc.name);
        return (
          <li
            key={doc.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <DASHBOARD_ICONS.FILETEXT className="text-muted-foreground h-5 w-5 shrink-0" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{doc.name}</p>
              <p className="text-muted-foreground text-xs">
                {formatBytes(doc.size)} · by {doc.uploaderName} ·{' '}
                {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </div>

            <Badge
              className={`${EXT_COLORS[ext] || 'bg-muted text-muted-foreground'} lowecase border-transparent text-[10px]`}
            >
              .{ext}
            </Badge>

            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <DASHBOARD_ICONS.DOWNLOAD className="h-4 w-4" />
              </Button>
            </a>

            {isManager && (
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  const isConfirmed = await confirm({
                    title: 'Delete document?',
                    description: (
                      <span>
                        <span className="text-foreground font-medium">
                          {doc.name}
                        </span>{' '}
                        will be permanently deleted and cannot be recovered.
                      </span>
                    ),
                    confirmText: 'Delete',
                    cancelText: 'Cancel',
                    media: (
                      <DASHBOARD_ICONS.TRASH2 className="text-destructive h-6 w-6" />
                    ),
                    mediaClassName: 'bg-destructive/10 text-destructive',
                    variant: 'destructive',
                  });
                  if (isConfirmed) {
                    handleDelete(doc.id);
                  }
                }}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                aria-label={`Delete ${doc.name}`}
              >
                <DASHBOARD_ICONS.TRASH2 className="h-4 w-4" />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default DocumentList;

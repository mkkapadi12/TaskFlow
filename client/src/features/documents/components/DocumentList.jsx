import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Loader2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { EXT_COLORS } from '@/constant';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

import {
  useDeleteDocumentMutation,
  useGetDocumentsQuery,
} from '../document.api';
import DocumentPreviewModal from './DocumentPreviewModal';

const formatBytes = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getExt = (name) => name.split('.').pop()?.toLowerCase() || 'file';

const DocumentList = ({ projectId, isManager }) => {
  const { data, isLoading } = useGetDocumentsQuery(projectId);
  const [deleteDocument] = useDeleteDocumentMutation();
  const confirm = useAlertDialog();
  const [previewDoc, setPreviewDoc] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [extFilter, setExtFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [zipping, setZipping] = useState(false);

  // Memoized docs array to satisfy dependency checks and rules of hooks
  const docs = useMemo(() => data?.data || [], [data]);

  // Generate unique extensions list dynamically
  const uniqueExtensions = useMemo(() => {
    const extensions = docs.map((doc) => getExt(doc.name));
    return ['all', ...new Set(extensions)];
  }, [docs]);

  // Filter documents in memory
  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      const ext = getExt(doc.name);
      const matchesSearch = doc.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesExt = extFilter === 'all' || ext === extFilter;
      return matchesSearch && matchesExt;
    });
  }, [docs, searchQuery, extFilter]);

  // Selection state calculations
  const isAllFilteredSelected = useMemo(() => {
    return (
      filteredDocs.length > 0 &&
      filteredDocs.every((doc) => selectedIds.has(doc.id))
    );
  }, [filteredDocs, selectedIds]);

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument({ projectId, documentId }).unwrap();
      toast.success('Document deleted');
      // Remove deleted document from selection if it was selected
      if (selectedIds.has(documentId)) {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(documentId);
          return next;
        });
      }
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  // Toggle selection for a single document
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle selection for all filtered documents
  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      // Clear selection completely if all filtered docs are currently selected
      setSelectedIds(new Set());
    } else {
      // Select all currently filtered documents
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredDocs.forEach((doc) => next.add(doc.id));
        return next;
      });
    }
  };

  // Deselect all
  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  // Bulk ZIP download generator
  const handleBulkDownload = async () => {
    if (selectedIds.size === 0) return;

    setZipping(true);
    const zip = new JSZip();
    const selectedDocs = docs.filter((d) => selectedIds.has(d.id));

    try {
      await Promise.all(
        selectedDocs.map(async (doc) => {
          try {
            const response = await fetch(doc.url);
            if (!response.ok)
              throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();
            zip.file(doc.name, blob);
          } catch (fetchErr) {
            console.error(`Failed to fetch document ${doc.name}:`, fetchErr);
            toast.error(`Failed to fetch file: ${doc.name}`);
            throw fetchErr;
          }
        })
      );

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'documents.zip');
      toast.success('ZIP package downloaded successfully!');
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Error generating ZIP:', err);
      toast.error('Could not package and download ZIP');
    } finally {
      setZipping(false);
    }
  };

  // Early return for loading - placed after all hooks declarations to satisfy Rules of Hooks
  if (isLoading)
    return (
      <p className="text-muted-foreground text-sm">Loading documents...</p>
    );

  // If no documents exist in the database for the project
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
    <>
      {/* Search and Extension Filter Bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={extFilter}
            onChange={(e) => setExtFilter(e.target.value)}
            className="border-input text-foreground dark:bg-input/30 focus:border-primary/50 flex h-8 items-center rounded-lg border bg-transparent px-3 py-1 text-sm transition-colors outline-none"
          >
            <option value="all" className="bg-popover text-foreground">
              All extensions
            </option>
            {uniqueExtensions
              .filter((ext) => ext !== 'all')
              .map((ext) => (
                <option
                  key={ext}
                  value={ext}
                  className="bg-popover text-foreground"
                >
                  .{ext}
                </option>
              ))}
          </select>

          {filteredDocs.length > 0 && (
            <div className="border-border/50 bg-muted/20 flex items-center gap-2 rounded-lg border px-3 py-1 text-sm font-medium">
              <Checkbox
                checked={isAllFilteredSelected}
                onCheckedChange={handleToggleSelectAll}
                id="select-all"
              />
              <label
                htmlFor="select-all"
                className="text-muted-foreground cursor-pointer text-xs select-none"
              >
                Select all
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Main Document List / Table */}
      {filteredDocs.length === 0 ? (
        <div className="border-border/50 rounded-lg border border-dashed py-8 text-center">
          <Search className="text-muted-foreground/50 mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            No matching documents found.
          </p>
        </div>
      ) : (
        <ul className="divide-border/50 space-y-2 divide-y">
          {filteredDocs.map((doc) => {
            const ext = getExt(doc.name);
            const isSelected = selectedIds.has(doc.id);
            return (
              <li
                key={doc.id}
                className={`-mx-2 flex flex-col gap-2.5 rounded-lg px-2 py-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-3 ${
                  isSelected
                    ? 'bg-primary/5 dark:bg-primary/10'
                    : 'hover:bg-muted/10'
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {/* Select Checkbox per row */}
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggleSelect(doc.id)}
                    className="shrink-0"
                    aria-label={`Select ${doc.name}`}
                  />
                  <DASHBOARD_ICONS.FILETEXT className="text-muted-foreground h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5 sm:justify-start">
                      <p className="truncate pr-2 text-sm font-semibold">
                        {doc.name}
                      </p>
                      <Badge
                        className={`${EXT_COLORS[ext] || 'bg-muted text-muted-foreground'} shrink-0 rounded-full border-transparent px-2 py-0.5 text-[9px] font-semibold lowercase`}
                      >
                        .{ext}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-0.5 hidden truncate text-[11px] sm:block">
                      {formatBytes(doc.size)} · by {doc.uploaderName} ·{' '}
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-border/5 flex w-full shrink-0 items-center justify-between gap-2 border-t pt-2 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
                  <span className="text-muted-foreground text-xs font-medium sm:hidden">
                    {formatBytes(doc.size)} · {doc.uploaderName}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8 p-0 transition-colors"
                      onClick={() => setPreviewDoc(doc)}
                      aria-label={`Preview ${doc.name}`}
                    >
                      <DASHBOARD_ICONS.EYE className="h-4 w-4" />
                    </Button>

                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
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
                                will be permanently deleted and cannot be
                                recovered.
                              </span>
                            ),
                            confirmText: 'Delete',
                            cancelText: 'Cancel',
                            media: (
                              <DASHBOARD_ICONS.TRASH2 className="text-destructive h-6 w-6" />
                            ),
                            mediaClassName:
                              'bg-destructive/10 text-destructive',
                            variant: 'destructive',
                          });
                          if (isConfirmed) {
                            handleDelete(doc.id);
                          }
                        }}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0 p-0"
                        aria-label={`Delete ${doc.name}`}
                      >
                        <DASHBOARD_ICONS.TRASH2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-popover/85 border-border/50 text-popover-foreground animate-in slide-in-from-bottom-5 fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-2.5 rounded-full border px-3.5 py-2 shadow-xl backdrop-blur-md sm:w-auto sm:max-w-none sm:justify-start sm:gap-4 sm:px-4.5 sm:py-2.5">
          <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold">
            <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-[10px]">
              {selectedIds.size}
            </span>
            <span className="lg:inline hidden">selected</span>
          </div>

          <div className="bg-border/80 h-4 w-px shrink-0" />

          <div className="flex min-w-0 flex-1 items-center justify-center gap-1 sm:flex-initial sm:justify-start sm:gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 shrink-0 rounded-full px-2 text-xs sm:px-3"
              onClick={handleDeselectAll}
            >
              Deselect all
            </Button>

            <Button
              size="sm"
              disabled={zipping}
              className="bg-primary text-primary-foreground hover:bg-primary/95 h-8 shrink-0 rounded-full px-3 text-xs font-semibold shadow-sm transition-colors sm:px-3.5"
              onClick={handleBulkDownload}
            >
              {zipping ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Packaging...
                </>
              ) : (
                <>
                  <DASHBOARD_ICONS.DOWNLOAD className="mr-1.5 h-3.5 w-3.5" />
                  Download ZIP
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <DocumentPreviewModal
        doc={previewDoc}
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </>
  );
};

export default DocumentList;

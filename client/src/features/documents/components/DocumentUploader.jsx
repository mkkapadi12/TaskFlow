import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { formatBytes } from '@/lib/utils';

import { useUploadDocumentsMutation } from '../document.api';

const ALLOWED_EXTENSIONS =
  '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.webp,.md,.mdx,.csv,.json';

const DocumentUploader = ({ projectId }) => {
  const inputRef = useRef(null);
  const [staged, setStaged] = useState([]); // files staged before upload
  const [uploadDocuments, { isLoading }] = useUploadDocumentsMutation();

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.size <= 20 * 1024 * 1024);
    if (valid.length < files.length) {
      toast.error('Some files exceed 20MB and were skipped');
    }
    setStaged((prev) => [...prev, ...valid]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeStaged = (idx) =>
    setStaged((prev) => prev.filter((_, i) => i !== idx));

  const handleUpload = async () => {
    if (staged.length === 0) return;

    const formData = new FormData();
    staged.forEach((file) => formData.append('documents', file));

    try {
      const res = await uploadDocuments({ projectId, formData }).unwrap();
      toast.success(res.message);
      setStaged([]);
    } catch (err) {
      toast.error(err?.message || 'Upload failed');
    }
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-border/50 hover:border-primary/50 hover:bg-muted/30 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors"
      >
        <DASHBOARD_ICONS.UPLOAD className="text-muted-foreground mb-2 h-8 w-8" />
        <p className="text-sm font-medium">
          Drop files here or click to browse
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          PDF, Word, Excel, PPT, Images — max 20MB each, up to 5 files
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Staged files */}
      {staged.length > 0 && (
        <div className="space-y-2">
          {staged.map((file, idx) => (
            <div
              key={idx}
              className="border-border/50 bg-muted/20 flex items-center gap-3 rounded-lg border px-3 py-2"
            >
              <DASHBOARD_ICONS.FILETEXT className="text-primary h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-muted-foreground text-xs">
                  {formatBytes(file.size)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeStaged(idx);
                }}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <DASHBOARD_ICONS.CLOSE className="h-4 w-4" />
              </button>
            </div>
          ))}

          <Button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <DASHBOARD_ICONS.LOADER2 className="h-4 w-4 animate-spin" />{' '}
                Uploading...
              </>
            ) : (
              <>
                <DASHBOARD_ICONS.UPLOAD className="h-4 w-4" /> Upload{' '}
                {staged.length} file(s)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;

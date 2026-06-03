import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EXT_COLORS } from '@/constant';
import DocumentPreviewModal from '@/features/documents/components/DocumentPreviewModal';
import {
  useDeleteTaskAttachmentMutation,
  useGetTaskAttachmentsQuery,
  useUploadTaskAttachmentsMutation,
} from '@/features/tasks/attachment.api';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { cn, formatBytes, formatDateDisplay } from '@/lib/utils';

const ALLOWED_EXTENSIONS =
  '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.webp,.md,.mdx,.csv,.json';

export default function TaskAttachmentsSection({
  taskId,
  taskAssigneeId,
  isProjectArchived,
  currentUserId,
  projectRole,
}) {
  const fileInputRef = useRef(null);
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const { data: response, isLoading: isListLoading } =
    useGetTaskAttachmentsQuery(taskId);
  const [uploadAttachments, { isLoading: isUploading }] =
    useUploadTaskAttachmentsMutation();
  const [deleteAttachment, { isLoading: isDeleting }] =
    useDeleteTaskAttachmentMutation();

  const attachments = response?.data || [];
  const isManager = projectRole === 'OWNER' || projectRole === 'ADMIN';
  const isAssignee =
    !!taskAssigneeId && Number(taskAssigneeId) === Number(currentUserId);

  const handleFiles = (files) => {
    if (isProjectArchived || !isAssignee) return;
    const valid = Array.from(files).filter((f) => f.size <= 20 * 1024 * 1024);
    if (valid.length < files.length) {
      toast.error('Some files exceed the 20MB limit and were skipped');
    }

    // Limit to max 5 total staged files
    if (stagedFiles.length + valid.length > 5) {
      toast.error('You can stage a maximum of 5 files for upload at once');
      const spaceLeft = 5 - stagedFiles.length;
      setStagedFiles((prev) => [...prev, ...valid.slice(0, spaceLeft)]);
    } else {
      setStagedFiles((prev) => [...prev, ...valid]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProjectArchived || !isAssignee) return;
    handleFiles(e.dataTransfer.files);
  };

  const removeStagedFile = (idx) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (isProjectArchived || !isAssignee || stagedFiles.length === 0) return;

    const formData = new FormData();
    stagedFiles.forEach((file) => formData.append('attachments', file));

    try {
      await uploadAttachments({ taskId, formData }).unwrap();
      toast.success('Attachments uploaded successfully');
      setStagedFiles([]);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Upload failed');
    }
  };

  const handleDelete = async (e, attachmentId) => {
    e.stopPropagation();
    if (isProjectArchived) return;

    const isConfirmed = window.confirm(
      'Are you sure you want to permanently delete this attachment?'
    );
    if (!isConfirmed) return;

    try {
      await deleteAttachment({ taskId, attachmentId }).unwrap();
      toast.success('Attachment deleted');
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || 'Failed to delete attachment'
      );
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold tracking-tight">
          <DASHBOARD_ICONS.HARDDRIVE className="text-muted-foreground h-4 w-4" />
          Task Attachments
        </h3>
        {attachments.length > 0 && (
          <span className="text-muted-foreground text-xs font-medium">
            {attachments.length} file{attachments.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Files List */}
      {isListLoading ? (
        <div className="flex items-center justify-center py-6">
          <DASHBOARD_ICONS.LOADER2 className="text-primary h-6 w-6 animate-spin" />
        </div>
      ) : attachments.length === 0 && stagedFiles.length === 0 ? (
        <div className="border-border/30 bg-muted/5 flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
          <DASHBOARD_ICONS.FILETEXT className="text-muted-foreground/30 mb-2 h-8 w-8" />
          <p className="text-foreground/75 text-xs font-medium">
            No attachments yet
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            {isProjectArchived
              ? 'This project is archived (read-only)'
              : 'Drag and drop files to attach them to this task'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {attachments.map((file) => {
            const ext = getFileExtension(file.name);
            const canDelete =
              !isProjectArchived &&
              (file.uploadedBy === currentUserId || isManager);

            return (
              <div
                key={file.id}
                onClick={() => setPreviewDoc(file)}
                className="group border-border/50 bg-muted/10 hover:border-primary/30 flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold uppercase',
                      EXT_COLORS[ext] || 'bg-muted text-muted-foreground'
                    )}
                  >
                    {ext.slice(0, 3)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground/95 truncate text-xs leading-normal font-semibold">
                      {file.name}
                    </p>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-[10px]">
                      <span>{formatBytes(file.size)}</span>
                      <span>•</span>
                      <span>{formatDateDisplay(file.createdAt, 'short')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-2">
                  <Avatar className="border-border/40 h-5 w-5 shrink-0 border">
                    {file.uploaderAvatar && (
                      <AvatarImage src={file.uploaderAvatar} />
                    )}
                    <AvatarFallback className="bg-muted text-muted-foreground text-[8px] font-bold">
                      {getInitials(file.uploaderName)}
                    </AvatarFallback>
                  </Avatar>

                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isDeleting}
                      onClick={(e) => handleDelete(e, file.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7 shrink-0 rounded-lg p-0 opacity-0 transition-all duration-200 group-hover:opacity-100 focus:opacity-100"
                    >
                      <DASHBOARD_ICONS.TRASH2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Dropzone (if not archived and user is assignee) */}
      {!isProjectArchived && isAssignee && (
        <div className="space-y-3">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-border/50 hover:border-primary/50 hover:bg-muted/30 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-all duration-200',
              isDragOver && 'border-primary bg-primary/5 scale-[0.99]'
            )}
          >
            <DASHBOARD_ICONS.UPLOAD className="text-muted-foreground mb-1.5 h-6 w-6" />
            <p className="text-xs font-semibold">
              Drop files here or click to browse
            </p>
            <p className="text-muted-foreground mt-0.5 text-[10px]">
              PDF, Word, Excel, PPT, Text, Markdown, Images — max 20MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ALLOWED_EXTENSIONS}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Staged Files List */}
          {stagedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Staged for upload ({stagedFiles.length}/5)
              </div>
              <div className="space-y-1.5">
                {stagedFiles.map((file, idx) => {
                  return (
                    <div
                      key={idx}
                      className="border-border/40 bg-muted/5 flex items-center justify-between rounded-lg border px-3 py-1.5"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <DASHBOARD_ICONS.FILETEXT className="text-primary h-3.5 w-3.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">
                            {file.name}
                          </p>
                          <p className="text-muted-foreground text-[10px]">
                            {formatBytes(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeStagedFile(idx)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                      >
                        <DASHBOARD_ICONS.CLOSE className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={handleUpload}
                disabled={isUploading}
                size="sm"
                className="h-8 w-full gap-2 rounded-lg text-xs font-semibold shadow-sm"
              >
                {isUploading ? (
                  <>
                    <DASHBOARD_ICONS.LOADER2 className="h-3.5 w-3.5 animate-spin" />
                    Uploading attachments...
                  </>
                ) : (
                  <>
                    <DASHBOARD_ICONS.UPLOAD className="h-3.5 w-3.5" />
                    Upload Staged Files
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Helper note for non-assignees */}
      {!isProjectArchived && !isAssignee && (
        <div className="border-border/30 bg-muted/5 flex items-center justify-center rounded-xl border border-dashed px-4 py-3 text-center">
          <p className="text-muted-foreground text-[11px] leading-none font-medium">
            Only the task assignee can upload attachments.
          </p>
        </div>
      )}

      {/* Document Preview Dialog */}
      {previewDoc && (
        <DocumentPreviewModal
          doc={previewDoc}
          open={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
}

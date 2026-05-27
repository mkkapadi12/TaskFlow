import { formatDistanceToNow } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useGetTaskCommentsQuery,
} from '@/features/tasks/comment.api';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

import TaskCommentsSkeleton from './TaskComments.skeleton';

export default function TaskComments({
  taskId,
  taskStatus,
  currentUserId,
  projectRole,
}) {
  const [content, setContent] = useState('');
  const bottomRef = useRef(null);

  const { data: response, isLoading, error } = useGetTaskCommentsQuery(taskId);
  const [createComment, { isLoading: isCreating }] =
    useCreateTaskCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] =
    useDeleteTaskCommentMutation();

  const comments = response?.data || [];

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments.length]);

  const isManager = projectRole === 'OWNER' || projectRole === 'ADMIN';

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!content.trim()) return;
    if (taskStatus === 'DONE') {
      toast.error('Cannot add comment to completed task');
      return;
    }

    try {
      await createComment({ taskId, content: content.trim() }).unwrap();
      setContent('');
    } catch (err) {
      toast.error(err.message || 'Failed to add comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment({ taskId, commentId }).unwrap();
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete comment');
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

  // Helper icons
  const SendIcon = DASHBOARD_ICONS.SEND || 'span';
  const ClockIcon = DASHBOARD_ICONS.CLOCK || 'span';
  const TrashIcon = DASHBOARD_ICONS.TRASH2 || 'span';
  const ChatIcon = DASHBOARD_ICONS.MESSAGESQUARE || 'span';
  const SpinnerIcon = DASHBOARD_ICONS.LOADER2 || 'span';

  if (error) {
    return (
      <div className="text-destructive bg-destructive/10 rounded-lg p-4 text-center text-sm">
        Failed to load discussion timeline.
      </div>
    );
  }

  return (
    <div className="flex h-105 flex-col gap-4 py-4">
      <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold tracking-tight">
        <ChatIcon className="text-muted-foreground h-4 w-4" />
        Activity & Discussion
      </h3>

      {/* Feed Area */}
      <div className="border-border/50 bg-muted/10 min-h-0 flex-1 rounded-xl border">
        <ScrollArea className="h-full p-4">
          {isLoading ? (
            <TaskCommentsSkeleton />
          ) : comments.length === 0 ? (
            <div className="flex h-50 flex-col items-center justify-center gap-2 text-center">
              <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full">
                <ChatIcon className="h-5 w-5" />
              </div>
              <p className="text-foreground text-sm font-medium">
                No comments yet
              </p>
              <p className="text-muted-foreground text-xs">
                Start the conversation or make progress on this task.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((comment) => {
                const isActivity = comment.type === 'ACTIVITY';
                const canDelete =
                  !isActivity &&
                  (comment.userId === currentUserId || isManager);

                if (isActivity) {
                  return (
                    <div
                      key={comment.id}
                      className="border-primary/30 text-muted-foreground my-0.5 flex items-center gap-2 border-l-2 py-1 pl-3 text-xs"
                    >
                      <ClockIcon className="text-muted-foreground/75 h-3.5 w-3.5 shrink-0" />
                      <span className="leading-relaxed">
                        <span className="text-foreground/80 font-medium">
                          {comment.userName || 'System'}
                        </span>{' '}
                        <span className="italic">{comment.content}</span>
                      </span>
                      <span className="text-muted-foreground/60 ml-auto shrink-0 text-[10px]">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={comment.id}
                    className="group flex items-start gap-3"
                  >
                    <Avatar className="border-border/60 h-8 w-8 shrink-0 border">
                      {comment.userAvatar && (
                        <AvatarImage src={comment.userAvatar} />
                      )}
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold uppercase">
                        {getInitials(comment.userName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="relative flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-foreground/90 truncate text-xs font-semibold">
                          {comment.userName || 'Unknown User'}
                        </span>
                        <span className="text-muted-foreground/70 text-[10px]">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      <div className="bg-muted/40 hover:bg-muted/60 text-foreground border-border/40 relative rounded-2xl rounded-tl-none border p-3 pr-8 text-sm shadow-sm transition-colors duration-200">
                        <p className="text-foreground/90 leading-relaxed wrap-break-word whitespace-pre-wrap">
                          {comment.content}
                        </p>

                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isDeleting}
                            onClick={() => handleDelete(comment.id)}
                            className="hover:text-destructive hover:bg-destructive/10 absolute top-2 right-2 h-6 w-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus:opacity-100"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input Area */}
      {taskStatus === 'DONE' ? (
        <div className="text-muted-foreground/30 bg-muted/10 flex h-12 items-center justify-center rounded-xl border-2 border-dashed text-xs">
          Task is completed
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment..."
              disabled={isCreating}
              maxLength={1000}
              className="bg-background border-border/70 focus-visible:ring-ring focus-visible:border-ring/80 max-h-20 min-h-12 resize-none rounded-xl py-3 pr-10 transition-all duration-200 focus-visible:ring-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            size="icon"
            disabled={!content.trim() || isCreating}
            className="h-10 w-10 shrink-0 rounded-xl transition-all duration-200"
          >
            {isCreating ? (
              <SpinnerIcon className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

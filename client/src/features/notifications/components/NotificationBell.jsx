import { formatDistanceToNow } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '@/features/notifications/notification.api';
import { useAuth } from '@/hooks/useAuth';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

export default function NotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user } = useAuth();
  const [socketConnected, setSocketConnected] = useState(false);

  // Monitor WebSocket status for dynamic polling control
  useEffect(() => {
    if (!user?.id) return;

    let activeSocket = null;
    let onConnect = null;
    let onDisconnect = null;

    import('@/lib/socket').then(({ getSocket }) => {
      const socket = getSocket(user.id);
      if (!socket) {
        setSocketConnected(false);
        return;
      }

      activeSocket = socket;
      setSocketConnected(socket.connected);

      onConnect = () => setSocketConnected(true);
      onDisconnect = () => setSocketConnected(false);

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
    });

    return () => {
      if (activeSocket) {
        if (onConnect) activeSocket.off('connect', onConnect);
        if (onDisconnect) activeSocket.off('disconnect', onDisconnect);
      }
    };
  }, [user]);

  // RTK Query API — Polls every 8 seconds if WebSocket is bypassed (Vercel) or disconnected
  const { data: response, isLoading } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: false,
    pollingInterval: socketConnected ? 0 : 8000,
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const [deleteNotif] = useDeleteNotificationMutation();

  const notifications = response?.data || [];
  const unreadCount = response?.unreadCount || 0;

  // Handle outside clicks
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Item click handler
  const handleItemClick = async (notif) => {
    if (!notif.isRead) {
      await markRead(notif.id).unwrap();
    }
    setIsOpen(false);

    // Resolve meta data
    let meta = notif.meta;
    if (typeof meta === 'string') {
      try {
        meta = JSON.parse(meta);
      } catch {
        meta = null;
      }
    }

    if (notif.type === 'MEMBER_REMOVED') {
      // Since they are removed, they can't access the project
      return;
    }

    if (meta?.projectId) {
      navigate(`/projects/${meta.projectId}`);
    } else if (meta?.taskId) {
      navigate('/tasks');
    }
  };

  // Delete notification handler
  const handleDeleteClick = async (e, notifId) => {
    e.stopPropagation(); // prevent navigating to project/task
    await deleteNotif(notifId).unwrap();
  };

  // Icon selector based on type
  const getIcon = (type, meta) => {
    let parsedMeta = meta;
    if (typeof meta === 'string') {
      try {
        parsedMeta = JSON.parse(meta);
      } catch {
        parsedMeta = null;
      }
    }

    switch (type) {
      case 'COMMENT_ADDED':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 dark:bg-blue-500/20">
            <DASHBOARD_ICONS.MESSAGESQUARE size={16} />
          </div>
        );
      case 'TASK_ASSIGNED':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20">
            <DASHBOARD_ICONS.USER2 size={16} />
          </div>
        );
      case 'TASK_STATUS_CHANGED':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
            <DASHBOARD_ICONS.LISTCHECKS size={16} />
          </div>
        );
      case 'TASK_VERIFIED':
        if (parsedMeta?.approved) {
          return (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
              <DASHBOARD_ICONS.CHECKCIRCLE size={16} />
            </div>
          );
        }
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
            <DASHBOARD_ICONS.ALERTTRIANGLE size={16} />
          </div>
        );
      case 'MEMBER_ADDED':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
            <DASHBOARD_ICONS.PLUS size={16} />
          </div>
        );
      case 'MEMBER_REMOVED':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
            <DASHBOARD_ICONS.TRASH2 size={16} />
          </div>
        );
      case 'MEMBER_ROLE_CHANGED':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
            <DASHBOARD_ICONS.SHIELD size={16} />
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-500/10 text-slate-500 dark:bg-slate-500/20">
            <DASHBOARD_ICONS.BELL size={16} />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="hover:bg-muted focus:ring-primary/20 relative flex h-9 w-9 items-center justify-center rounded-lg border border-transparent transition-all duration-200 focus:ring-2 focus:outline-none"
        aria-label="Toggle notifications panel"
      >
        {unreadCount > 0 ? (
          <>
            <DASHBOARD_ICONS.BELLRING className="text-foreground animate-wiggle h-5 w-5" />
            <span className="ring-background absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </>
        ) : (
          <DASHBOARD_ICONS.BELL className="text-foreground/70 hover:text-foreground h-5 w-5" />
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="border-border bg-background/95 animate-in fade-in slide-in-from-top-3 absolute right-0 z-50 mt-2.5 w-85 origin-top-right rounded-xl border p-0 shadow-lg ring-1 ring-black/5 backdrop-blur-xl duration-200 md:w-100">
          {/* Header */}
          <div className="border-border/60 flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-500">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllRead()}
                className="text-primary hover:text-primary/80 hover:bg-primary/5 flex h-7 items-center gap-1 px-2 text-xs font-semibold"
              >
                <DASHBOARD_ICONS.CHECKCHECK size={13} />
                Mark all read
              </Button>
            )}
          </div>

          {/* List Scroll Area */}
          <div className="divide-border/40 max-h-90 scrollbar-thin divide-y overflow-y-auto">
            {isLoading ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-10">
                <DASHBOARD_ICONS.LOADER2
                  className="text-primary animate-spin"
                  size={24}
                />
                <span className="text-xs">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="bg-muted/60 text-muted-foreground/60 mb-3 rounded-full p-3">
                  <DASHBOARD_ICONS.INBOX size={24} />
                </div>
                <h3 className="text-foreground/80 text-sm font-semibold">
                  All caught up!
                </h3>
                <p className="text-muted-foreground mt-1 max-w-50 text-xs">
                  You have no notifications in your feed right now.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`group relative flex cursor-pointer gap-3 p-4 transition-colors duration-150 ${
                    notif.isRead
                      ? 'hover:bg-muted/30 bg-background'
                      : 'bg-primary/2 hover:bg-primary/4'
                  }`}
                >
                  {/* Left Side Icon Indicator */}
                  <div className="mt-0.5 shrink-0">
                    {getIcon(notif.type, notif.meta)}
                  </div>

                  {/* Body Text */}
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex items-start justify-between gap-1.5">
                      <p
                        className={`text-foreground truncate text-xs ${!notif.isRead ? 'font-semibold' : 'font-medium'}`}
                      >
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="bg-primary mt-1 h-1.5 w-1.5 shrink-0 rounded-full" />
                      )}
                    </div>
                    {notif.body && (
                      <p className="text-muted-foreground mt-1.5 text-[11px] leading-relaxed font-normal wrap-break-word">
                        {notif.body}
                      </p>
                    )}
                    <span className="text-muted-foreground/80 mt-2 block text-[10px] font-normal">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* Delete Button on Hover */}
                  <button
                    onClick={(e) => handleDeleteClick(e, notif.id)}
                    className="text-muted-foreground/60 hover:text-destructive hover:bg-muted absolute top-3 right-3 rounded p-1 opacity-0 transition-all duration-150 group-hover:opacity-100"
                    title="Delete notification"
                    aria-label="Delete notification"
                  >
                    <DASHBOARD_ICONS.TRASH2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

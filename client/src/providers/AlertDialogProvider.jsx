import { createContext, useCallback, useRef, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const AlertDialogContext = createContext(null);

const DEFAULT_STATE = {
  isOpen: false,
  title: '',
  description: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'default',
  media: null,
  mediaClassName: '',
};

export const AlertDialogProvider = ({ children }) => {
  const [state, setState] = useState(DEFAULT_STATE);
  const resolveRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        isOpen: true,
        title: options.title || 'Are you sure?',
        description: options.description || '',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        variant: options.variant || 'default',
        media: options.media || null,
        mediaClassName: options.mediaClassName || '',
      });
    });
  }, []);

  const handleClose = useCallback((result) => {
    setState((prev) => ({ ...prev, isOpen: false }));
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
  }, []);

  const handleOpenChange = useCallback(
    (open) => {
      if (!open) {
        handleClose(false);
      }
    },
    [handleClose]
  );

  return (
    <AlertDialogContext.Provider value={confirm}>
      {children}
      <AlertDialog open={state.isOpen} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="border-border/50 bg-card/95 animate-in fade-in zoom-in-95 backdrop-blur-sm duration-200 sm:max-w-md">
          <AlertDialogHeader>
            {state.media && (
              <AlertDialogMedia className={state.mediaClassName}>
                {state.media}
              </AlertDialogMedia>
            )}
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            {state.description && (
              <AlertDialogDescription>
                {state.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 sm:flex sm:flex-row sm:justify-end">
            <AlertDialogCancel onClick={() => handleClose(false)}>
              {state.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleClose(true)}
              variant={state.variant}
            >
              {state.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
};

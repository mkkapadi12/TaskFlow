import { Provider } from 'react-redux';

import { store } from '@/app/store';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AlertDialogProvider } from './AlertDialogProvider';
import ThemeProvider from './ThemeProvider';

const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <TooltipProvider>
          <AlertDialogProvider>
            {children}
            <Toaster position="top-right" />
          </AlertDialogProvider>
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default AppProviders;

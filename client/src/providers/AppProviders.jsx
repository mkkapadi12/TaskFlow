import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { store } from "@/app/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeProvider from "./ThemeProvider";

const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <TooltipProvider>
          {children}
          <Toaster position="top-right" />
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default AppProviders;

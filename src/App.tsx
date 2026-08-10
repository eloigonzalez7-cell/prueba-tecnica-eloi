import { BrowserRouter } from "react-router-dom";
import { AppLoadingProvider } from "@/app/loading/AppLoadingContext";
import { AppRouter } from "@/app/router";

export function App() {
  return (
    <BrowserRouter>
      <AppLoadingProvider>
        <AppRouter />
      </AppLoadingProvider>
    </BrowserRouter>
  );
}

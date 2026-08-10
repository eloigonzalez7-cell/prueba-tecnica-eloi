import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type AppLoadingContextValue = {
  readonly isLoading: boolean;
  readonly setLoading: Dispatch<SetStateAction<boolean>>;
};

const AppLoadingContext = createContext<AppLoadingContextValue | null>(null);

export function AppLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false);

  return (
    <AppLoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </AppLoadingContext.Provider>
  );
}

export function useAppLoading(): AppLoadingContextValue {
  const context = useContext(AppLoadingContext);
  if (!context) {
    throw new Error("useAppLoading must be used within AppLoadingProvider");
  }
  return context;
}

/**
 * Keep the header loading cue in sync with a page-local loading flag.
 */
export function useSyncAppLoading(localLoading: boolean): void {
  const { setLoading } = useAppLoading();

  useEffect(() => {
    setLoading(localLoading);
  }, [localLoading, setLoading]);
}

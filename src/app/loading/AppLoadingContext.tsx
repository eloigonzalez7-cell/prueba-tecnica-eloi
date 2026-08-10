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
 * Always clear on unmount so aborted navigations cannot leave the spinner stuck.
 */
export function useSyncAppLoading(localLoading: boolean): void {
  const { setLoading } = useAppLoading();

  useEffect(() => {
    setLoading(localLoading);
    return () => {
      setLoading(false);
    };
  }, [localLoading, setLoading]);
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearPlatform,
  loadPlatform,
  savePlatform,
  type Platform,
} from "./types";

interface PlatformContextValue {
  platform: Platform | null;
  isMobile: boolean;
  setPlatform: (platform: Platform) => void;
  resetPlatform: () => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatformState] = useState<Platform | null>(() => loadPlatform());

  const setPlatform = useCallback((next: Platform) => {
    savePlatform(next);
    setPlatformState(next);
  }, []);

  const resetPlatform = useCallback(() => {
    clearPlatform();
    setPlatformState(null);
  }, []);

  const value = useMemo(
    () => ({
      platform,
      isMobile: platform === "android" || platform === "ios",
      setPlatform,
      resetPlatform,
    }),
    [platform, setPlatform, resetPlatform]
  );

  return (
    <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
  );
}

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error("usePlatform must be used within PlatformProvider");
  }
  return ctx;
}

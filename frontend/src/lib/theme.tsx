import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "system" | "light" | "dark";
export type ColorScheme = "light" | "dark";

const palettes = {
  light: {
    bg: "#F6F7FB",
    card: "#FFFFFF",
    text: "#1F2937",
    muted: "#6B7280",
    border: "#E5E7EB",
    blue: "#4285F4",
    red: "#EA4335",
    yellow: "#FBBC04",
    green: "#34A853",
  },
  dark: {
    bg: "#111827",
    card: "#1F2937",
    text: "#F9FAFB",
    muted: "#9CA3AF",
    border: "#374151",
    blue: "#4285F4",
    red: "#EA4335",
    yellow: "#FBBC04",
    green: "#34A853",
  },
};

export type Colors = (typeof palettes)["light"];

const STORAGE_KEY = "gdg:theme-mode";

type ThemeValue = {
  mode: ThemeMode;
  scheme: ColorScheme;
  colors: Colors;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === "light" || saved === "dark" || saved === "system") {
          setModeState(saved);
        }
      })
      .catch(() => {});
  }, []);

  function setMode(next: ThemeMode) {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }

  const value = useMemo<ThemeValue>(() => {
    const scheme: ColorScheme =
      mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

    function cycleMode() {
      setMode(mode === "system" ? "light" : mode === "light" ? "dark" : "system");
    }

    return { mode, scheme, colors: palettes[scheme], setMode, cycleMode };
  }, [mode, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return value;
}

export function useColors() {
  return useTheme().colors;
}

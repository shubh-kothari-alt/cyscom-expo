import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getExpoMode, setExpoMode as persistExpoMode } from "../utils/storage";
import { EXPO_TIMEOUT } from "../config/site";

const ExpoModeContext = createContext(null);

const ACTIVITY_EVENTS = ["pointerdown", "pointermove", "keydown", "touchstart", "wheel"];

export function ExpoModeProvider({ children }) {
  const [expoMode, setExpoModeState] = useState(getExpoMode);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const setExpoMode = useCallback((value) => {
    setExpoModeState(value);
    persistExpoMode(value);
  }, []);

  const toggleExpoMode = useCallback(() => {
    setExpoModeState((prev) => {
      const next = !prev;
      persistExpoMode(next);
      return next;
    });
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!expoMode) return;
    timerRef.current = setTimeout(() => {
      navigate("/");
    }, EXPO_TIMEOUT);
  }, [expoMode, navigate]);

  // Reset the inactivity timer whenever route changes or the visitor interacts.
  useEffect(() => {
    if (!expoMode) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    resetTimer();
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));
    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expoMode, location.pathname]);

  return (
    <ExpoModeContext.Provider value={{ expoMode, setExpoMode, toggleExpoMode }}>
      {children}
    </ExpoModeContext.Provider>
  );
}

export function useExpoMode() {
  const ctx = useContext(ExpoModeContext);
  if (!ctx) throw new Error("useExpoMode must be used within ExpoModeProvider");
  return ctx;
}

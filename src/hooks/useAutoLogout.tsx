import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook to automatically logout the user after a period of inactivity.
 * Listens for common user interaction events and resets a timer.
 * When the timer elapses the user is logged out, storage cleared, and redirected to login.
 *
 * @param timeoutMs inactivity timeout in milliseconds (default: 30 minutes)
 */
export function useAutoLogout(timeoutMs: number = 30 * 60 * 1000) {
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const logout = () => {
      if (!mounted) return;

      try {
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();

        // Navigate to login
        navigate("/login", { replace: true });

        // Dispatch storage event for other tabs
        try {
          window.dispatchEvent(new Event("storage"));
        } catch (e) {
        }
      } catch (e) {
        // Force redirect as fallback
        window.location.href = "/login";
      }
    };

    const resetTimer = () => {
      if (!mounted) return;

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      // Only schedule logout if a token exists
      const hasToken = localStorage.getItem("adminToken");
      if (hasToken) {
        timerRef.current = window.setTimeout(() => {
          logout();
        }, timeoutMs) as unknown as number;
      }
    };

    const visibilityHandler = () => {
      // When user comes back to the tab, reset the timer
      if (!document.hidden) resetTimer();
    };

    const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));
    document.addEventListener("visibilitychange", visibilityHandler);

    // Respond to storage changes (login/logout in another tab)
    const storageHandler = (e: StorageEvent) => {
      if (e.key === "adminToken") {
        resetTimer();
      }
    };
    window.addEventListener("storage", storageHandler);

    // Initialize
    resetTimer();

    return () => {
      mounted = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetTimer));
      document.removeEventListener("visibilitychange", visibilityHandler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [navigate, timeoutMs]);
}

export default useAutoLogout;

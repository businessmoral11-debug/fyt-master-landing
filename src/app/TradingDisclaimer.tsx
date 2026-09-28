import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** New key so a prior test dismiss doesn't keep the bar hidden after this fix. */
const DISCLAIMER_STORAGE_KEY = "fyt_disclaimer_dismissed_v2";
const FAQ_HREF = "https://intercom.help/funding-your-trades/en/";

const DISCLAIMER_COPY = (
  <>
    Clients are assigned demo accounts with simulated funds for trading purposes. All trading activity is
    carried out in a simulated environment.{" "}
    <a href={FAQ_HREF} style={{ color: "#fff", textDecoration: "underline" }}>
      Full details here at FAQ section.
    </a>
  </>
);

function useDisclaimerVisible() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    // This React app is the home landing surface — always eligible.
    // FAQ / Terms WP pages use their own snippet; hide only after dismiss.
    setVisible(localStorage.getItem(DISCLAIMER_STORAGE_KEY) !== "true");
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  function dismiss() {
    localStorage.setItem(DISCLAIMER_STORAGE_KEY, "true");
    setVisible(false);
  }

  return { mounted, visible, dismiss };
}

/** Desktop: sticky top strip (above promo / nav). */
export function DesktopTopDisclaimer() {
  const { mounted, visible, dismiss } = useDisclaimerVisible();
  if (!mounted || !visible) return null;

  return (
    <div
      id="noyona_desktop_top_disclaimer"
      className="hidden lg:flex"
      role="note"
      aria-label="Trading disclaimer"
      style={{
        background: "#000",
        color: "#fff",
        fontSize: 12,
        textAlign: "center",
        padding: "10px 16px",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1.45,
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <span style={{ flex: 1, maxWidth: 920, textAlign: "center" }}>{DISCLAIMER_COPY}</span>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss disclaimer"
        style={{
          cursor: "pointer",
          marginLeft: 12,
          fontSize: 16,
          fontWeight: "bold",
          padding: "0 6px",
          background: "transparent",
          border: 0,
          color: "#fff",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Mobile: fixed bottom disclaimer.
 * Uses CSS (lg:hidden) so it always shows on phone widths — no UA / JS width race.
 */
export function MobileBottomDisclaimer() {
  const { mounted, visible, dismiss } = useDisclaimerVisible();
  const [hiddenByScroll, setHiddenByScroll] = useState(false);

  useEffect(() => {
    if (!visible) return;

    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const onScrollFrame = () => {
      const currentY = window.pageYOffset;
      if (currentY > lastScrollY && currentY > 30) {
        setHiddenByScroll(true);
      } else {
        setHiddenByScroll(false);
      }
      lastScrollY = currentY <= 0 ? 0 : currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(onScrollFrame);
      ticking = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      id="noyona_mobile_bottom_disclaimer"
      className="noyona_mobile_bottom_disclaimer flex lg:hidden"
      role="dialog"
      aria-label="Trading disclaimer"
      style={{
        background: "#000",
        color: "#fff",
        fontSize: 10,
        textAlign: "center",
        padding: "12px 5px",
        paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2147483001,
        alignItems: "center",
        justifyContent: "flex-start",
        lineHeight: 1.4,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
        transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
        transform: hiddenByScroll ? "translateY(100%)" : "translateY(0)",
        opacity: hiddenByScroll ? 0 : 1,
        pointerEvents: hiddenByScroll ? "none" : "auto",
      }}
    >
      <button
        type="button"
        id="noyona_close_btn"
        onClick={dismiss}
        aria-label="Dismiss disclaimer"
        style={{
          cursor: "pointer",
          marginRight: 10,
          fontSize: 16,
          fontWeight: "bold",
          padding: "0 5px",
          background: "transparent",
          border: 0,
          color: "#fff",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
      <span style={{ flex: 1, maxWidth: "85%", textAlign: "left" }}>{DISCLAIMER_COPY}</span>
    </div>,
    document.body,
  );
}

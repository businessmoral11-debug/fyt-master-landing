/** Which alternative hero layout to preview (?hero=e|f|g|h). Kept tiny so App.tsx can read it without loading the layouts. */
export type HeroVariant = "e" | "f" | "g" | "h";

export function getHeroVariant(): HeroVariant | null {
  if (typeof window === "undefined") return null;
  try {
    const v = new URLSearchParams(window.location.search).get("hero")?.toLowerCase();
    return v === "e" || v === "f" || v === "g" || v === "h" ? v : null;
  } catch {
    return null;
  }
}

/** Which alternative trader-video block to preview inside the live hero (?video=d|g). */
export type VideoAlt = "d" | "g";

export function getVideoAlt(): VideoAlt | null {
  if (typeof window === "undefined") return null;
  try {
    const v = new URLSearchParams(window.location.search).get("video")?.toLowerCase();
    return v === "d" || v === "g" ? v : null;
  } catch {
    return null;
  }
}

import Autoplay from "embla-carousel-autoplay";
import type { EmblaPluginType } from "embla-carousel";

export function buildAutoplayPlugins(
  prefersReducedMotion: boolean | null | undefined,
  { delay = 4000, stopOnInteraction }: { delay?: number; stopOnInteraction?: boolean } = {},
): EmblaPluginType[] {
  if (prefersReducedMotion) return [];
  const autoplayOptions: { delay: number; stopOnInteraction?: boolean } = { delay };
  if (stopOnInteraction !== undefined) {
    autoplayOptions.stopOnInteraction = stopOnInteraction;
  }
  return [Autoplay(autoplayOptions)];
}

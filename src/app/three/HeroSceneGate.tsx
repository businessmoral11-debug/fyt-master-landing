import { useEffect, useState, lazy, Suspense } from "react";

const HeroScene = lazy(() => import("./HeroScene"));

function canRender3D(): boolean {
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function HeroCssStarfield() {
  return (
    <div className="hero-css-starfield" aria-hidden="true">
      <div className="hero-css-starfield-layer-1" />
      <div className="hero-css-starfield-layer-2" />
      <div className="hero-css-starfield-layer-3" />
    </div>
  );
}

export function HeroSceneGate() {
  const [enabled, setEnabled] = useState(canRender3D);

  useEffect(() => {
    const queries = [
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(pointer: fine)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
    const update = () => setEnabled(canRender3D());
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  if (!enabled) return <HeroCssStarfield />;
  return (
    <Suspense fallback={<HeroCssStarfield />}>
      <HeroScene />
    </Suspense>
  );
}

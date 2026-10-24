import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TESTIMONIAL_VIDEOS, type TestimonialVideo } from "@/app/data/testimonials";
import { testimonialVideoSource } from "@/app/motion/videoLightbox";

const VideoLightbox = lazy(() => import("@/app/BelowFold").then((m) => ({ default: m.VideoLightbox })));

/* ------------------------------------------------------------------ */
/* Hero video wall: trader videos replace the radar.                   */
/* One big featured video + the next 4 in the deck. The deck is        */
/* shuffled on every visit and re-shuffled after a full round, so the  */
/* order is never the same twice. Clicking plays the video full size.  */
/* ------------------------------------------------------------------ */

const ROTATE_MS = 6500;
const THUMBS = 4;

function shuffled(n: number, avoidFirst = -1): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (n > 1 && a[0] === avoidFirst) [a[0], a[1]] = [a[1], a[0]];
  return a;
}

function PlayIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M8 5.2v13.6a1 1 0 0 0 1.52.85l11-6.8a1 1 0 0 0 0-1.7l-11-6.8A1 1 0 0 0 8 5.2Z" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  );
}

export function HeroVideoProof() {
  const videos = TESTIMONIAL_VIDEOS;
  const n = videos.length;
  const reduce = useReducedMotion();
  const [order, setOrder] = useState<number[]>(() => shuffled(n));
  const [pos, setPos] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState<TestimonialVideo | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((e) => setVisible(!!e[0]?.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = auto && visible && !hover && !open && !reduce && n > 1;

  const next = useCallback(() => {
    setPos((p) => {
      if (p + 1 < n) return p + 1;
      setOrder((o) => shuffled(n, o[o.length - 1]));
      return 0;
    });
  }, [n]);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(next, ROTATE_MS);
    return () => window.clearTimeout(t);
  }, [running, pos, order, next]);

  const current = videos[order[pos]];
  const thumbs = Array.from({ length: THUMBS }, (_, i) => {
    const at = (pos + 1 + i) % n;
    return { at, video: videos[order[at]] };
  });
  const closeVideo = useCallback(() => setOpen(null), []);

  return (
    <div ref={rootRef} className="relative w-full min-w-0" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="pointer-events-none absolute -inset-[6%] -z-10 rounded-[40px]" style={{ background: "radial-gradient(60% 55% at 50% 45%, rgba(37,99,235,0.35), transparent 70%)" }} aria-hidden="true" />
      <div className="rounded-[26px] p-[8px] sm:p-[10px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))", border: "1px solid rgba(148,178,255,0.22)", boxShadow: "0 50px 100px -50px rgba(37,99,235,0.7)", backdropFilter: "blur(8px)" }}>
        <button
          type="button"
          onClick={() => setOpen(current)}
          aria-label={`Play video: ${current.name}`}
          className="group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[18px] border-0 bg-[#070d1c] p-0 text-left sm:aspect-video"
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={current.videoUrl}
              src={current.posterUrl}
              alt=""
              decoding="async"
              fetchPriority="high"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 size-full object-cover"
            />
          </AnimatePresence>
          <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(3,6,13,0.25) 0%, rgba(3,6,13,0) 30%, rgba(3,6,13,0.85) 100%)" }} />
          <span className="absolute left-[12px] top-[12px] flex items-center gap-[7px] rounded-full px-[11px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.14em] text-white" style={{ background: "rgba(239,68,68,0.9)", boxShadow: "0 8px 20px -8px rgba(239,68,68,0.9)" }}>
            <span className="size-[6px] rounded-full bg-white" /> Real trader
          </span>
          <span className="absolute left-1/2 top-1/2 flex size-[64px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 sm:size-[76px]" style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.45)", backdropFilter: "blur(10px)", boxShadow: "0 18px 40px -12px rgba(0,0,0,0.6)" }}>
            <span className="ml-[3px]">
              <PlayIcon size={26} />
            </span>
          </span>
          <span className="absolute inset-x-[16px] bottom-[14px] flex flex-col gap-[3px]">
            <span className="text-[17px] font-semibold text-white sm:text-[19px]">{current.name}</span>
            <span className="line-clamp-1 text-[12.5px] text-[#c7d2ea]">Funded trader · tap to watch</span>
          </span>
          {running && <span key={`${pos}-${order[0]}`} aria-hidden="true" className="fyt-hv-progress absolute inset-x-0 bottom-0 h-[3px] origin-left" style={{ background: "linear-gradient(90deg,#3b82f6,#93c5fd)" }} />}
        </button>

        <div className="mt-[8px] grid grid-cols-4 gap-[8px] sm:mt-[10px] sm:gap-[10px]">
          {thumbs.map(({ at, video }) => (
            <button
              key={`${video.videoUrl}-${at}`}
              type="button"
              onClick={() => {
                setAuto(false);
                setPos(at);
              }}
              aria-label={`Show video: ${video.name}`}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[12px] border-0 bg-[#070d1c] p-0 transition-transform duration-300 hover:-translate-y-[2px]"
              style={{ border: "1px solid rgba(148,178,255,0.2)" }}
            >
              <img src={video.posterUrl} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(3,6,13,0) 45%, rgba(3,6,13,0.85))" }} />
              <span className="absolute inset-x-[7px] bottom-[5px] truncate text-left text-[11px] font-semibold text-white sm:text-[12px]">{video.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[12px] flex items-center justify-between gap-[10px] px-[4px] text-[12px] text-[#9fb0d4]">
        <span className="tabular">
          {pos + 1} / {n} · different order every visit
        </span>
        <button
          type="button"
          onClick={() => {
            setOrder((o) => shuffled(n, o[pos]));
            setPos(0);
          }}
          className="inline-flex cursor-pointer items-center gap-[6px] rounded-full border-0 px-[12px] py-[6px] text-[12px] font-semibold text-[#dbe7ff]"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)" }}
        >
          <ShuffleIcon /> Shuffle
        </button>
      </div>

      <Suspense fallback={null}>{open && <VideoLightbox source={testimonialVideoSource(open)} onClose={closeVideo} />}</Suspense>
    </div>
  );
}

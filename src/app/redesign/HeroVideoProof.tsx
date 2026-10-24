import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TESTIMONIAL_VIDEOS, type TestimonialVideo } from "@/app/data/testimonials";
import { testimonialVideoSource } from "@/app/motion/videoLightbox";
import { countryFlagUrl } from "@/app/api/rewardsApi";
import { REGION_NAME, countryPlain, detectVisitor, lookupIpCountry, regionOf, type RegionId } from "@/app/data/visitorGeo";

const VideoLightbox = lazy(() => import("@/app/BelowFold").then((m) => ({ default: m.VideoLightbox })));

/* ------------------------------------------------------------------ */
/* Hero video wall: trader videos replace the radar.                   */
/* The visitor's country decides the order: traders from their own     */
/* country first, then their region, then everyone else. Inside each   */
/* group the order is shuffled on every visit.                         */
/* ------------------------------------------------------------------ */

const ROTATE_MS = 6500;
const THUMBS = 4;

/** Country of each trader video (read from the video posters). */
const VIDEO_COUNTRY: Record<string, string> = {
  Devon: "ZA",
  Waqas: "PK",
  "Taufiq Sayed": "IN",
  Damien: "ZA",
  Kush: "IN",
  Nicolas: "US",
  Edmund: "MY",
  Nadir: "PK",
  Katherine: "ZA",
  Rohit: "IN",
  Abigail: "US",
  Shubham: "IN",
  Bharath: "IN",
  Emad: "SA",
  Gabriel: "DE",
  Ibrahim: "KE",
  Anisha: "IN",
  Charls: "BH",
  Dylan: "NZ",
};

type Visitor = { code: string | null; region: RegionId | null };

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(videos: TestimonialVideo[], v: Visitor): { order: number[]; scope: string } {
  const all = videos.map((_, i) => i);
  const cc = (i: number) => VIDEO_COUNTRY[videos[i].name];
  const sameCountry = v.code ? all.filter((i) => cc(i) === v.code) : [];
  const sameRegion = v.region ? all.filter((i) => !sameCountry.includes(i) && regionOf(cc(i)) === v.region) : [];
  const rest = all.filter((i) => !sameCountry.includes(i) && !sameRegion.includes(i));
  const scope = sameCountry.length && v.code ? `from ${countryPlain(v.code)}` : sameRegion.length && v.region ? `from ${REGION_NAME[v.region]}` : "worldwide";
  return { order: [...shuffle(sameCountry), ...shuffle(sameRegion), ...shuffle(rest)], scope };
}

function PlayIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.2v13.6a1 1 0 0 0 1.52.85l11-6.8a1 1 0 0 0 0-1.7l-11-6.8A1 1 0 0 0 8 5.2Z" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  );
}

function Flag({ code, w = 20 }: { code: string | undefined; w?: number }) {
  const url = code ? countryFlagUrl(code) : null;
  if (!url) return null;
  return <img src={url} alt="" width={w} height={Math.round(w * 0.7)} className="shrink-0 rounded-[3px] object-cover" style={{ width: w, height: Math.round(w * 0.7) }} />;
}

export function HeroVideoProof() {
  const videos = TESTIMONIAL_VIDEOS;
  const n = videos.length;
  const reduce = useReducedMotion();
  const visitorRef = useRef<Visitor>({ code: null, region: null });
  const [deck, setDeck] = useState<{ order: number[]; scope: string }>(() => {
    visitorRef.current = detectVisitor();
    return buildDeck(videos, visitorRef.current);
  });
  const [pos, setPos] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState<TestimonialVideo | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  // The time zone is only a first guess (a VPN or travel changes the IP, not the clock): refine from the IP.
  useEffect(() => {
    const manual = /^[a-z]{2}$/i.test(new URLSearchParams(window.location.search).get("country") ?? "");
    if (manual) return;
    let cancelled = false;
    lookupIpCountry().then((cc) => {
      if (cancelled || !cc || touched.current || cc === visitorRef.current.code) return;
      visitorRef.current = { code: cc, region: regionOf(cc) ?? visitorRef.current.region };
      setDeck(buildDeck(videos, visitorRef.current));
      setPos(0);
    });
    return () => {
      cancelled = true;
    };
  }, [videos]);

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
      setDeck(buildDeck(videos, visitorRef.current));
      return 0;
    });
  }, [n, videos]);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(next, ROTATE_MS);
    return () => window.clearTimeout(t);
  }, [running, pos, deck, next]);

  const current = videos[deck.order[pos]];
  const currentCountry = VIDEO_COUNTRY[current.name];
  const thumbs = Array.from({ length: THUMBS }, (_, i) => {
    const at = (pos + 1 + i) % n;
    return { at, video: videos[deck.order[at]] };
  });
  const closeVideo = useCallback(() => setOpen(null), []);

  return (
    <div ref={rootRef} className="relative w-full min-w-0" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="pointer-events-none absolute -inset-[6%] -z-10 rounded-[44px]" style={{ background: "radial-gradient(60% 55% at 50% 45%, rgba(37,99,235,0.3), transparent 70%)" }} aria-hidden="true" />

      {/* Header line: who you are seeing */}
      <div className="mb-[12px] flex items-center justify-between gap-[12px] px-[2px]">
        <span className="flex min-w-0 items-center gap-[8px] text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9fb4de]">
          <span className="relative flex size-[7px] shrink-0">
            <span className="fyt-rd-ping-gated absolute inset-0 rounded-full bg-[#22c55e]" />
            <span className="relative size-[7px] rounded-full bg-[#22c55e]" />
          </span>
          <span className="truncate">Funded traders {deck.scope}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            touched.current = true;
            setDeck(buildDeck(videos, visitorRef.current));
            setPos(0);
          }}
          className="inline-flex shrink-0 cursor-pointer items-center gap-[6px] rounded-full border-0 px-[11px] py-[6px] text-[11.5px] font-semibold text-[#c9d8f5] transition-colors hover:text-white"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <ShuffleIcon /> Shuffle
        </button>
      </div>

      <div className="rounded-[24px] p-[7px] sm:p-[9px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))", border: "1px solid rgba(148,178,255,0.2)", boxShadow: "0 50px 100px -50px rgba(37,99,235,0.65)" }}>
        <button
          type="button"
          onClick={() => setOpen(current)}
          aria-label={`Play video: ${current.name}`}
          className="group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[17px] border-0 bg-[#070d1c] p-0 text-left sm:aspect-video"
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={current.videoUrl}
              src={current.posterUrl}
              alt=""
              decoding="async"
              fetchPriority="high"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 size-full object-cover"
            />
          </AnimatePresence>
          <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(3,6,13,0.18) 0%, rgba(3,6,13,0) 28%, rgba(3,6,13,0.78) 100%)" }} />

          {/* Country chip */}
          <span className="absolute left-[12px] top-[12px] flex items-center gap-[8px] rounded-full py-[5px] pl-[7px] pr-[12px] text-[11.5px] font-semibold text-white" style={{ background: "rgba(8,14,32,0.62)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
            <Flag code={currentCountry} w={18} />
            {currentCountry ? countryPlain(currentCountry) : "Funded trader"}
          </span>

          {/* Play */}
          <span className="absolute left-1/2 top-1/2 flex size-[62px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[#0b1530] transition-transform duration-300 group-hover:scale-105 sm:size-[72px]" style={{ background: "rgba(255,255,255,0.96)", boxShadow: "0 0 0 8px rgba(255,255,255,0.16), 0 20px 44px -12px rgba(0,0,0,0.65)" }}>
            <span className="ml-[3px]">
              <PlayIcon size={24} />
            </span>
          </span>

          {/* Name + action */}
          <span className="absolute inset-x-[16px] bottom-[14px] flex items-end justify-between gap-[12px]">
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className="truncate text-[18px] font-semibold leading-tight text-white sm:text-[21px]">{current.name}</span>
              <span className="text-[12.5px] text-[#c3d1ee]">Funded trader · payout story</span>
            </span>
            <span className="hidden shrink-0 items-center gap-[7px] rounded-full px-[14px] py-[8px] text-[12.5px] font-semibold text-white sm:flex" style={{ background: "rgba(37,99,235,0.85)", border: "1px solid rgba(147,197,253,0.5)" }}>
              Watch
              <PlayIcon size={11} />
            </span>
          </span>
          {running && <span key={`${pos}-${deck.order[0]}`} aria-hidden="true" className="fyt-hv-progress absolute inset-x-0 bottom-0 h-[3px] origin-left" style={{ background: "linear-gradient(90deg,#3b82f6,#93c5fd)" }} />}
        </button>

        <div className="mt-[7px] grid grid-cols-4 gap-[7px] sm:mt-[9px] sm:gap-[9px]">
          {thumbs.map(({ at, video }) => (
            <button
              key={`${video.videoUrl}-${at}`}
              type="button"
              onClick={() => {
                touched.current = true;
                setAuto(false);
                setPos(at);
              }}
              aria-label={`Show video: ${video.name}`}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[11px] border-0 bg-[#070d1c] p-0 transition-transform duration-300 hover:-translate-y-[2px]"
              style={{ border: "1px solid rgba(148,178,255,0.18)" }}
            >
              <img src={video.posterUrl} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(3,6,13,0) 40%, rgba(3,6,13,0.88))" }} />
              <span className="absolute inset-x-[7px] bottom-[5px] flex items-center gap-[5px]">
                <Flag code={VIDEO_COUNTRY[video.name]} w={13} />
                <span className="truncate text-[11px] font-semibold text-white sm:text-[11.5px]">{video.name}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <Suspense fallback={null}>{open && <VideoLightbox source={testimonialVideoSource(open)} onClose={closeVideo} />}</Suspense>
    </div>
  );
}

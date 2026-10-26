import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import type { TestimonialVideo } from "@/app/data/testimonials";
import { countryPlain } from "@/app/data/visitorGeo";
import { HeroLightbox, PlayIcon, VIDEO_COUNTRY, useHeroDeck } from "./HeroVideoProof";
import type { VideoAlt } from "./heroVariant";

/* ------------------------------------------------------------------ */
/* Two calmer takes on the hero trader videos (?video=d or ?video=g):   */
/*  d: a stack of story cards you swipe through                         */
/*  g: one story plus swipeable chips with each trader's payout        */
/* The poster is always shown whole: it already carries the trader's   */
/* name, country and payout, so nothing is printed over it.            */
/* ------------------------------------------------------------------ */

type Deck = ReturnType<typeof useHeroDeck>;

/** Payout amounts as printed on the video posters. Traders not listed show their country instead. */
const PAYOUT: Record<string, string> = {
  Shubham: "$1,009",
  Rohit: "$2,271",
  "Taufiq Sayed": "$1,215",
  Kush: "$709",
  Anisha: "$2,200+",
};

const MUTED = "#8d9bbb";
const CARD_SHADOW = "0 0 0 1px rgba(255,255,255,0.09), 0 40px 80px -40px rgba(37,99,235,0.7)";
const CARD_SHAPE = "aspect-[16/10] w-full overflow-hidden rounded-[20px] sm:aspect-video lg:rounded-[24px]";

function firstName(name: string) {
  return name.split(" ")[0];
}

function scopeLabel(scope: string) {
  return scope.startsWith("from ") ? scope.slice(5) : "Worldwide";
}

function Arrow({ dir = "right" }: { dir?: "left" | "right" }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WatchPill() {
  return (
    <span
      className="pointer-events-none absolute bottom-[12px] left-[12px] flex items-center gap-[8px] rounded-full py-[6px] pl-[6px] pr-[14px] text-[12px] font-medium text-white sm:bottom-[16px] sm:left-[16px] sm:text-[13px]"
      style={{ background: "rgba(6,10,24,0.55)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
    >
      <span className="flex size-[24px] items-center justify-center rounded-full bg-white text-[#0b1530] sm:size-[26px]">
        <span className="ml-[2px]">
          <PlayIcon size={11} />
        </span>
      </span>
      Watch story
    </span>
  );
}

/** Small round face, cut from the left side of the poster where the trader sits. */
function Face({ video, size }: { video: TestimonialVideo; size: number }) {
  return (
    <span className="relative block shrink-0 overflow-hidden rounded-full bg-[#0a1124]" style={{ width: size, height: size, boxShadow: "0 0 0 1px rgba(255,255,255,0.18)" }}>
      <img src={video.posterUrl} alt="" loading="lazy" decoding="async" draggable={false} className="absolute max-w-none" style={{ height: size * 1.6, left: -size * 0.19, top: -size * 0.2 }} />
    </span>
  );
}

function Header({ d }: { d: Deck }) {
  return (
    <div className="mb-[14px] flex items-center justify-between gap-[12px] px-[2px]">
      <span className="flex min-w-0 items-center gap-[9px] text-[10.5px] font-medium uppercase tracking-[0.22em] sm:text-[11.5px]" style={{ color: MUTED }}>
        <span className="size-[6px] shrink-0 rounded-full bg-[#22c55e]" />
        <span className="truncate">
          Funded traders <span className="text-white/40">·</span> <span className="text-white">{scopeLabel(d.scope)}</span>
        </span>
      </span>
      <span className="shrink-0 text-[11px] font-light tabular-nums tracking-[0.1em]" style={{ color: MUTED }}>
        {String(d.pos + 1).padStart(2, "0")} / {String(d.n).padStart(2, "0")}
      </span>
    </div>
  );
}

/** The current story card: tap to play, swipe sideways for the next or previous trader. */
function SwipeCard({ d, onStep, dir, style }: { d: Deck; onStep: (step: number) => void; dir: number; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  const dragged = useRef(false);
  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 450) onStep(info.offset.x < 0 ? 1 : -1);
    window.setTimeout(() => {
      dragged.current = false;
    }, 0);
  };
  return (
    <AnimatePresence initial={false} custom={dir} mode="popLayout">
      <motion.button
        key={`${d.current.videoUrl}-${d.pos}`}
        type="button"
        custom={dir}
        variants={{
          enter: { opacity: 0, scale: 0.95, y: -10 },
          center: { opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 },
          exit: (c: number) => ({ opacity: 0, x: c > 0 ? -240 : 240, rotate: c > 0 ? -5 : 5 }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: reduce ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.55}
        onDragStart={() => {
          dragged.current = true;
        }}
        onDragEnd={onDragEnd}
        onClick={() => {
          if (!dragged.current) d.setOpen(d.current);
        }}
        aria-label={`Play video: ${d.current.name}`}
        className={`relative z-10 block cursor-pointer touch-pan-y border-0 bg-[#0a1124] p-0 text-left ${CARD_SHAPE}`}
        style={{ boxShadow: CARD_SHADOW, ...style }}
      >
        <img src={d.current.posterUrl} alt="" decoding="async" fetchPriority="high" draggable={false} className="pointer-events-none absolute inset-0 size-full object-cover" />
        <WatchPill />
      </motion.button>
    </AnimatePresence>
  );
}

function useStepper(d: Deck) {
  const [dir, setDir] = useState(1);
  const timer = useRef(0);
  const step = (s: number) => {
    setDir(s);
    d.go(d.pos + s);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDir(1), 700);
  };
  return { dir, step };
}

function NavButtons({ step }: { step: (s: number) => void }) {
  const btn = "flex size-[34px] cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#c7d3ee] transition-colors duration-300 hover:bg-white/10 hover:text-white";
  const ring = { boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)" };
  return (
    <div className="flex shrink-0 gap-[6px]">
      <button type="button" aria-label="Previous trader" onClick={() => step(-1)} className={btn} style={ring}>
        <Arrow dir="left" />
      </button>
      <button type="button" aria-label="Next trader" onClick={() => step(1)} className={btn} style={ring}>
        <Arrow />
      </button>
    </div>
  );
}

/* ------------------------------ D: card stack ------------------------------ */

function StackView({ d }: { d: Deck }) {
  const { dir, step } = useStepper(d);
  const code = VIDEO_COUNTRY[d.current.name];
  return (
    <>
      <div className="relative pt-[22px] sm:pt-[26px]">
        {[2, 1].map((k) => {
          const v = d.video(d.pos + k);
          return (
            <div
              key={`${k}-${v.videoUrl}`}
              aria-hidden="true"
              className={`absolute inset-x-0 ${CARD_SHAPE}`}
              style={{ top: k === 2 ? 0 : 11, transform: `scale(${1 - k * 0.05})`, transformOrigin: "50% 0%", opacity: k === 1 ? 0.55 : 0.28, boxShadow: "0 0 0 1px rgba(255,255,255,0.1)" }}
            >
              <img src={v.posterUrl} alt="" loading="lazy" decoding="async" className="size-full object-cover" style={{ filter: "blur(1px) brightness(0.8)" }} />
            </div>
          );
        })}
        <SwipeCard d={d} onStep={step} dir={dir} />
      </div>
      <div className="mt-[16px] flex items-center justify-between gap-[12px] px-[2px]">
        <span className="min-w-0 truncate text-[13.5px] font-light sm:text-[14.5px]" style={{ color: MUTED }}>
          <span className="font-normal text-white">{d.current.name}</span>
          {code ? ` · ${countryPlain(code)}` : ""}
          {PAYOUT[d.current.name] && <span className="text-[#7ee2a8]">{` · ${PAYOUT[d.current.name]} payout`}</span>}
        </span>
        <NavButtons step={step} />
      </div>
      <p className="mt-[10px] text-center text-[11.5px] font-light sm:hidden" style={{ color: MUTED }}>
        Swipe the card for the next trader
      </p>
    </>
  );
}

/* ------------------------------ G: payout chips ------------------------------ */

function ChipsView({ d }: { d: Deck }) {
  const { dir, step } = useStepper(d);
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = rowRef.current;
    const el = row?.querySelector<HTMLElement>(`[data-at="${d.pos}"]`);
    if (!row || !el) return;
    row.scrollTo({ left: el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [d.pos]);
  return (
    <>
      <SwipeCard d={d} onStep={step} dir={dir} />
      <div
        ref={rowRef}
        className="relative -mx-[20px] mt-[14px] flex gap-[8px] overflow-x-auto px-[20px] pb-[2px] [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: d.n }, (_, at) => {
          const v = d.video(at);
          const on = at === d.pos;
          const amount = PAYOUT[v.name];
          const code = VIDEO_COUNTRY[v.name];
          return (
            <button
              key={`${v.videoUrl}-${at}`}
              type="button"
              data-at={at}
              onClick={() => d.go(at)}
              aria-label={`Show ${v.name}`}
              className="flex shrink-0 cursor-pointer items-center gap-[10px] rounded-full border-0 py-[6px] pl-[6px] pr-[16px] text-left transition-[background,box-shadow] duration-300"
              style={{
                background: on ? "rgba(80,120,255,0.14)" : "rgba(255,255,255,0.04)",
                boxShadow: on ? "inset 0 0 0 1.5px #6f95ff" : "inset 0 0 0 1px rgba(255,255,255,0.1)",
              }}
            >
              <Face video={v} size={34} />
              <span className="flex flex-col leading-[1.25]">
                <span className="whitespace-nowrap text-[13px] font-medium text-white">{firstName(v.name)}</span>
                <span className="whitespace-nowrap text-[11.5px] font-normal" style={{ color: amount ? "#7ee2a8" : MUTED }}>
                  {amount ? `${amount} payout` : code ? countryPlain(code) : "Funded trader"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------ block ------------------------------ */

export default function HeroVideoAlt({ variant }: { variant: VideoAlt }) {
  const d = useHeroDeck();
  return (
    <div ref={d.rootRef} className="relative w-full min-w-0" onMouseEnter={() => d.setHover(true)} onMouseLeave={() => d.setHover(false)}>
      <div className="pointer-events-none absolute -inset-[6%] -z-10" style={{ background: "radial-gradient(60% 55% at 50% 50%, rgba(37,99,235,0.22), transparent 70%)" }} aria-hidden="true" />
      <Header d={d} />
      {variant === "d" ? <StackView d={d} /> : <ChipsView d={d} />}
      <HeroLightbox video={d.open} onClose={d.closeVideo} />
    </div>
  );
}

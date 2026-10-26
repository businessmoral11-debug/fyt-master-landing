import "@fontsource/dm-sans/200.css";
import "@fontsource/dm-sans/300.css";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { countryFlagUrl } from "@/app/api/rewardsApi";
import { countryPlain } from "@/app/data/visitorGeo";
import { HALLOWEEN_CODE, HALLOWEEN_END, isHalloweenLive } from "@/app/data/halloween";
import { PROMO_CODE, PROMO_DEADLINE, PROMO_DEAL_SHORT } from "@/app/data/promoBanner";
import { pauseHeavyScenesForNav } from "@/app/three/scenePause";
import type { HeroVariant } from "./heroVariant";
import { HeroLightbox, PlayIcon, useHeroDeck } from "./HeroVideoProof";

export type { HeroVariant };

/* ------------------------------------------------------------------ */
/* Alternative hero layouts, shown only with ?hero=e | f | g | h.       */
/* One quiet design system for all four: light type, one blue, the     */
/* trader posters shown whole (never cropped), nothing that blinks.    */
/* ------------------------------------------------------------------ */

const FONT = "font-['DM_Sans',sans-serif]";
const MUTED = "#8d9bbb";
const PRIMARY_BG = "linear-gradient(180deg,#4f7dff 0%,#2c5ae6 100%)";
const BLUE_TEXT: CSSProperties = {
  background: "linear-gradient(180deg,#a9c1ff 0%,#5f8bff 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
const GLASS: CSSProperties = {
  background: "rgba(255,255,255,0.035)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
};
const RATING = "4.5";
const PAID_OUT = 3.5; // "$3.5M+ Reward Paid Out", the figure the site already shows

type Deck = ReturnType<typeof useHeroDeck>;

/* ------------------------------ text ------------------------------ */

function Headline({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <h1 className={`${FONT} font-light text-white ${className}`} style={{ lineHeight: 1.04, letterSpacing: "-0.035em", ...style }}>
      <span className="block">Trade without hidden rules.</span>
      <span className="block" style={BLUE_TEXT}>
        Payouts in 24 hours.
      </span>
    </h1>
  );
}

function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`${FONT} text-[10.5px] font-normal uppercase tracking-[0.26em] lg:text-[11.5px] ${className}`} style={{ color: MUTED }}>{children}</p>;
}

function Stars({ size = 12 }: { size?: number }) {
  return (
    <span className="flex gap-[2px]" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < 4 ? "#f5c451" : "url(#fyt-half)"}>
          {i === 4 && (
            <defs>
              <linearGradient id="fyt-half">
                <stop offset="50%" stopColor="#f5c451" />
                <stop offset="50%" stopColor="rgba(245,196,81,0.3)" />
              </linearGradient>
            </defs>
          )}
          <path d="m12 2.6 2.9 6.1 6.7.8-4.9 4.6 1.3 6.6L12 17.4 6 20.7l1.3-6.6L2.4 9.5l6.7-.8L12 2.6Z" />
        </svg>
      ))}
    </span>
  );
}

function TrustLine({ className = "" }: { className?: string }) {
  return (
    <p className={`${FONT} flex items-center gap-[10px] text-[12.5px] font-light lg:text-[13.5px] ${className}`} style={{ color: MUTED }}>
      <Stars />
      <span>
        <span className="text-white">{RATING}</span> on Trustindex · 3K+ reviews
      </span>
    </p>
  );
}

/* ------------------------------ actions ------------------------------ */

function Arrow({ dir = "right", size = 14 }: { dir?: "left" | "right"; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PrimaryCta({ price, className = "" }: { price: number; className?: string }) {
  return (
    <a
      href="#challenge"
      onClick={() => pauseHeavyScenesForNav()}
      className={`${FONT} group flex h-[54px] w-full items-center justify-center gap-[10px] rounded-full text-[15.5px] font-medium text-white no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-[1px] lg:h-[58px] lg:w-auto lg:px-[34px] ${className}`}
      style={{ background: PRIMARY_BG, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 0 0 1px rgba(160,190,255,0.25), 0 18px 40px -18px rgba(60,110,255,0.9)" }}
    >
      Get funded
      <span className="font-light text-white/75">from ${price}</span>
      <span className="transition-transform duration-300 group-hover:translate-x-[2px]">
        <Arrow />
      </span>
    </a>
  );
}

function SecondaryLink({ className = "" }: { className?: string }) {
  return (
    <a href="https://rewards.fundingyourtrades.com/" className={`${FONT} group inline-flex items-center gap-[8px] text-[14px] font-light text-[#c7d3ee] no-underline transition-colors hover:text-white ${className}`}>
      View verified payouts
      <span className="transition-transform duration-300 group-hover:translate-x-[2px]">
        <Arrow size={13} />
      </span>
    </a>
  );
}

/* ------------------------------ trader story ------------------------------ */

function PlayButton({ size = 52 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-105"
      style={{ width: size, height: size, background: "rgba(10,16,34,0.42)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
    >
      <span className="ml-[2px]">
        <PlayIcon size={Math.round(size * 0.34)} />
      </span>
    </span>
  );
}

/** The poster as the editors made it: whole, 16:9, with a quiet play button. */
function StoryCard({ d, radius = 18, play = 52, className = "", style }: { d: Deck; radius?: number; play?: number; className?: string; style?: CSSProperties }) {
  return (
    <button
      type="button"
      onClick={() => d.setOpen(d.current)}
      aria-label={`Play video: ${d.current.name}`}
      className={`group relative block aspect-video w-full cursor-pointer overflow-hidden border-0 bg-[#0a1124] p-0 ${className}`}
      style={{ borderRadius: radius, ...style }}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={d.current.videoUrl}
          src={d.current.posterUrl}
          alt=""
          decoding="async"
          fetchPriority="high"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 size-full object-cover"
        />
      </AnimatePresence>
      <span className="pointer-events-none absolute inset-0" style={{ borderRadius: radius, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09)" }} />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <PlayButton size={play} />
      </span>
    </button>
  );
}

function FlagDot({ code, size = 16 }: { code: string | undefined; size?: number }) {
  const url = code ? countryFlagUrl(code) : null;
  if (!url) return null;
  return <img src={url} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size, boxShadow: "0 0 0 1px rgba(255,255,255,0.18)" }} />;
}

/** Who you are watching, and quiet controls to move on. */
function StoryCaption({ d, className = "" }: { d: Deck; className?: string }) {
  const btn = "flex size-[32px] cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#c7d3ee] transition-colors duration-300 hover:bg-white/10 hover:text-white";
  const ring = { boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" };
  return (
    <div className={`${FONT} flex items-center justify-between gap-[12px] ${className}`}>
      <div className="flex min-w-0 items-center gap-[10px]">
        <FlagDot code={d.code} size={18} />
        <span className="truncate text-[14px] font-normal text-white lg:text-[15px]">{d.current.name}</span>
        <span className="truncate text-[13px] font-light lg:text-[14px]" style={{ color: MUTED }}>
          {d.code ? countryPlain(d.code) : ""}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-[6px]">
        <span className="mr-[6px] text-[11.5px] font-light tabular-nums tracking-[0.08em]" style={{ color: MUTED }}>
          {String(d.pos + 1).padStart(2, "0")}/{String(d.n).padStart(2, "0")}
        </span>
        <button type="button" aria-label="Previous trader" onClick={() => d.go(d.pos - 1)} className={btn} style={ring}>
          <Arrow dir="left" size={13} />
        </button>
        <button type="button" aria-label="Next trader" onClick={() => d.go(d.pos + 1)} className={btn} style={ring}>
          <Arrow size={13} />
        </button>
      </div>
    </div>
  );
}

function Glow({ at = "50% 0%" }: { at?: string }) {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(80% 42% at ${at}, rgba(45,100,255,0.2), transparent 72%)` }} />;
}

/* ------------------------------ E: cinematic ------------------------------ */
/* The story opens the page edge to edge, the headline follows.          */

function VariantE({ d, price }: { d: Deck; price: number }) {
  return (
    <>
      <Glow at="50% 30%" />
      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-[64px] lg:px-[56px] lg:pb-[90px] lg:pt-[64px]">
        <div className="lg:order-2">
          {/* Phones: full width, no frame, fades into the page */}
          <div className="relative lg:hidden">
            <StoryCard d={d} radius={0} play={54} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]" style={{ background: "linear-gradient(180deg, rgba(4,7,15,0), #04070f)" }} />
          </div>
          <div className="hidden lg:block">
            <StoryCard d={d} radius={24} play={68} style={{ boxShadow: "0 60px 120px -50px rgba(40,90,255,0.55)" }} />
          </div>
          <StoryCaption d={d} className="mt-[6px] px-[20px] lg:mt-[18px] lg:px-[4px]" />
        </div>
        <div className="flex flex-col items-start px-[20px] pt-[34px] lg:order-1 lg:px-0 lg:pt-0">
          <Eyebrow>Funded trader stories</Eyebrow>
          <Headline className="mt-[14px] text-[36px] lg:mt-[20px] lg:text-[64px] xl:text-[72px]" />
          <PrimaryCta price={price} className="mt-[30px] lg:mt-[40px]" />
          <div className="mt-[22px] flex w-full flex-col items-center gap-[16px] lg:mt-[26px] lg:flex-row lg:items-center lg:gap-[28px]">
            <SecondaryLink />
            <TrustLine />
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ F: the number ------------------------------ */

function useCountTo(target: number, ms = 1600) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? target : 0);
  useEffect(() => {
    if (reduce) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, reduce]);
  return v;
}

function VariantF({ d, price }: { d: Deck; price: number }) {
  const v = useCountTo(PAID_OUT);
  return (
    <>
      <Glow at="50% 18%" />
      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 px-[20px] pb-[10px] pt-[40px] lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-[72px] lg:px-[56px] lg:pb-[90px] lg:pt-[72px]">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Eyebrow>Paid out to traders</Eyebrow>
          <div className={`${FONT} mt-[10px] font-extralight tabular-nums text-white`} style={{ lineHeight: 0.95, letterSpacing: "-0.05em" }}>
            <span className="text-[84px] lg:text-[132px]">${v.toFixed(1)}</span>
            <span className="text-[44px] lg:text-[68px]" style={BLUE_TEXT}>
              M+
            </span>
          </div>
          <svg viewBox="0 0 300 40" preserveAspectRatio="none" className="mt-[14px] h-[34px] w-[240px] lg:w-[340px]" aria-hidden="true">
            <defs>
              <linearGradient id="fyt-f-line" x1="0" x2="1">
                <stop offset="0" stopColor="#5f8bff" stopOpacity="0" />
                <stop offset="1" stopColor="#8fb0ff" />
              </linearGradient>
            </defs>
            <motion.path
              d="M2 36 C60 35 92 30 132 24 S206 14 244 9 S284 4 298 3"
              fill="none"
              stroke="url(#fyt-f-line)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <Headline className="mt-[26px] text-[26px] lg:mt-[34px] lg:text-[46px]" />
          <PrimaryCta price={price} className="mt-[28px] lg:mt-[36px]" />
          <div className="mt-[20px] flex flex-col items-center gap-[14px] lg:flex-row lg:gap-[28px]">
            <SecondaryLink />
            <TrustLine />
          </div>
        </div>

        <div className="mt-[34px] lg:mt-0">
          {/* Phones: one slim row. Desktop: the full story. */}
          <div className="flex items-center gap-[14px] rounded-[20px] p-[10px] lg:hidden" style={GLASS}>
            <div className="w-[132px] shrink-0">
              <StoryCard d={d} radius={12} play={34} />
            </div>
            <div className={`${FONT} min-w-0 flex-1`}>
              <div className="flex items-center gap-[8px]">
                <FlagDot code={d.code} size={15} />
                <span className="truncate text-[14px] text-white">{d.current.name}</span>
              </div>
              <p className="mt-[3px] text-[12px] font-light" style={{ color: MUTED }}>
                Watch the payout story
              </p>
            </div>
            <button type="button" aria-label="Next trader" onClick={() => d.go(d.pos + 1)} className="mr-[4px] flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#c7d3ee]" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }}>
              <Arrow size={13} />
            </button>
          </div>
          <div className="hidden lg:block">
            <StoryCard d={d} radius={24} play={68} style={{ boxShadow: "0 60px 120px -50px rgba(40,90,255,0.5)" }} />
            <StoryCaption d={d} className="mt-[18px] px-[4px]" />
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ G: bento ------------------------------ */

function Tile({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`${FONT} flex flex-col justify-between rounded-[18px] p-[14px] lg:rounded-[22px] lg:p-[20px] ${className}`} style={GLASS}>
      <span className="text-[9.5px] uppercase tracking-[0.2em] lg:text-[10.5px]" style={{ color: MUTED }}>
        {label}
      </span>
      <div className="mt-[14px] font-extralight leading-none text-white lg:mt-[22px]">{children}</div>
    </div>
  );
}

function VariantG({ d, price }: { d: Deck; price: number }) {
  return (
    <>
      <Glow at="50% 0%" />
      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 px-[20px] pb-[10px] pt-[36px] lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-[64px] lg:px-[56px] lg:pb-[90px] lg:pt-[64px]">
        <div className="flex flex-col items-start">
          <Headline className="text-[36px] lg:text-[62px] xl:text-[70px]" />
          <div className="mt-[30px] hidden w-full flex-col items-start gap-[22px] lg:flex">
            <PrimaryCta price={price} />
            <SecondaryLink />
          </div>
        </div>

        <div className="mt-[28px] grid grid-cols-3 gap-[8px] lg:mt-0 lg:gap-[12px]">
          <div className="col-span-3 rounded-[22px] p-[8px] lg:rounded-[28px] lg:p-[10px]" style={GLASS}>
            <StoryCard d={d} radius={15} play={50} />
            <StoryCaption d={d} className="px-[6px] pb-[2px] pt-[10px] lg:px-[8px] lg:pt-[12px]" />
          </div>
          <Tile label="Trustindex">
            <span className="text-[28px] lg:text-[40px]">{RATING}</span>
            <span className="ml-[3px] text-[12px] text-white/45 lg:text-[15px]">/5</span>
          </Tile>
          <Tile label="Payouts">
            <span className="text-[28px] lg:text-[40px]">24</span>
            <span className="ml-[3px] text-[12px] text-white/45 lg:text-[15px]">hrs</span>
          </Tile>
          <Tile label="Traders">
            <span className="text-[28px] lg:text-[40px]">21K</span>
            <span className="ml-[1px] text-[12px] text-white/45 lg:text-[15px]">+</span>
          </Tile>
        </div>

        <div className="mt-[24px] flex flex-col items-center gap-[18px] lg:hidden">
          <PrimaryCta price={price} />
          <SecondaryLink />
        </div>
      </div>
    </>
  );
}

/* ------------------------------ H: country stories ------------------------------ */

function VariantH({ d, price }: { d: Deck; price: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const active = d.code;
  useEffect(() => {
    const row = rowRef.current;
    if (!row || !active) return;
    const btn = row.querySelector<HTMLElement>(`[data-code="${active}"]`);
    if (!btn) return;
    row.scrollTo({ left: btn.offsetLeft - row.clientWidth / 2 + btn.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <>
      <Glow at="50% 0%" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center px-[20px] pb-[10px] pt-[38px] text-center lg:px-[56px] lg:pb-[90px] lg:pt-[64px]">
        <Headline className="text-[35px] lg:text-[66px] xl:text-[74px]" />
        <PrimaryCta price={price} className="mt-[28px] lg:mt-[38px]" />
        <SecondaryLink className="mt-[18px]" />

        <Eyebrow className="mt-[44px] lg:mt-[60px]">Traders near you</Eyebrow>
        <div
          ref={rowRef}
          className="mt-[16px] flex w-[calc(100%+40px)] gap-[16px] overflow-x-auto px-[20px] pb-[2px] [justify-content:safe_center] [scrollbar-width:none] lg:w-full lg:gap-[22px] [&::-webkit-scrollbar]:hidden"
        >
          {d.countries.map(({ code, at }) => {
            const on = code === active;
            const flag = countryFlagUrl(code);
            return (
              <button
                key={code}
                type="button"
                data-code={code}
                onClick={() => d.go(at)}
                aria-label={`Traders from ${countryPlain(code)}`}
                className={`${FONT} flex w-[56px] shrink-0 cursor-pointer flex-col items-center gap-[7px] border-0 bg-transparent p-0 transition-opacity duration-300`}
                style={{ opacity: on ? 1 : 0.5 }}
              >
                <span className="block size-[46px] rounded-full p-[3px] transition-shadow duration-300 lg:size-[52px]" style={{ boxShadow: on ? "0 0 0 1.5px #7ea2ff" : "0 0 0 1px rgba(255,255,255,0.16)" }}>
                  {flag && <img src={flag} alt="" loading="lazy" className="size-full rounded-full object-cover" />}
                </span>
                <span className="w-full truncate text-[10.5px] font-light text-[#c7d3ee]">{countryPlain(code)}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-[20px] w-full lg:mt-[26px]">
          <StoryCard d={d} radius={20} play={58} style={{ boxShadow: "0 50px 100px -50px rgba(40,90,255,0.5)" }} />
          <StoryCaption d={d} className="mt-[12px] px-[2px] text-left" />
        </div>
        <TrustLine className="mt-[26px] justify-center" />
      </div>
    </>
  );
}

/* ------------------------------ section ------------------------------ */

export default function HeroVariants({ variant, price, strip }: { variant: HeroVariant; price: number; strip?: ReactNode }) {
  const d = useHeroDeck();
  return (
    <section
      ref={d.rootRef}
      onMouseEnter={() => d.setHover(true)}
      onMouseLeave={() => d.setHover(false)}
      className="relative w-full shrink-0 overflow-hidden bg-[#04070f]"
      data-hero-variant={variant}
    >
      {variant === "e" && <VariantE d={d} price={price} />}
      {variant === "f" && <VariantF d={d} price={price} />}
      {variant === "g" && <VariantG d={d} price={price} />}
      {variant === "h" && <VariantH d={d} price={price} />}
      {strip && <div className="relative z-10 flex justify-center pb-[34px] pt-[30px] lg:hidden">{strip}</div>}
      <HeroLightbox video={d.open} onClose={d.closeVideo} />
    </section>
  );
}

/* ------------------------------ calm promo bar ------------------------------ */

function timeLeft(end: string): string {
  const ms = new Date(end).getTime() - Date.now();
  if (ms <= 0) return "";
  const m = Math.floor(ms / 60000);
  const days = Math.floor(m / 1440);
  const hours = Math.floor((m % 1440) / 60);
  const mins = m % 60;
  return days > 0 ? `${days}d ${hours}h left` : `${hours}h ${mins}m left`;
}

/** One quiet line instead of the animated banner (used with the ?hero= previews). */
export function CalmPromoBar() {
  const hw = isHalloweenLive();
  const end = hw ? HALLOWEEN_END : PROMO_DEADLINE;
  const code = hw ? HALLOWEEN_CODE : PROMO_CODE;
  const deal = hw ? "45% OFF + 1 free account instantly" : PROMO_DEAL_SHORT;
  const [left, setLeft] = useState(() => timeLeft(end));
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const t = window.setInterval(() => setLeft(timeLeft(end)), 30000);
    return () => window.clearInterval(t);
  }, [end]);
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      },
      () => undefined,
    );
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        pauseHeavyScenesForNav();
        document.getElementById("challenge")?.scrollIntoView({ behavior: "smooth" });
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.currentTarget as HTMLElement).click();
      }}
      className={`${FONT} flex h-[38px] w-full cursor-pointer items-center justify-center gap-[12px] px-[14px] text-[12px] font-normal tracking-[0.01em] text-white lg:h-[42px] lg:text-[13px]`}
      style={{ background: "linear-gradient(90deg,#0a1230,#13235a 50%,#0a1230)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <span className="truncate">
        <span className="font-medium uppercase">{deal.split(" + ")[0]}</span>
        <span className="font-light text-white/80">{deal.includes(" + ") ? ` + ${deal.split(" + ").slice(1).join(" + ")}` : ""}</span>
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy code ${code}`}
        className="shrink-0 cursor-pointer rounded-full border-0 bg-transparent px-[10px] py-[3px] text-[10.5px] font-medium tracking-[0.12em] text-[#ffc08a] lg:text-[11px]"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,170,100,0.45)" }}
      >
        {copied ? "COPIED" : code}
      </button>
      {left && <span className="hidden shrink-0 font-light text-white/55 sm:inline">{left}</span>}
    </div>
  );
}

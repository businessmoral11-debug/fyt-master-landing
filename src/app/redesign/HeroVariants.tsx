import "@fontsource/dm-sans/200.css";
import "@fontsource/dm-sans/300.css";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { countryFlagUrl } from "@/app/api/rewardsApi";
import { countryPlain } from "@/app/data/visitorGeo";
import { HALLOWEEN_CODE, HALLOWEEN_END, isHalloweenLive } from "@/app/data/halloween";
import { PROMO_CODE, PROMO_DEADLINE, PROMO_DEAL_SHORT } from "@/app/data/promoBanner";
import { pauseHeavyScenesForNav } from "@/app/three/scenePause";
import type { HeroVariant } from "./heroVariant";
import { Flag, HeroLightbox, PlayIcon, useHeroDeck } from "./HeroVideoProof";

/* ------------------------------------------------------------------ */
/* Alternative hero layouts, shown only with ?hero=e | f | g | h.       */
/* They share the live video logic (own country first) but drop the    */
/* busy parts: no animated headline word, no progress bar, no shimmer. */
/* ------------------------------------------------------------------ */

export type { HeroVariant };

const BLUE = "#7ea2ff";
const PRIMARY_BG = "linear-gradient(180deg,#5b86ff 0%,#2f5be0 100%)";
const RATING = "4.5";
const REVIEWS = "3K+ reviews";
const PAID_OUT = 3.5; // "$3.5M+ Reward Paid Out", same figure the site already shows

type Deck = ReturnType<typeof useHeroDeck>;

/* ------------------------------ small parts ------------------------------ */

function Headline({ className = "", center = false }: { className?: string; center?: boolean }) {
  return (
    <h1 className={`font-['DM_Sans',sans-serif] font-light ${center ? "text-center" : ""} ${className}`} style={{ lineHeight: 1.1, letterSpacing: "-0.02em" }}>
      <span className="block text-white">Trade without hidden rules.</span>
      <span className="block" style={{ color: BLUE }}>
        Payouts in 24 hours.
      </span>
    </h1>
  );
}

function ArrowIcon({ dir = "right", size = 15 }: { dir?: "left" | "right"; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Star({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f5c451" aria-hidden="true">
      <path d="m12 2.6 2.9 6.1 6.7.8-4.9 4.6 1.3 6.6L12 17.4 6 20.7l1.3-6.6L2.4 9.5l6.7-.8L12 2.6Z" />
    </svg>
  );
}

function Rating({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-center justify-center gap-[8px] text-[12.5px] font-light tracking-[0.02em] text-[#9fb0d0] lg:text-[13px] ${className}`}>
      <Star />
      <span className="font-normal text-white">{RATING}</span>
      <span>on Trustindex</span>
      <span className="opacity-40">·</span>
      <span>{REVIEWS}</span>
    </p>
  );
}

function Buttons({ price, className = "" }: { price: number; className?: string }) {
  return (
    <div className={`flex w-full max-w-[460px] items-stretch gap-[10px] ${className}`}>
      <a
        href="#challenge"
        onClick={() => pauseHeavyScenesForNav()}
        className="group flex h-[54px] min-w-0 flex-[1.45] items-center justify-center gap-[10px] rounded-full text-[15px] font-medium text-white no-underline transition-transform duration-300 hover:-translate-y-[1px] lg:h-[56px]"
        style={{ background: PRIMARY_BG, boxShadow: "inset 0 0 0 1px rgba(156,196,255,0.35), 0 14px 34px -14px rgba(59,110,255,0.85)" }}
      >
        <span className="whitespace-nowrap">Get funded</span>
        <span className="whitespace-nowrap text-[13px] font-light text-[#dbe7ff]">from ${price}</span>
        <span className="transition-transform duration-300 group-hover:translate-x-[2px]">
          <ArrowIcon />
        </span>
      </a>
      <a
        href="https://rewards.fundingyourtrades.com/"
        className="flex h-[54px] min-w-0 flex-1 items-center justify-center rounded-full text-[14.5px] font-normal text-[#e8ebf2] no-underline transition-colors duration-300 hover:bg-white/10 lg:h-[56px]"
        style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16)" }}
      >
        <span className="whitespace-nowrap">View payouts</span>
      </a>
    </div>
  );
}

function PlayOrb({ size = 60 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-full text-[#0b1530] transition-transform duration-300 group-hover:scale-105"
      style={{ width: size, height: size, background: "rgba(255,255,255,0.95)", boxShadow: "0 0 0 8px rgba(255,255,255,0.14), 0 18px 40px -12px rgba(0,0,0,0.6)" }}
    >
      <span className="ml-[3px]">
        <PlayIcon size={Math.round(size * 0.38)} />
      </span>
    </span>
  );
}

function Poster({ d, objectPosition = "50% 50%" }: { d: Deck; objectPosition?: string }) {
  return (
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
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition }}
      />
    </AnimatePresence>
  );
}

function CountryChip({ d, className = "" }: { d: Deck; className?: string }) {
  return (
    <span
      className={`flex items-center gap-[8px] rounded-full py-[5px] pl-[7px] pr-[12px] text-[11.5px] font-medium text-white ${className}`}
      style={{ background: "rgba(6,10,24,0.6)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
    >
      <Flag code={d.code} w={17} />
      {d.code ? countryPlain(d.code) : "Funded trader"}
    </span>
  );
}

function Stepper({ d, className = "" }: { d: Deck; className?: string }) {
  const btn = "flex size-[34px] cursor-pointer items-center justify-center rounded-full border-0 text-[#dbe5fb] transition-colors duration-300 hover:bg-white/15";
  const style = { background: "rgba(255,255,255,0.07)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" };
  return (
    <div className={`flex items-center gap-[10px] ${className}`}>
      <span className="text-[11.5px] font-light tabular-nums tracking-[0.12em] text-[#9fb0d0]">
        {String(d.pos + 1).padStart(2, "0")} / {String(d.n).padStart(2, "0")}
      </span>
      <button type="button" aria-label="Previous video" onClick={() => d.go(d.pos - 1)} className={btn} style={style}>
        <ArrowIcon dir="left" size={14} />
      </button>
      <button type="button" aria-label="Next video" onClick={() => d.go(d.pos + 1)} className={btn} style={style}>
        <ArrowIcon size={14} />
      </button>
    </div>
  );
}

function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ background: "radial-gradient(70% 46% at 50% 0%, rgba(37,99,235,0.3), transparent 72%), radial-gradient(46% 38% at 88% 62%, rgba(37,99,235,0.13), transparent 72%)" }}
    />
  );
}

/* ------------------------------ E: cinematic ------------------------------ */

function VariantE({ d, price }: { d: Deck; price: number }) {
  return (
    <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-x-[56px] px-[20px] pb-[8px] pt-[10px] lg:grid-cols-[1.05fr_0.95fr] lg:px-[56px] lg:pb-[72px] lg:pt-[44px]">
      {/* Video arch: first on phones, on the right on desktop */}
      <div className="col-start-1 row-start-1 mx-auto w-full max-w-[400px] pb-[58px] lg:col-start-2 lg:row-span-3 lg:max-w-[480px] lg:pb-0">
        <button
          type="button"
          onClick={() => d.setOpen(d.current)}
          aria-label={`Play video: ${d.current.name}`}
          className="group relative block h-[470px] w-full cursor-pointer overflow-hidden border-0 bg-[#0a1230] p-0 text-left lg:h-[600px]"
          style={{ borderRadius: "999px 999px 28px 28px", boxShadow: "inset 0 0 0 1px rgba(148,178,255,0.22), 0 50px 100px -50px rgba(37,99,235,0.7)" }}
        >
          <Poster d={d} objectPosition="24% 50%" />
          <span className="absolute inset-0 lg:hidden" style={{ background: "linear-gradient(180deg, rgba(3,6,13,0.2) 0%, rgba(3,6,13,0) 26%, rgba(3,6,13,0.55) 56%, #03060d 96%)" }} />
          <span className="absolute inset-0 hidden lg:block" style={{ background: "linear-gradient(180deg, rgba(3,6,13,0.15) 0%, rgba(3,6,13,0) 30%, rgba(3,6,13,0.7) 100%)" }} />
          <span className="absolute left-1/2 top-[64px] -translate-x-1/2 lg:top-[84px]">
            <CountryChip d={d} />
          </span>
          <span className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 lg:top-[45%]">
            <PlayOrb size={62} />
          </span>
          <span className="absolute inset-x-0 bottom-[22px] hidden flex-col items-center gap-[2px] lg:flex">
            <span className="text-[19px] font-normal text-white">{d.current.name}</span>
            <span className="text-[12.5px] font-light text-[#c3d1ee]">Funded trader · payout story</span>
          </span>
        </button>
        <Stepper d={d} className="mt-[14px] justify-center lg:mt-[16px]" />
      </div>

      {/* Headline sits over the foot of the arch on phones */}
      <div className="pointer-events-none relative z-10 col-start-1 row-start-1 self-end pb-[62px] lg:pointer-events-auto lg:col-start-1 lg:pb-0 lg:self-end">
        <Headline center className="pointer-events-auto text-[35px] lg:text-left lg:text-[64px] xl:text-[72px]" />
      </div>
      <div className="relative z-10 col-start-1 row-start-2 mt-[22px] flex justify-center lg:mt-[34px] lg:justify-start">
        <Buttons price={price} />
      </div>
      <div className="relative z-10 col-start-1 row-start-3 mt-[20px] lg:mt-[22px] lg:self-start">
        <Rating className="lg:justify-start" />
      </div>
    </div>
  );
}

/* ------------------------------ F: payout number ------------------------------ */

function useCountTo(target: number, ms = 1500) {
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
    <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-y-[26px] px-[20px] pb-[8px] pt-[26px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-[64px] lg:px-[56px] lg:pb-[84px] lg:pt-[56px]">
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <span className="text-[10.5px] font-normal tracking-[0.24em] text-[#8ea3cf] lg:text-[11.5px]">PAID OUT TO TRADERS</span>
        <div className="mt-[6px] font-['DM_Sans',sans-serif] font-extralight tabular-nums text-white" style={{ lineHeight: 1, letterSpacing: "-0.04em" }}>
          <span className="text-[68px] lg:text-[124px]">${v.toFixed(1)}</span>
          <span className="text-[38px] text-white/60 lg:text-[64px]">M+</span>
        </div>
        <svg viewBox="0 0 390 64" preserveAspectRatio="none" className="mt-[6px] h-[56px] w-full max-w-[420px] lg:h-[64px]" aria-hidden="true">
          <motion.path
            d="M4 56 C70 54 104 46 156 38 S246 28 296 16 S352 8 384 6"
            fill="none"
            stroke={BLUE}
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.circle cx="384" cy="6" r="3.6" fill={BLUE} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.4 }} />
        </svg>
        <Headline center className="mt-[12px] text-[27px] lg:mt-[22px] lg:text-left lg:text-[50px] xl:text-[56px]" />
        <Buttons price={price} className="mt-[24px] lg:mt-[34px]" />
        <Rating className="mt-[18px] lg:justify-start" />
      </div>

      <div className="min-w-0">
        <button
          type="button"
          onClick={() => d.setOpen(d.current)}
          aria-label={`Play video: ${d.current.name}`}
          className="group flex w-full cursor-pointer items-center gap-[14px] rounded-[22px] border-0 p-[10px] text-left lg:flex-col lg:items-stretch lg:gap-0 lg:rounded-[28px] lg:p-[12px]"
          style={{ background: "rgba(255,255,255,0.045)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
        >
          <span className="relative block aspect-[16/10] w-[112px] shrink-0 overflow-hidden rounded-[13px] bg-[#0a1230] lg:w-full lg:rounded-[18px]">
            <Poster d={d} />
            <span className="absolute inset-0 hidden items-center justify-center lg:flex">
              <PlayOrb size={64} />
            </span>
            <span className="absolute left-[12px] top-[12px] hidden lg:block">
              <CountryChip d={d} />
            </span>
          </span>
          <span className="flex min-w-0 flex-1 flex-col lg:mt-[14px] lg:flex-row lg:items-center lg:justify-between lg:px-[6px] lg:pb-[4px]">
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[14.5px] font-normal text-white lg:text-[17px]">
                {d.current.name}
                <span className="font-light text-[#9fb0d0] lg:hidden"> · {d.code ? countryPlain(d.code) : ""}</span>
              </span>
              <span className="mt-[2px] text-[11.5px] font-light text-[#a9b8d6] lg:text-[12.5px]">Watch the payout story</span>
            </span>
            <span className="hidden text-[12px] font-light tabular-nums tracking-[0.12em] text-[#9fb0d0] lg:block">
              {String(d.pos + 1).padStart(2, "0")} / {String(d.n).padStart(2, "0")}
            </span>
          </span>
          <span className="flex shrink-0 items-center justify-center lg:hidden">
            <PlayOrb size={36} />
          </span>
        </button>
        <Stepper d={d} className="mt-[12px] hidden justify-end lg:flex" />
      </div>
    </div>
  );
}

/* ------------------------------ G: bento ------------------------------ */

const TILE = "rounded-[22px] p-[16px] lg:rounded-[26px] lg:p-[22px]";
const TILE_STYLE = { background: "rgba(255,255,255,0.045)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" } as const;

function TileLabel({ children }: { children: ReactNode }) {
  return <span className="text-[9.5px] font-normal tracking-[0.2em] text-[#8ea3cf] lg:text-[10.5px]">{children}</span>;
}

function VariantG({ d, price }: { d: Deck; price: number }) {
  return (
    <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-y-[22px] px-[20px] pb-[8px] pt-[24px] lg:grid-cols-[0.82fr_1.18fr] lg:gap-x-[56px] lg:px-[56px] lg:pb-[84px] lg:pt-[56px]">
      <div className="flex flex-col lg:items-start">
        <Headline className="text-[33px] lg:text-[60px] xl:text-[68px]" />
        <p className="mt-[16px] hidden max-w-[420px] text-[16px] font-light leading-[1.6] text-[#a9b8d6] lg:block">Funded accounts with clear rules and fast, verified payouts.</p>
        <div className="mt-[30px] hidden lg:block">
          <Buttons price={price} />
        </div>
      </div>

      <div className="grid grid-cols-2 grid-rows-[152px_152px_104px] gap-[10px] lg:grid-cols-4 lg:grid-rows-[170px_170px_118px] lg:gap-[14px]">
        <button
          type="button"
          onClick={() => d.setOpen(d.current)}
          aria-label={`Play video: ${d.current.name}`}
          className="group relative col-span-1 row-span-2 cursor-pointer overflow-hidden rounded-[22px] border-0 bg-[#0a1230] p-0 text-left lg:col-span-3 lg:rounded-[26px]"
          style={{ boxShadow: "inset 0 0 0 1px rgba(148,178,255,0.22)" }}
        >
          <Poster d={d} objectPosition="22% 50%" />
          <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(3,6,13,0.22) 0%, rgba(3,6,13,0) 30%, rgba(3,6,13,0.78) 100%)" }} />
          <span className="absolute left-[10px] top-[10px] lg:left-[16px] lg:top-[16px]">
            <CountryChip d={d} />
          </span>
          <span className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
            <PlayOrb size={52} />
          </span>
          <span className="absolute inset-x-[14px] bottom-[12px] flex items-end justify-between lg:inset-x-[20px] lg:bottom-[16px]">
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[14px] font-normal text-white lg:text-[17px]">{d.current.name}</span>
              <span className="text-[10.5px] font-light text-[#c3d1ee] lg:text-[12px]">payout story</span>
            </span>
          </span>
        </button>

        <div className={`${TILE} flex flex-col justify-between`} style={TILE_STYLE}>
          <TileLabel>TRUSTINDEX</TileLabel>
          <div>
            <div className="font-['DM_Sans',sans-serif] text-[34px] font-extralight leading-none text-white lg:text-[44px]">
              {RATING}
              <span className="text-[14px] text-white/50"> / 5</span>
            </div>
            <div className="mt-[8px] flex gap-[2px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={12} />
              ))}
            </div>
          </div>
        </div>
        <div className={`${TILE} flex flex-col justify-between`} style={TILE_STYLE}>
          <TileLabel>PAYOUTS</TileLabel>
          <div className="font-['DM_Sans',sans-serif] text-[30px] font-extralight leading-none text-white lg:text-[44px]">
            24 <span className="text-[16px] text-white/55 lg:text-[20px]">hrs</span>
          </div>
        </div>
        <div className={`${TILE} flex flex-col justify-between`} style={TILE_STYLE}>
          <TileLabel>REVIEWS</TileLabel>
          <div className="font-['DM_Sans',sans-serif] text-[30px] font-extralight leading-none text-white lg:text-[44px]">3K+</div>
        </div>
        <a
          href="#challenge"
          onClick={() => pauseHeavyScenesForNav()}
          className={`${TILE} group flex flex-col justify-center text-white no-underline transition-transform duration-300 hover:-translate-y-[2px] lg:col-span-3 lg:flex-row lg:items-center lg:justify-between lg:px-[30px]`}
          style={{ background: PRIMARY_BG, boxShadow: "inset 0 0 0 1px rgba(156,196,255,0.35), 0 16px 40px -16px rgba(59,110,255,0.8)" }}
        >
          <span className="flex flex-col">
            <span className="text-[15px] font-medium lg:text-[20px]">Get funded</span>
            <span className="mt-[2px] text-[12px] font-light text-[#dbe7ff] lg:text-[13.5px]">from ${price}</span>
          </span>
          <span className="mt-[6px] lg:mt-0 lg:flex lg:size-[44px] lg:items-center lg:justify-center lg:rounded-full lg:bg-white/95 lg:text-[#1d4ed8]">
            <ArrowIcon size={16} />
          </span>
        </a>
      </div>

      <a href="https://rewards.fundingyourtrades.com/" className="mx-auto text-[13px] font-light text-[#9fb0d0] no-underline transition-colors hover:text-white lg:hidden">
        View payouts →
      </a>
    </div>
  );
}

/* ------------------------------ H: country stories ------------------------------ */

function VariantH({ d, price }: { d: Deck; price: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const activeCode = d.code;
  useEffect(() => {
    const row = rowRef.current;
    if (!row || !activeCode) return;
    const btn = row.querySelector<HTMLElement>(`[data-code="${activeCode}"]`);
    if (!btn) return;
    row.scrollTo({ left: btn.offsetLeft - row.clientWidth / 2 + btn.clientWidth / 2, behavior: "smooth" });
  }, [activeCode]);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col items-center px-[20px] pb-[8px] pt-[30px] lg:px-[56px] lg:pb-[84px] lg:pt-[56px]">
      <Headline center className="text-[33px] lg:text-[64px] xl:text-[72px]" />
      <Buttons price={price} className="mt-[24px] lg:mt-[34px] lg:max-w-[480px]" />

      <div ref={rowRef} className="mt-[32px] flex w-full gap-[14px] overflow-x-auto px-[4px] pb-[4px] [justify-content:safe_center] [scrollbar-width:none] lg:mt-[44px] lg:gap-[18px] [&::-webkit-scrollbar]:hidden">
        {d.countries.map(({ code, at }) => {
          const on = code === activeCode;
          const flag = countryFlagUrl(code);
          return (
            <button
              key={code}
              type="button"
              data-code={code}
              onClick={() => d.go(at)}
              aria-label={`Show traders from ${countryPlain(code)}`}
              className="flex shrink-0 cursor-pointer flex-col items-center gap-[6px] border-0 bg-transparent p-0 transition-opacity duration-300"
              style={{ opacity: on ? 1 : 0.55 }}
            >
              <span className="block size-[52px] rounded-full p-[3px] lg:size-[60px]" style={{ boxShadow: on ? `0 0 0 2px ${BLUE}` : "0 0 0 1px rgba(255,255,255,0.22)" }}>
                {flag && <img src={flag} alt="" loading="lazy" className="size-full rounded-full object-cover" />}
              </span>
              <span className="whitespace-nowrap text-[10.5px] font-light text-[#c3d1ee] lg:text-[11.5px]">{countryPlain(code)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-[22px] w-full max-w-[880px] lg:mt-[28px]">
        <button
          type="button"
          onClick={() => d.setOpen(d.current)}
          aria-label={`Play video: ${d.current.name}`}
          className="group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[24px] border-0 bg-[#0a1230] p-0 text-left sm:aspect-video lg:rounded-[30px]"
          style={{ boxShadow: "inset 0 0 0 1px rgba(148,178,255,0.22), 0 50px 100px -50px rgba(37,99,235,0.65)" }}
        >
          <Poster d={d} />
          <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(3,6,13,0.18) 0%, rgba(3,6,13,0) 28%, rgba(3,6,13,0.78) 100%)" }} />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <PlayOrb size={64} />
          </span>
          <span className="absolute inset-x-[16px] bottom-[14px] flex items-end justify-between lg:inset-x-[24px] lg:bottom-[20px]">
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[17px] font-normal text-white lg:text-[21px]">{d.current.name}</span>
              <span className="text-[12px] font-light text-[#c3d1ee] lg:text-[13px]">Funded trader {d.scope} · payout story</span>
            </span>
          </span>
        </button>
        <div className="mt-[14px] flex items-center justify-between">
          <Rating className="!justify-start" />
          <Stepper d={d} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ page section ------------------------------ */

export default function HeroVariants({ variant, price, strip }: { variant: HeroVariant; price: number; strip?: ReactNode }) {
  const d = useHeroDeck();
  return (
    <section ref={d.rootRef} onMouseEnter={() => d.setHover(true)} onMouseLeave={() => d.setHover(false)} className="relative w-full shrink-0 overflow-hidden bg-[#03060d]" data-hero-variant={variant}>
      <Backdrop />
      {variant === "e" && <VariantE d={d} price={price} />}
      {variant === "f" && <VariantF d={d} price={price} />}
      {variant === "g" && <VariantG d={d} price={price} />}
      {variant === "h" && <VariantH d={d} price={price} />}
      {strip && <div className="relative z-10 flex justify-center pb-[30px] pt-[18px] lg:hidden">{strip}</div>}
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

/** A single quiet line instead of the animated banner (used with the ?hero= previews). */
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
      className="flex min-h-[38px] w-full cursor-pointer items-center justify-center gap-[10px] px-[12px] py-[6px] font-['DM_Sans',sans-serif] text-[11.5px] font-normal tracking-[0.03em] text-white sm:text-[12.5px]"
      style={{ background: "#0a1026", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <span className="truncate">{deal}</span>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy code ${code}`}
        className="shrink-0 cursor-pointer rounded-full border-0 px-[10px] py-[3px] text-[10.5px] font-medium tracking-[0.1em] text-[#ffc08a] sm:text-[11px]"
        style={{ background: "rgba(255,160,90,0.12)", boxShadow: "inset 0 0 0 1px rgba(255,160,90,0.35)" }}
      >
        {copied ? "COPIED" : code}
      </button>
      {left && <span className="hidden shrink-0 text-[#9fb0d0] sm:inline">{left}</span>}
    </div>
  );
}

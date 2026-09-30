import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";

/** Shared easing for every redesign reveal — fast start, long soft landing. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const C = {
  ink: "#03060d",
  inkAlt: "#050913",
  textDark: "#eef2fa",
  mutedDark: "#8e98b0",
  light: "#f5f8ff",
  textLight: "#0a0f1e",
  mutedLight: "#5b6478",
  blue: "#2f6bff",
  blueBright: "#3b82f6",
  blueSoft: "#7db2ff",
  borderDark: "rgba(148,178,255,0.12)",
  borderLight: "#e3eaf7",
} as const;

export const PRIMARY_GRADIENT: CSSProperties = {
  background: "linear-gradient(180deg, #4f8cff 0%, #2563eb 100%)",
  boxShadow: "0 10px 30px -10px rgba(37,99,235,0.75), inset 0 1px 0 rgba(255,255,255,0.35)",
};
const PRIMARY_PILL_BG: CSSProperties = { background: PRIMARY_GRADIENT.background };

/** Sets --mx/--my on the card for the `.fyt-spot` glowing border. */
export function spotlightMove(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** True on desktop-width, fine-pointer screens — used to keep parallax off phones. */
export function useIsDesktop() {
  const query = "(min-width: 1024px) and (pointer: fine)";
  const [is, setIs] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIs(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return is;
}

/** True while the element is on (or near) screen — used to run loops only when visible. */
export function useLive<T extends Element>(margin = "100px") {
  const ref = useRef<T>(null);
  const live = useInView(ref, { margin: margin as never });
  return [ref, live] as const;
}

/** Adds .fyt-shimmer-on the first time the element scrolls into view. */
export function useShimmer<T extends Element>() {
  const ref = useRef<T>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  return [ref, seen ? "fyt-shimmer-on" : ""] as const;
}

/** Thin blue reading-progress bar pinned to the very top of the viewport. */
export function ScrollProgressBar() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  if (reduce) return null;
  const scaleX = scrollYProgress;
  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 h-[2px] origin-left z-[100] pointer-events-none"
      style={{ scaleX, background: "linear-gradient(90deg, #2563eb, #60a5fa 60%, #bfdbfe)", boxShadow: "0 0 12px rgba(96,165,250,0.8)" }}
    />
  );
}

/** Fade + lift into view once. Transform/opacity only. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  className,
  amount = 0.2,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
  amount?: number;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Container + child variants for staggered grids. */
export const staggerParent = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});
export const staggerChild = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

/** Heading whose words rise in one after another. */
export function WordsReveal({ text, className, wordClassName = "", delay = 0 }: { text: string; className?: string; wordClassName?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) return <span className={`${className ?? ""} ${wordClassName}`}>{text}</span>;
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={{
              hidden: { y: "105%", opacity: 0 },
              show: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: EASE } },
            }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function Eyebrow({ children, tone = "dark", center = false }: { children: ReactNode; tone?: "dark" | "light"; center?: boolean }) {
  const [ref, live] = useLive<HTMLSpanElement>();
  const dot = tone === "dark" ? "#60a5fa" : "#3b82f6";
  return (
    <Reveal y={12} className={center ? "flex justify-center" : "flex"}>
      <span
        ref={ref}
        className={`inline-flex items-center gap-[8px] rounded-full px-[12px] py-[6px] text-[11px] font-semibold tracking-[0.18em] uppercase ${live ? "fyt-live" : ""}`}
        style={
          tone === "dark"
            ? { color: "#93c5fd", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(96,165,250,0.22)" }
            : { color: "#2563eb", background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.14)" }
        }
      >
        <span className="relative flex size-[6px]">
          <span className="fyt-rd-ping-gated absolute inset-0 rounded-full" style={{ background: dot }} />
          <span className="relative size-[6px] rounded-full" style={{ background: dot }} />
        </span>
        {children}
      </span>
    </Reveal>
  );
}

function ArrowIcon({ color = "#fff" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="relative transition-transform duration-300 group-hover:translate-x-[4px]" aria-hidden="true">
      <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Primary / secondary pill link or button. */
export function Pill({
  href,
  onClick,
  children,
  variant = "primary",
  tone = "dark",
  target,
  rel,
  className = "",
  arrow = true,
  ariaLabel,
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary";
  tone?: "dark" | "light";
  target?: string;
  rel?: string;
  className?: string;
  arrow?: boolean;
  ariaLabel?: string;
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-[10px] rounded-full px-[28px] py-[15px] text-center text-[15px] font-semibold no-underline whitespace-nowrap max-[374px]:whitespace-normal transition-[translate,scale,box-shadow,background-color,border-color] duration-300 hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] cursor-pointer";
  const style: CSSProperties =
    variant === "primary"
      ? PRIMARY_PILL_BG
      : tone === "dark"
        ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.14)", color: "#e8ecf6" }
        : { background: "#fff", border: `1px solid ${C.borderLight}`, color: C.textLight, boxShadow: "0 8px 24px -14px rgba(15,23,42,0.25)" };
  const cls = `${base} ${variant === "primary" ? "cta-shine text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.75),inset_0_1px_0_rgba(255,255,255,0.35)] hover:shadow-[0_18px_44px_-12px_rgba(59,130,246,0.85),inset_0_1px_0_rgba(255,255,255,0.35)]" : ""} ${className}`;
  const inner = (
    <>
      {variant === "primary" && (
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 rounded-t-full pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.2), transparent)" }} />
      )}
      <span className="relative">{children}</span>
      {arrow && <ArrowIcon color={variant === "primary" || tone === "dark" ? "#fff" : C.textLight} />}
    </>
  );
  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className={cls} style={style} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`${cls} border-0`} style={style} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}

/**
 * Full-width section shell with the redesign backgrounds. Its glow layers
 * drift slightly against the scroll (parallax) — transform only.
 */
export function Section({
  tone,
  id,
  children,
  className = "",
  innerClassName = "",
  grid = true,
  stars = false,
}: {
  tone: "dark" | "light";
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  grid?: boolean;
  stars?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() || !useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [-90, 90]);
  const yB = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const dark = tone === "dark";
  return (
    <section
      ref={ref}
      id={id}
      className={`fyt-rd relative w-full shrink-0 overflow-clip scroll-mt-[132px] lg:scroll-mt-[136px] ${className}`}
      style={{ background: dark ? `linear-gradient(180deg, ${C.ink} 0%, ${C.inkAlt} 100%)` : `linear-gradient(180deg, #ffffff 0%, ${C.light} 100%)` }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {stars && <div className="absolute inset-0 fyt-stars opacity-70" />}
        {grid && <div className={`absolute inset-0 ${dark ? "fyt-grid-dark" : "fyt-grid-light"}`} />}
        <motion.div
          className="absolute rounded-full"
          style={{
            y: reduce ? 0 : yA,
            left: "-12%",
            top: "-10%",
            width: 720,
            height: 720,
            background: dark ? "radial-gradient(circle, rgba(37,99,235,0.2), transparent 65%)" : "radial-gradient(circle, rgba(59,130,246,0.1), transparent 65%)",
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            y: reduce ? 0 : yB,
            right: "-14%",
            bottom: "-18%",
            width: 780,
            height: 780,
            background: dark ? "radial-gradient(circle, rgba(96,165,250,0.12), transparent 65%)" : "radial-gradient(circle, rgba(125,178,255,0.14), transparent 65%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: dark ? "linear-gradient(90deg, transparent, rgba(96,165,250,0.35), transparent)" : "linear-gradient(90deg, transparent, rgba(37,99,235,0.18), transparent)" }}
        />
      </div>
      <div className={`relative mx-auto w-full max-w-[1280px] px-[20px] py-[72px] lg:px-[80px] lg:py-[120px] ${innerClassName}`}>{children}</div>
    </section>
  );
}

/** Two-tone section title: first line plain, `highlight` in animated blue. */
export function SectionTitle({
  lead,
  highlight,
  trail,
  tone,
  center = false,
  size = "lg",
  as: As = "h2",
}: {
  lead: string;
  highlight?: string;
  trail?: string;
  tone: "dark" | "light";
  center?: boolean;
  size?: "lg" | "xl";
  as?: "h2" | "h3";
}) {
  const [shimmerRef, shimmerClass] = useShimmer<HTMLHeadingElement>();
  const sizes = size === "xl" ? "text-[36px] sm:text-[44px] lg:text-[64px]" : "text-[32px] sm:text-[38px] lg:text-[52px]";
  return (
    <As
      ref={shimmerRef as never}
      className={`${sizes} font-semibold leading-[1.06] tracking-[-0.035em] ${center ? "text-center" : ""} ${shimmerClass}`}
      style={{ color: tone === "dark" ? C.textDark : C.textLight }}
    >
      <WordsReveal text={lead} />
      {highlight && (
        <>
          {" "}
          <WordsReveal text={highlight} delay={0.15} wordClassName="fyt-gradient-text" />
        </>
      )}
      {trail && (
        <>
          {" "}
          <WordsReveal text={trail} delay={0.25} />
        </>
      )}
    </As>
  );
}

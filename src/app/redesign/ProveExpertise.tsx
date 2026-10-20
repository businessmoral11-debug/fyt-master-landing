import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { C, Eyebrow, Reveal, Section, WordsReveal, staggerChild, staggerParent, useShimmer } from "./ui";

/**
 * "Prove your market expertise": FYT's answer in bold, the other-firm rule
 * struck through in red underneath. Compact two-column rows.
 */

type IconName = "scale" | "clock" | "doc" | "trend" | "calendar" | "news";

function Icon({ name }: { name: IconName }) {
  const p = { stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const paths: Record<IconName, ReactNode> = {
    scale: <><path d="M12 4v16M7 20h10M5 8h14" {...p} /><path d="m5 8-2.5 6a3 3 0 0 0 5 0L5 8ZM19 8l-2.5 6a3 3 0 0 0 5 0L19 8Z" {...p} /></>,
    clock: <><circle cx="12" cy="12" r="8" {...p} /><path d="M12 8v4.5l3 2" {...p} /></>,
    doc: <><path d="M7 3h7l4 4v14H7V3Z" {...p} /><path d="M14 3v4h4M10 12h5M10 16h5" {...p} /></>,
    trend: <><path d="M4 17 10 11l4 4 6-7" {...p} /><path d="M15 8h5v5" {...p} /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" {...p} /><path d="M4 10h16M9 3v4M15 3v4" {...p} /></>,
    news: <><rect x="4" y="5" width="13" height="14" rx="2" {...p} /><path d="M17 9h3v8a2 2 0 0 1-2 2M7.5 9h6M7.5 12.5h6M7.5 16h4" {...p} /></>,
  };
  return (
    <svg width={21} height={21} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const ROWS: { icon: IconName; problem: string; fix: string }[] = [
  { icon: "scale", problem: "Other firms: consistency rules", fix: "No consistency rule" },
  { icon: "clock", problem: "Other firms: 30-day time limits", fix: "No time limit" },
  { icon: "doc", problem: "Other firms: hidden rules at payout", fix: "Every rule written down" },
  { icon: "trend", problem: "Other firms: trailing drawdown", fix: "Static drawdown" },
  { icon: "calendar", problem: "Other firms: slow, delayed payouts", fix: "Rewards in 24-48h" },
  { icon: "news", problem: "Other firms: news and weekend bans", fix: "News and weekends allowed" },
];

/** Text that gets a red strike-through (on every wrapped line) once it scrolls into view. */
function StrikeText({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 1 });
  const reduce = useReducedMotion();
  const on = seen || !!reduce;
  return (
    <span
      ref={ref}
      className="text-[13px] leading-[1.4]"
      style={{
        color: "#98a0b3",
        textDecorationLine: "line-through",
        textDecorationThickness: "1.5px",
        textDecorationColor: on ? "rgba(239,68,68,0.75)" : "rgba(239,68,68,0)",
        transition: `text-decoration-color 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </span>
  );
}

export function ProveYourExpertise() {
  const reduce = useReducedMotion();
  const [titleRef, shimmer] = useShimmer<HTMLHeadingElement>();
  return (
    <Section tone="light">
      <div className="flex flex-col items-center gap-[16px] text-center">
        <Eyebrow tone="light" center>
          Why FYT
        </Eyebrow>
        <h2 ref={titleRef} className={`text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[40px] lg:text-[52px] ${shimmer}`} style={{ color: C.textLight }}>
          <WordsReveal text="Prove your" /> <WordsReveal text="market expertise." wordClassName="fyt-gradient-text" delay={0.12} />
        </h2>
        <Reveal delay={0.15}>
          <p className="max-w-[460px] text-[16px] leading-[1.6] lg:text-[18px]" style={{ color: C.mutedLight }}>
            Most traders don't fail on skill. They fail on rules. <span className="font-semibold" style={{ color: C.textLight }}>We removed them.</span>
          </p>
        </Reveal>
      </div>
      <motion.ul
        className="mx-auto mt-[36px] grid max-w-[1040px] grid-cols-1 gap-[12px] md:grid-cols-2 lg:mt-[52px] lg:gap-[14px]"
        variants={staggerParent(0.07)}
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {ROWS.map((c, i) => (
          <motion.li
            key={c.fix}
            variants={staggerChild}
            className="group flex items-center gap-[14px] rounded-[18px] bg-white p-[14px] transition-[translate,box-shadow] duration-300 hover:-translate-y-[2px] hover:shadow-[0_28px_60px_-30px_rgba(37,99,235,0.5)] sm:p-[18px]"
            style={{ border: `1px solid ${C.borderLight}`, boxShadow: "0 16px 36px -30px rgba(15,23,42,0.35)" }}
          >
            <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] text-[#2563eb] transition-colors duration-300 group-hover:bg-[#2563eb] group-hover:text-white" style={{ background: "#eef3ff" }}>
              <Icon name={c.icon} />
            </span>
            <span className="flex min-w-0 flex-col gap-[3px] text-left">
              <span className="text-[15.5px] font-semibold leading-[1.35] tracking-[-0.01em] sm:text-[16.5px]" style={{ color: "#0b1d4d" }}>
                {c.fix}
              </span>
              <StrikeText delay={0.4 + i * 0.08}>{c.problem}</StrikeText>
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}

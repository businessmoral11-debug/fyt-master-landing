/**
 * Email pop-up: "The FYT Private Giveaway". Replaces the Klaviyo form design.
 * Sign-ups go straight to Klaviyo (public client API, site key only) into the
 * "news letter subscribers" list, which starts the live Welcome Series flow.
 *
 * Shows once: after 20s or half-way down the page, never over another dialog
 * or the pricing table, at most once every 7 days, never again after sign-up.
 * Preview: ?giveaway=1 opens it straight away.
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const KLAVIYO_COMPANY_ID = "XqPQLC";
const KLAVIYO_LIST_ID = "TZ9Hd5"; // "news letter subscribers" -> Welcome Series (live)
const SEEN_KEY = "fyt_giveaway_seen_v1";
const DONE_KEY = "fyt_giveaway_done_v1";
const REPEAT_MS = 7 * 24 * 60 * 60 * 1000;
const EASE = [0.16, 1, 0.3, 1] as const;

function store(key: string, value?: string): string | null {
  try {
    if (value !== undefined) window.localStorage.setItem(key, value);
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

async function subscribe(email: string, name: string): Promise<boolean> {
  const body = {
    data: {
      type: "subscription",
      attributes: {
        custom_source: "FYT website pop-up (Private Giveaway)",
        profile: {
          data: {
            type: "profile",
            attributes: {
              email,
              ...(name ? { first_name: name } : {}),
              properties: { signup_source: "Website pop-up", signup_offer: "200K giveaway" },
            },
          },
        },
      },
      relationships: { list: { data: { type: "list", id: KLAVIYO_LIST_ID } } },
    },
  };
  try {
    const r = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/vnd.api+json", revision: "2024-10-15" },
      body: JSON.stringify(body),
    });
    return r.ok;
  } catch {
    return false;
  }
}

function otherDialogOpen(): boolean {
  return !!document.querySelector('[role="dialog"][aria-modal="true"]');
}

function pricingInView(): boolean {
  const el = document.getElementById("challenge");
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * 0.8 && r.bottom > window.innerHeight * 0.2;
}

/** Glossy "funded account" card: the prize, shown as an object instead of a paragraph. */
function PrizeCard() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className="relative mx-auto h-[150px] w-[250px] overflow-hidden rounded-[20px] p-[16px] text-left sm:h-[164px] sm:w-[272px]"
      style={{
        background: "linear-gradient(135deg, #3b7bff 0%, #1d4ed8 38%, #0f2a7a 70%, #0a1a4d 100%)",
        boxShadow: "0 30px 60px -24px rgba(37,99,235,0.9), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 0 0 1px rgba(191,219,254,0.25)",
      }}
      initial={reduce ? false : { rotate: -6, y: 14, opacity: 0 }}
      animate={{ rotate: -4, y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
    >
      {!reduce && (
        <motion.span className="pointer-events-none absolute inset-y-0 w-[45%]" style={{ background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent)" }} initial={{ left: "-60%" }} animate={{ left: ["-60%", "140%"] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }} />
      )}
      <span className="absolute -right-[40px] -top-[50px] size-[160px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent 65%)" }} />
      <div className="relative flex items-start justify-between">
        <span className="text-[9.5px] font-semibold uppercase leading-[1.25] tracking-[0.14em] text-white/85">Funding Your<br />Trades</span>
        <span className="rounded-full px-[8px] py-[3px] text-[9px] font-bold uppercase tracking-[0.12em] text-[#0a1a4d]" style={{ background: "linear-gradient(180deg,#fff,#dbeafe)" }}>Funded</span>
      </div>
      <span className="relative mt-[14px] block h-[22px] w-[30px] rounded-[5px]" style={{ background: "linear-gradient(135deg,#fde68a,#d4a73a)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)" }} />
      <div className="relative mt-[10px] flex items-end justify-between">
        <span className="flex flex-col">
          <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/70">Account balance</span>
          <span className="tabular text-[26px] font-bold leading-none tracking-[-0.02em] text-white sm:text-[28px]">$200,000</span>
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70">Winner</span>
      </div>
    </motion.div>
  );
}

function GiveawayDialog({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid || state === "sending") return;
    setState("sending");
    const ok = await subscribe(email.trim().toLowerCase(), name.trim());
    if (ok) {
      store(DONE_KEY, String(Date.now()));
      setState("done");
    } else setState("error");
  };

  const input = "h-[52px] w-full rounded-[14px] border-0 px-[16px] text-[15px] text-white outline-none transition-shadow placeholder:text-[#7f8aa6] focus:shadow-[0_0_0_2px_#60a5fa]";
  const inputStyle = { background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1px rgba(148,178,255,0.18)" };

  return createPortal(
    <motion.div className="fyt-rd fixed inset-0 z-[2147483100] flex items-end justify-center sm:items-center sm:p-[16px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="FYT Private Giveaway">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default border-0 p-0" style={{ background: "rgba(3,6,13,0.75)", backdropFilter: "blur(8px)" }} />
      <motion.div
        className="relative max-h-[94vh] w-full max-w-[440px] overflow-y-auto rounded-t-[28px] px-[22px] pb-[max(22px,env(safe-area-inset-bottom))] pt-[26px] text-center text-white sm:rounded-[28px] sm:px-[30px] sm:pb-[28px]"
        style={{ background: "radial-gradient(120% 55% at 50% 0%, #15307e 0%, #0a1433 55%, #060c1d 100%)", boxShadow: "0 0 0 1px rgba(147,197,253,0.22), 0 60px 120px -40px rgba(37,99,235,0.7), inset 0 1px 0 rgba(255,255,255,0.12)" }}
        initial={reduce ? false : { y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-[14px] top-[14px] z-[1] flex size-[34px] cursor-pointer items-center justify-center rounded-full border-0" style={{ background: "rgba(255,255,255,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <PrizeCard />

        <AnimatePresence mode="wait" initial={false}>
          {state !== "done" ? (
            <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -8 }} className="mt-[22px] flex flex-col items-center gap-[12px]" noValidate>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#93c5fd]">The FYT Private Giveaway</span>
              <h3 className="m-0 text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[31px]">
                A <span className="fyt-gradient-text">$200K</span> funded account.
                <br />
                Yours to win.
              </h3>
              <div className="mt-[2px] flex flex-col items-center gap-[8px]">
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8e98b0]">Your entry also unlocks</span>
                <div className="flex flex-wrap justify-center gap-[8px]">
                  {["45% OFF", "Free bonus account"].map((t) => (
                    <span key={t} className="flex items-center gap-[6px] rounded-full px-[12px] py-[6px] text-[12.5px] font-semibold text-[#dbeafe]" style={{ background: "rgba(59,130,246,0.16)", boxShadow: "inset 0 0 0 1px rgba(96,165,250,0.35)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-[6px] flex w-full flex-col gap-[10px]">
                <input type="email" inputMode="email" autoComplete="email" required placeholder="Enter your email address" aria-label="Email address" value={email} onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }} className={input} style={inputStyle} />
                <input type="text" autoComplete="given-name" placeholder="Your name" aria-label="Your name" value={name} onChange={(e) => setName(e.target.value)} className={input} style={inputStyle} />
              </div>
              <button
                type="submit"
                disabled={!valid || state === "sending"}
                className="relative mt-[4px] flex h-[56px] w-full cursor-pointer items-center justify-center gap-[8px] overflow-hidden rounded-[16px] border-0 text-[16px] font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "linear-gradient(180deg,#5b95ff,#2563eb 55%,#1d4ed8)", boxShadow: "0 18px 36px -14px rgba(37,99,235,0.95), inset 0 1px 0 rgba(255,255,255,0.3)" }}
              >
                {state === "sending" ? "Securing your entry..." : "Secure my entry"}
                {state !== "sending" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>}
              </button>
              {state === "error" && <span className="text-[12.5px] text-[#fca5a5]">Something went wrong. Please try again.</span>}
              <button type="button" onClick={onClose} className="cursor-pointer border-0 bg-transparent text-[13px] text-[#7f8aa6] hover:text-[#c7d2e6]">No thanks</button>
              <span className="text-[10.5px] leading-[1.4] text-[#5f6a85]">By entering you agree to receive emails from FundingYourTrades. Unsubscribe anytime.</span>
            </motion.form>
          ) : (
            <motion.div key="done" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }} className="mt-[22px] flex flex-col items-center gap-[12px]">
              <span className="flex size-[44px] items-center justify-center rounded-full bg-[#22c55e]" style={{ boxShadow: "0 12px 30px -10px rgba(34,197,94,0.8)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#04210f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              <h3 className="m-0 text-[26px] font-semibold leading-[1.1] tracking-[-0.03em]">You're in.</h3>
              <p className="m-0 text-[14.5px] leading-[1.5] text-[#c7d2e6]">Your entry is secured. Check your inbox for your 45% off code and bonus account.</p>
              <a
                href="#challenge"
                onClick={onClose}
                className="mt-[6px] flex h-[56px] w-full items-center justify-center gap-[8px] rounded-[16px] text-[16px] font-bold text-white no-underline"
                style={{ background: "linear-gradient(180deg,#5b95ff,#2563eb 55%,#1d4ed8)", boxShadow: "0 18px 36px -14px rgba(37,99,235,0.95)" }}
              >
                See accounts
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export function GiveawayPopup() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("giveaway") === "1";
    if (forced) {
      const t = window.setTimeout(() => setOpen(true), 800);
      return () => window.clearTimeout(t);
    }
    if (store(DONE_KEY)) return;
    const seen = Number(store(SEEN_KEY) || 0);
    if (seen && Date.now() - seen < REPEAT_MS) return;

    let fired = false;
    let retry = 0;
    const tryOpen = () => {
      if (fired) return;
      if (otherDialogOpen() || pricingInView()) {
        // Busy: try again shortly instead of interrupting.
        window.clearTimeout(retry);
        retry = window.setTimeout(tryOpen, 6000);
        return;
      }
      fired = true;
      store(SEEN_KEY, String(Date.now()));
      setOpen(true);
      cleanup();
    };
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && window.scrollY / h > 0.5) tryOpen();
    };
    const timer = window.setTimeout(tryOpen, 20000);
    window.addEventListener("scroll", onScroll, { passive: true });
    const cleanup = () => {
      window.clearTimeout(timer);
      window.clearTimeout(retry);
      window.removeEventListener("scroll", onScroll);
    };
    return cleanup;
  }, []);
  return <AnimatePresence>{open && <GiveawayDialog onClose={() => setOpen(false)} />}</AnimatePresence>;
}

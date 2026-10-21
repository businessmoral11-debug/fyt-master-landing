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
              properties: { signup_source: "Website pop-up", signup_offer: "200K giveaway + 45% off + bonus account + 5% wallet cashback" },
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

const PERKS = [
  { label: "45% OFF", sub: "on your challenge", d: "M3 12V4h8l10 10-8 8L3 12zM7.5 7.5h.01" },
  { label: "Free bonus", sub: "account instantly", d: "M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.2C7 7 9.5 7 12 7Zm0 0c1.5-3 5-3.5 5-1.2C17 7 14.5 7 12 7Z" },
  { label: "5% cashback", sub: "to your FYT wallet", d: "M3 7h15a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l12-4v4M16 14h.01" },
];

function Icon({ d, size = 16, color = "#93c5fd", w = 1.9 }: { d: string; size?: number; color?: string; w?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d={d} />
    </svg>
  );
}

/** Glossy "funded account" card: the prize as an object. Tilts with the pointer on desktop. */
function PrizeCard() {
  const reduce = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <div
      className="relative flex items-center justify-center [perspective:900px]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -10, y: ((e.clientX - r.left) / r.width - 0.5) * 14 });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 size-[200px] -translate-x-1/2 md:size-[260px] -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.45), transparent 62%)", filter: "blur(6px)" }} />
      <motion.div
        aria-hidden="true"
        className="relative h-[150px] w-[244px] overflow-hidden rounded-[20px] p-[16px] text-left sm:h-[172px] sm:w-[280px]"
        style={{
          background: "linear-gradient(135deg, #4b86ff 0%, #1d4ed8 36%, #102b7d 68%, #08154a 100%)",
          boxShadow: "0 34px 70px -26px rgba(37,99,235,0.95), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 0 0 1px rgba(191,219,254,0.28)",
          transformStyle: "preserve-3d",
        }}
        initial={reduce ? false : { rotateZ: -8, y: 18, opacity: 0 }}
        animate={{ rotateZ: -4, rotateX: tilt.x, rotateY: tilt.y, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
      >
        <span className="pointer-events-none absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 9px)" }} />
        {!reduce && (
          <motion.span className="pointer-events-none absolute inset-y-0 w-[45%]" style={{ background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.3), transparent)" }} initial={{ left: "-60%" }} animate={{ left: ["-60%", "140%"] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }} />
        )}
        <div className="relative flex items-start justify-between">
          <span className="text-[9.5px] font-semibold uppercase leading-[1.25] tracking-[0.16em] text-white/85">Funding Your<br />Trades</span>
          <span className="rounded-full px-[8px] py-[3px] text-[9px] font-bold uppercase tracking-[0.14em] text-[#08154a]" style={{ background: "linear-gradient(180deg,#fff,#dbeafe)" }}>Funded</span>
        </div>
        <span className="relative mt-[14px] block h-[22px] w-[30px] rounded-[5px] sm:mt-[18px]" style={{ background: "linear-gradient(135deg,#fde68a,#c9972e)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.18)" }} />
        <div className="relative mt-[10px] flex items-end justify-between">
          <span className="flex flex-col">
            <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/70">Account balance</span>
            <span className="tabular text-[26px] font-bold leading-none tracking-[-0.02em] text-white sm:text-[30px]">$200,000</span>
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/70">Winner</span>
        </div>
      </motion.div>
    </div>
  );
}

function Check({ size = 12 }: { size?: number }) {
  return <Icon d="M5 12.5l4.5 4.5L19 7.5" size={size} color="#4ade80" w={3} />;
}

function GiveawayDialog({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [typing, setTyping] = useState(false);
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

  const field = "group flex h-[52px] w-full items-center gap-[10px] rounded-[14px] px-[14px] transition-shadow focus-within:shadow-[0_0_0_2px_#60a5fa]";
  const fieldStyle = { background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(148,178,255,0.18)" };
  const input = "h-full w-full min-w-0 border-0 bg-transparent text-[16px] text-white outline-none placeholder:text-[#7f8aa6]";

  return createPortal(
    <motion.div className="fyt-rd fixed inset-0 z-[2147483100] flex items-end justify-center overscroll-none md:items-center md:p-[20px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="FYT Private Giveaway">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default touch-none border-0 p-0" style={{ background: "rgba(3,6,13,0.78)", backdropFilter: "blur(10px)" }} />
      <motion.div
        className="relative grid max-h-[92vh] max-h-[92dvh] w-full max-w-[860px] overflow-y-auto overflow-x-hidden overscroll-contain rounded-t-[28px] text-white md:grid-cols-[1fr_1.05fr] md:overflow-hidden md:rounded-[30px]"
        style={{ background: "#070d22", boxShadow: "0 0 0 1px rgba(147,197,253,0.2), 0 70px 140px -40px rgba(37,99,235,0.65)" }}
        initial={reduce ? false : { y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-[14px] top-[14px] z-[3] flex size-[34px] cursor-pointer items-center justify-center rounded-full border-0" style={{ background: "rgba(255,255,255,0.08)" }}>
          <Icon d="M6 6l12 12M18 6L6 18" size={14} color="#fff" w={2.2} />
        </button>

        {/* Visual side */}
        <div className={`relative flex-col items-center justify-center gap-[18px] overflow-hidden px-[22px] pb-[8px] pt-[30px] md:flex md:px-[30px] md:py-[44px] ${typing ? "hidden" : "flex"}`} style={{ background: "radial-gradient(90% 70% at 50% 35%, #1b3c9c 0%, #0b1840 55%, #070d22 100%)" }}>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(rgba(148,178,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,178,255,0.08) 1px, transparent 1px)", backgroundSize: "34px 34px", maskImage: "radial-gradient(70% 60% at 50% 40%, #000, transparent)", WebkitMaskImage: "radial-gradient(70% 60% at 50% 40%, #000, transparent)" }} />
          <PrizeCard />
          <span className="relative hidden items-center gap-[8px] rounded-full px-[12px] py-[6px] text-[11.5px] font-medium text-[#bfdbfe] md:inline-flex" style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1px rgba(148,178,255,0.2)" }}>
            <span className="relative flex size-[7px]">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#4ade80] opacity-60" />
              <span className="relative size-[7px] rounded-full bg-[#4ade80]" />
            </span>
            Entries open now
          </span>
        </div>

        {/* Form side */}
        <div className="relative px-[22px] pb-[max(22px,env(safe-area-inset-bottom))] pt-[18px] md:px-[34px] md:py-[40px]">
          <AnimatePresence mode="wait" initial={false}>
            {state !== "done" ? (
              <motion.form key="form" onSubmit={submit} onFocus={() => setTyping(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setTyping(false); }} exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-[14px] text-center md:text-left" noValidate>
                <span className="flex items-center justify-center gap-[10px] text-[10.5px] font-semibold uppercase tracking-[0.24em] text-[#93c5fd] md:justify-start">
                  <span className="h-px w-[22px] bg-[#3b82f6]" />
                  The FYT Private Giveaway
                </span>
                <h3 className="m-0 text-[29px] font-semibold leading-[1.06] tracking-[-0.035em] md:text-[34px]">
                  A <span className="fyt-gradient-text">$200K</span> funded account. Yours to win.
                </h3>
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-[#8e98b0]">Your entry also unlocks</span>
                  <div className="grid grid-cols-3 gap-[8px]">
                    {PERKS.map((k) => (
                      <div key={k.label} className="flex flex-col items-center gap-[6px] rounded-[14px] px-[6px] py-[10px] text-center md:items-start md:px-[10px] md:text-left" style={{ background: "linear-gradient(180deg, rgba(59,130,246,0.14), rgba(59,130,246,0.04))", boxShadow: "inset 0 0 0 1px rgba(96,165,250,0.22)" }}>
                        <span className="flex size-[28px] items-center justify-center rounded-[9px]" style={{ background: "rgba(59,130,246,0.2)" }}>
                          <Icon d={k.d} size={15} />
                        </span>
                        <span className="flex flex-col leading-tight">
                          <span className="text-[12.5px] font-semibold text-white">{k.label}</span>
                          <span className="text-[10.5px] text-[#8e98b0]">{k.sub}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-[2px] flex flex-col gap-[10px]">
                  <label className={field} style={fieldStyle}>
                    <Icon d="M4 6h16v12H4zM4 7l8 6 8-6" size={16} color="#7f8aa6" />
                    <input type="email" inputMode="email" autoComplete="email" required placeholder="Your email address" aria-label="Email address" value={email} onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }} className={input} />
                    {valid && <Check size={14} />}
                  </label>
                  <label className={field} style={fieldStyle}>
                    <Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" size={16} color="#7f8aa6" />
                    <input type="text" autoComplete="given-name" placeholder="Your name" aria-label="Your name" value={name} onChange={(e) => setName(e.target.value)} className={input} />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={!valid || state === "sending"}
                  className="relative flex h-[56px] w-full cursor-pointer items-center justify-center gap-[8px] overflow-hidden rounded-[16px] border-0 text-[16px] font-bold text-white transition-[opacity,transform] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  style={{ background: "linear-gradient(180deg,#5b95ff,#2563eb 55%,#1d4ed8)", boxShadow: "0 18px 36px -14px rgba(37,99,235,0.95), inset 0 1px 0 rgba(255,255,255,0.3)" }}
                >
                  {!reduce && valid && state === "idle" && (
                    <motion.span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-[40%]" style={{ background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.25), transparent)" }} initial={{ left: "-50%" }} animate={{ left: ["-50%", "130%"] }} transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }} />
                  )}
                  {state === "sending" ? "Securing your entry..." : "Secure my entry"}
                  {state !== "sending" && <Icon d="M5 12h14M13 6l6 6-6 6" size={16} color="#fff" w={2.6} />}
                </button>
                {state === "error" && <span className="text-[12.5px] text-[#fca5a5]">Something went wrong. Please try again.</span>}
                <div className="flex flex-col items-center gap-[6px] md:items-start">
                  <button type="button" onClick={onClose} className="cursor-pointer border-0 bg-transparent p-0 text-[13px] text-[#7f8aa6] hover:text-[#c7d2e6]">No thanks</button>
                  <span className="text-[10.5px] leading-[1.45] text-[#56617c]">By entering you agree to receive emails from FundingYourTrades. Unsubscribe anytime.</span>
                </div>
              </motion.form>
            ) : (
              <motion.div key="done" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }} className="flex flex-col items-center gap-[12px] text-center md:items-start md:py-[30px] md:text-left">
                <span className="flex size-[46px] items-center justify-center rounded-full bg-[#22c55e]" style={{ boxShadow: "0 12px 30px -10px rgba(34,197,94,0.8)" }}>
                  <Icon d="M5 12.5l4.5 4.5L19 7.5" size={20} color="#04210f" w={3} />
                </span>
                <h3 className="m-0 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em]">You're in.</h3>
                <p className="m-0 text-[14.5px] leading-[1.55] text-[#c7d2e6]">Your entry is secured. Your 45% off code, bonus account and 5% wallet cashback details are on their way to your inbox.</p>
                <a href="#challenge" onClick={onClose} className="mt-[6px] flex h-[56px] w-full items-center justify-center gap-[8px] rounded-[16px] text-[16px] font-bold text-white no-underline" style={{ background: "linear-gradient(180deg,#5b95ff,#2563eb 55%,#1d4ed8)", boxShadow: "0 18px 36px -14px rgba(37,99,235,0.95)" }}>
                  See accounts
                  <Icon d="M5 12h14M13 6l6 6-6 6" size={16} color="#fff" w={2.6} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

const TEASER_HIDE_KEY = "fyt_giveaway_teaser_hidden";

/** After "No thanks": a small tab bottom-left that reopens the giveaway. Never pushy. */
function GiveawayTeaser({ onOpen }: { onOpen: () => void }) {
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState(() => {
    try {
      return window.sessionStorage.getItem(TEASER_HIDE_KEY) === "1";
    } catch {
      return false;
    }
  });
  if (hidden) return null;
  return createPortal(
    <motion.div
      className="fyt-rd fixed z-[2147482970] flex items-center"
      style={{ left: "max(20px, env(safe-area-inset-left, 0px))", bottom: "calc(max(20px, env(safe-area-inset-bottom, 0px)) + 60px)" }}
      initial={reduce ? false : { opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <button type="button" onClick={onOpen} className="flex h-[38px] cursor-pointer items-center gap-[8px] rounded-full border-0 py-0 pl-[6px] pr-[12px] text-[12.5px] font-semibold text-white" style={{ background: "linear-gradient(180deg,#1d4ed8,#0f2a7a)", boxShadow: "0 12px 28px -10px rgba(37,99,235,0.9), inset 0 0 0 1px rgba(147,197,253,0.35)" }}>
        <span className="flex size-[26px] items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.14)" }}>
          <Icon d={PERKS[1].d} size={14} color="#fff" w={2} />
        </span>
        $200K giveaway
      </button>
      <button
        type="button"
        aria-label="Hide giveaway"
        onClick={() => {
          try {
            window.sessionStorage.setItem(TEASER_HIDE_KEY, "1");
          } catch {
            // ignore
          }
          setHidden(true);
        }}
        className="-ml-[6px] flex size-[20px] cursor-pointer items-center justify-center self-start rounded-full border-0"
        style={{ background: "#0b1230", boxShadow: "inset 0 0 0 1px rgba(147,197,253,0.3)" }}
      >
        <Icon d="M6 6l12 12M18 6L6 18" size={9} color="#c7d2e6" w={2.6} />
      </button>
    </motion.div>,
    document.body,
  );
}

export function GiveawayPopup() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(() => !!store(SEEN_KEY) && !store(DONE_KEY));
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
    let timer = 0;
    const cleanup = () => {
      window.clearTimeout(timer);
      window.clearTimeout(retry);
      window.removeEventListener("scroll", onScroll);
    };
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
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && window.scrollY / h > 0.5) tryOpen();
    }
    timer = window.setTimeout(tryOpen, 20000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, []);
  const close = () => {
    setOpen(false);
    setTeaser(!store(DONE_KEY));
  };
  return (
    <>
      <AnimatePresence>{open && <GiveawayDialog onClose={close} />}</AnimatePresence>
      {teaser && !open && <GiveawayTeaser onOpen={() => setOpen(true)} />}
    </>
  );
}

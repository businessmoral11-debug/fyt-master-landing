import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  fetchFeaturedPayouts,
  countryFlagUrl,
  truncateHash,
  formatPayoutTime,
  formatPayoutAmount,
  type PublicPayout,
  type ApiPagination,
} from "@/app/api/rewardsApi";

const PAGE_SIZE = 10;
const POLL_INTERVAL_MS = 30000;


function usePayoutsFeed(active: boolean) {
  const [page, setPage] = useState(1);
  const [payouts, setPayouts] = useState<PublicPayout[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const hasLoadedRef = useRef(false);
  const initialIdsRef = useRef<Set<string> | null>(null);
  const loadRef = useRef<() => void>(() => {});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (hasLoadedRef.current) setRefreshing(true);
      try {
        const res = await fetchFeaturedPayouts(page, PAGE_SIZE);
        if (cancelled) return;
        if (initialIdsRef.current === null) {
          initialIdsRef.current = new Set(res.data.map((p, i) => p.id ?? `row-${i}`));
        }
        setPayouts(res.data);
        setPagination(res.meta.pagination);
        setError(false);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (cancelled) return;
        hasLoadedRef.current = true;
        setLoading(false);
        setRefreshing(false);
      }
    }

    loadRef.current = () => void load();
    void load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  useEffect(() => {
    if (page !== 1 || !active) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      loadRef.current();
    }, POLL_INTERVAL_MS);
    function onVisibilityChange() {
      if (!document.hidden) loadRef.current();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [page, active]);

  const isInitialRow = useCallback((id: string | null, index: number) => {
    const key = id ?? `row-${index}`;
    return initialIdsRef.current?.has(key) ?? false;
  }, []);

  return { payouts, pagination, page, setPage, loading, refreshing, error, isInitialRow };
}

function getCertificateState(payout: PublicPayout): "ready" | "generating" | "unavailable" {
  if (payout.certificateUrl) return "ready";
  if (!payout.createdAt) return "unavailable";
  const ageMs = Date.now() - new Date(payout.createdAt).getTime();
  return ageMs < 10 * 60 * 1000 ? "generating" : "unavailable";
}


function PulseDot({ color }: { color: string }) {
  return (
    <span className="relative inline-flex size-[6px] shrink-0">
      <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: color }} />
      <span className="relative inline-flex rounded-full size-[6px]" style={{ background: color }} />
    </span>
  );
}

function LiveIndicator() {
  return (
    <span className="hidden sm:flex items-center gap-[6px]">
      <PulseDot color="#10b981" />
      <span className="font-['Inter',sans-serif] font-medium text-[12px] text-[#5a6478]">Live</span>
    </span>
  );
}

function StatusBadge({ payout }: { payout: PublicPayout }) {
  const status: "CONFIRMED" | "PENDING" | "FAILED" = payout.explorerUrl ? "CONFIRMED" : "PENDING";
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  const bg = status === "CONFIRMED" ? "#ecfdf5" : status === "FAILED" ? "#fef2f2" : "#fffbeb";
  const text = status === "CONFIRMED" ? "#059669" : status === "FAILED" ? "#dc2626" : "#d97706";
  return (
    <span className="inline-flex items-center gap-[6px] h-5 rounded-full px-[10px] text-[12px] font-medium whitespace-nowrap" style={{ background: bg, color: text }}>
      {status === "PENDING" && <PulseDot color={text} />}
      {label}
    </span>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M3 9l6-6M4.5 3H9v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="animate-spin">
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.6" strokeOpacity="0.25" />
      <path d="M14.2 8a6.2 6.2 0 0 0-6.2-6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TransactionLink({ hash, explorerUrl }: { hash: string | null; explorerUrl: string | null }) {
  if (!hash || !explorerUrl) {
    return <span className="text-[13px] text-[#8b93a6]">-</span>;
  }
  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group/tx inline-flex items-center gap-[4px] font-mono text-[13px] text-[#5a6478] no-underline truncate max-w-full"
    >
      <span className="truncate">{truncateHash(hash)}</span>
      <ArrowUpRightIcon className="shrink-0 text-[#8b93a6] transition-colors duration-200 group-hover/tx:text-[#2563ff]" />
    </a>
  );
}

function CertificateButton({ payout }: { payout: PublicPayout }) {
  const state = getCertificateState(payout);
  if (state === "ready") {
    return (
      <a
        href={payout.certificateUrl!}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-[6px] h-8 px-[14px] rounded-full text-[13px] font-medium no-underline whitespace-nowrap transition-colors duration-200 border border-[rgba(37,99,255,0.3)] bg-[rgba(37,99,255,0.1)] text-[#2563ff] hover:border-[rgba(37,99,255,0.5)] hover:bg-[rgba(37,99,255,0.2)] hover:text-[#0a1020]"
      >
        View Certificate
        <ArrowUpRightIcon />
      </a>
    );
  }
  if (state === "generating") {
    return (
      <span className="inline-flex items-center gap-[6px] h-8 px-[14px] rounded-full text-[13px] font-medium whitespace-nowrap border border-[#e6ebf4] text-[#8b93a6]">
        <SpinnerIcon />
        Generating…
      </span>
    );
  }
  return (
    <span className="inline-flex items-center h-8 px-[14px] rounded-full text-[13px] font-medium whitespace-nowrap border border-[#e6ebf4] text-[#8b93a6] cursor-not-allowed">
      Unavailable
    </span>
  );
}

function CountryCell({ country, countryCode }: { country: string | null; countryCode: string | null }) {
  if (!country) return <span className="text-[13px] text-[#8b93a6]">-</span>;
  const flagUrl = countryFlagUrl(countryCode);
  return (
    <span className="inline-flex items-center gap-[6px] text-[13px] text-[#5a6478] whitespace-nowrap min-w-0">
      {flagUrl && <img src={flagUrl} alt="" aria-hidden="true" className="h-[11px] w-[15px] object-cover rounded-[2px] shrink-0" loading="lazy" />}
      <span className="truncate">{country}</span>
    </span>
  );
}

const ROW_TRANSITION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
function rowTransition(isInitial: boolean, index: number) {
  return { duration: 0.55, ease: ROW_TRANSITION_EASE, delay: isInitial ? Math.min(index, 9) * 0.045 : 0 };
}


const COLUMNS = [
  { label: "Trader", width: "16%" },
  { label: "Country", width: "13%" },
  { label: "Payout Amount", width: "11%" },
  { label: "Transaction", width: "15%" },
  { label: "Status", width: "10%" },
  { label: "Time", width: "17%" },
  { label: "Certificate", width: "18%" },
];

function DesktopRow({ payout, index, isInitial }: { payout: PublicPayout; index: number; isInitial: boolean }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={rowTransition(isInitial, index)}
      whileHover={{ y: -1 }}
      className="border-t border-[#e6ebf4] hover:bg-[#f6f8fc] transition-colors duration-200"
    >
      <td className="px-4 py-3.5 first:pl-6">
        <p className="text-[14px] font-medium text-[#0a1020] truncate">{payout.traderName ?? "Unknown Trader"}</p>
      </td>
      <td className="px-4 py-3.5">
        <CountryCell country={payout.country} countryCode={payout.countryCode} />
      </td>
      <td className="px-4 py-3.5">
        <p className="text-[15px] font-bold tabular-nums text-[#0a1020]">{formatPayoutAmount(payout.amount)}</p>
      </td>
      <td className="px-4 py-3.5 max-w-0">
        <TransactionLink hash={payout.id} explorerUrl={payout.explorerUrl} />
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge payout={payout} />
      </td>
      <td className="px-4 py-3.5">
        <p className="text-[13px] text-[#5a6478] whitespace-nowrap">{payout.createdAt ? formatPayoutTime(payout.createdAt) : "-"}</p>
      </td>
      <td className="px-4 py-3.5 last:pr-6">
        <CertificateButton payout={payout} />
      </td>
    </motion.tr>
  );
}

function DesktopTable({ payouts, isInitialRow }: { payouts: PublicPayout[]; isInitialRow: (id: string | null, index: number) => boolean }) {
  return (
    <table className="hidden md:table w-full table-fixed border-collapse">
      <colgroup>
        {COLUMNS.map((c) => (
          <col key={c.label} style={{ width: c.width }} />
        ))}
      </colgroup>
      <thead>
        <tr className="bg-[rgba(255,255,255,0.9)]">
          {COLUMNS.map((c, i) => (
            <th
              key={c.label}
              className={`text-left font-['Inter',sans-serif] font-semibold text-[11px] uppercase tracking-wide text-[#8b93a6] py-3.5 ${i === 0 ? "pl-6 pr-4" : i === COLUMNS.length - 1 ? "pl-4 pr-6" : "px-4"}`}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#e6ebf4]">
        <AnimatePresence initial={false}>
          {payouts.map((payout, i) => (
            <DesktopRow key={payout.id ?? `row-${i}`} payout={payout} index={i} isInitial={isInitialRow(payout.id, i)} />
          ))}
        </AnimatePresence>
      </tbody>
    </table>
  );
}


function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MobileRow({ payout, index, isInitial }: { payout: PublicPayout; index: number; isInitial: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={rowTransition(isInitial, index)}
      className="flex flex-col gap-[10px] px-5 py-4 border-t border-[#e6ebf4] first:border-t-0"
    >
      <div className="flex items-center justify-between gap-[12px]">
        <p className="text-[14.5px] font-medium text-[#0a1020] truncate">{payout.traderName ?? "Unknown Trader"}</p>
        <p className="text-[15px] font-bold tabular-nums text-[#0a1020] shrink-0">{formatPayoutAmount(payout.amount)}</p>
      </div>
      <div className="flex items-center justify-between gap-[12px] text-[13px]">
        <CountryCell country={payout.country} countryCode={payout.countryCode} />
        <StatusBadge payout={payout} />
      </div>
      <div className="flex items-center justify-between gap-[12px] text-[12px] text-[#8b93a6]">
        <TransactionLink hash={payout.id} explorerUrl={payout.explorerUrl} />
        <span className="whitespace-nowrap">{payout.createdAt ? formatPayoutTime(payout.createdAt) : "-"}</span>
      </div>
      <CertificateButton payout={payout} />
    </motion.div>
  );
}

const MOBILE_INITIAL_COUNT = 6;

function MobileList({ payouts, isInitialRow }: { payouts: PublicPayout[]; isInitialRow: (id: string | null, index: number) => boolean }) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = payouts.length > MOBILE_INITIAL_COUNT;
  const visiblePayouts = expanded ? payouts : payouts.slice(0, MOBILE_INITIAL_COUNT);

  return (
    <div className="md:hidden">
      <AnimatePresence initial={false}>
        {visiblePayouts.map((payout, i) => (
          <MobileRow key={payout.id ?? `row-${i}`} payout={payout} index={i} isInitial={isInitialRow(payout.id, i)} />
        ))}
      </AnimatePresence>
      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="w-full flex items-center justify-center gap-[6px] py-3.5 border-t border-[#e6ebf4] text-[13px] font-medium text-[#2563ff] hover:bg-[#f6f8fc] transition-colors duration-200 cursor-pointer"
        >
          {expanded ? "Show Less" : "View More"}
          <ChevronDownIcon className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}


function SkeletonBlock({ className }: { className: string }) {
  return <div className={`rounded-[6px] bg-[#eef2fa] animate-pulse ${className}`} />;
}

function TableSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-[16px] px-6 py-3.5 border-t border-[#e6ebf4] first:border-t-0">
          <SkeletonBlock className="h-[14px] w-[18%]" />
          <SkeletonBlock className="hidden sm:block h-[14px] w-[14%]" />
          <SkeletonBlock className="h-[14px] w-[10%]" />
          <SkeletonBlock className="hidden md:block h-[14px] w-[16%]" />
          <SkeletonBlock className="hidden sm:block h-[18px] w-[10%] rounded-full" />
          <SkeletonBlock className="hidden lg:block h-[14px] w-[16%]" />
          <SkeletonBlock className="h-[28px] w-[16%] rounded-full" />
        </div>
      ))}
    </div>
  );
}

function CenteredMessage({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-10">
      <p className="text-[14px] text-[#5a6478]">{text}</p>
    </div>
  );
}


function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const filtered = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of filtered) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

function PaginationBar({ pagination, page, setPage }: { pagination: ApiPagination; page: number; setPage: (p: number) => void }) {
  const { pageSize, totalItems, totalPages, hasNextPage, hasPreviousPage } = pagination;
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const pages = useMemo(() => buildPageList(page, totalPages), [page, totalPages]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] border-t border-[#e6ebf4] px-6 py-4">
      <p className="text-[12px] text-[#5a6478]">
        Showing {from}–{to} of {totalItems} payouts
      </p>
      <div className="flex items-center gap-[6px]">
        <button
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => setPage(page - 1)}
          className={`text-[13px] font-medium px-[10px] py-[6px] rounded-[6px] text-[#5a6478] transition-colors duration-200 ${hasPreviousPage ? "hover:bg-[#eef2fa] cursor-pointer" : "opacity-30 pointer-events-none"}`}
        >
          Previous
        </button>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="px-[6px] text-[13px] text-[#8b93a6]">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`size-[28px] rounded-[6px] text-[13px] font-medium transition-colors duration-200 ${
                p === page ? "bg-[#2563ff] text-white" : "text-[#5a6478] hover:bg-[#eef2fa]"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => setPage(page + 1)}
          className={`text-[13px] font-medium px-[10px] py-[6px] rounded-[6px] text-[#5a6478] transition-colors duration-200 ${hasNextPage ? "hover:bg-[#eef2fa] cursor-pointer" : "opacity-30 pointer-events-none"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}


export function RecentVerifiedRewards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => setActive(!!entries[0]?.isIntersecting), {
      rootMargin: "600px 0px 600px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { payouts, pagination, page, setPage, loading, refreshing, error, isInitialRow } = usePayoutsFeed(active);
  const reduceMotion = useReducedMotion();

  return (
    <div ref={sectionRef} className="w-full max-w-[1400px] mx-auto font-['Inter',sans-serif]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[8px] text-center sm:text-left">
        <h2 className="text-[17px] sm:text-[18px] font-bold tracking-tight text-[#0a1020]">Recent Verified Rewards</h2>
        <LiveIndicator />
      </div>

      <div className="mt-5 bg-white rounded-xl border border-[#e6ebf4] overflow-hidden" style={{ boxShadow: "0 30px 90px -40px rgba(10,16,32,0.10)" }}>
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <CenteredMessage text="Couldn't reach the payout feed right now." />
        ) : payouts.length === 0 ? (
          <CenteredMessage text="No confirmed payouts yet." />
        ) : (
          <motion.div
            animate={{ opacity: refreshing && !reduceMotion ? 0.6 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <DesktopTable payouts={payouts} isInitialRow={isInitialRow} />
            <MobileList payouts={payouts} isInitialRow={isInitialRow} />
          </motion.div>
        )}
        {!loading && !error && pagination && pagination.totalItems > 0 && (
          <PaginationBar pagination={pagination} page={page} setPage={setPage} />
        )}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { fetchFeaturedCertificates, formatPayoutAmount, type PublicCertificate } from "@/app/api/rewardsApi";

const CERTS_PAGE_SIZE = 24;
const AUTO_ADVANCE_MS = 4000;
const RESUME_DELAY_MS = 1500;
const CARD_WIDTH_PX = 262;
const CARD_GAP_PX = 16;

function withSessionCacheBust(url: string, token: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}v=${token}`;
}

function useCertificatesFeed() {
  const [items, setItems] = useState<PublicCertificate[]>([]);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const inFlightRef = useRef(false);
  const cacheBustTokenRef = useRef<string>(String(Date.now()));

  const loadPage = useCallback(async (targetPage: number) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    if (targetPage > 1) setLoadingMore(true);
    try {
      const res = await fetchFeaturedCertificates(targetPage, CERTS_PAGE_SIZE);
      let data = res.data
        .filter((c) => !seenIdsRef.current.has(c.certificateId))
        .map((c) => ({ ...c, imageUrl: withSessionCacheBust(c.imageUrl, cacheBustTokenRef.current) }));
      if (targetPage === 1 && data.length > 0) {
        const leadIndex = Math.floor(Date.now() / (4 * 60 * 60 * 1000)) % data.length;
        data = [...data.slice(leadIndex), ...data.slice(0, leadIndex)];
      }
      data.forEach((c) => seenIdsRef.current.add(c.certificateId));
      setItems((prev) => [...prev, ...data]);
      setHasNextPage(res.meta.pagination.hasNextPage);
      setPage(targetPage);
      setError(false);
    } catch {
      setError(true);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void loadPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (!hasNextPage || inFlightRef.current) return;
    void loadPage(page + 1);
  }, [hasNextPage, page, loadPage]);

  return { items, loading, loadingMore, error, hasNextPage, loadMore };
}


function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d={direction === "left" ? "M10 3.5 5 8l5 4.5" : "M6 3.5 11 8l-5 4.5"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ImageOffIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" opacity="0.4">
      <path d="M3 3l18 18M8.5 5H18a2 2 0 0 1 2 2v9.5M4 8.5V17a2 2 0 0 0 2 2h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}


function CertificateCard({
  cert,
  index,
  eager,
  shouldLoad,
  registerEl,
  onInteract,
}: {
  cert: PublicCertificate;
  index: number;
  eager: boolean;
  shouldLoad: boolean;
  registerEl: (id: string, el: HTMLDivElement | null) => void;
  onInteract: () => void;
}) {
  const [broken, setBroken] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.dataset.tiltX = String(py * -5);
    el.dataset.tiltY = String(px * 5);
  }
  function onMouseLeave() {
    const el = tiltRef.current;
    if (!el) return;
    el.dataset.tiltX = "0";
    el.dataset.tiltY = "0";
  }

  return (
    <div
      ref={(el) => registerEl(cert.certificateId, el)}
      data-cert-card
      data-cert-id={cert.certificateId}
      className="group/cert relative shrink-0 snap-center"
      style={{ width: CARD_WIDTH_PX, transformStyle: "preserve-3d" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onFocus={onInteract}
    >
      <div
        className={reduceMotion ? "" : "cert-card-float"}
        style={reduceMotion ? undefined : { animationDelay: `${(index % 5) * 0.35}s` }}
      >
        <div ref={tiltRef} data-tilt-layer style={{ transformStyle: "preserve-3d" }}>
          <a
            href={cert.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onInteract}
            className="cert-card-face block w-full relative overflow-hidden rounded-xl hover:-translate-y-1 cursor-pointer no-underline"
            style={{ aspectRatio: "3 / 2", background: "#0a0f1c" }}
          >
            {broken ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-[8px] text-[#5a6478]">
                <ImageOffIcon />
                <span className="text-[12px]">Preview unavailable</span>
              </div>
            ) : shouldLoad ? (
              <img
                src={cert.imageUrl}
                alt={`Reward certificate, ${formatPayoutAmount(cert.amount)} awarded to ${cert.traderName ?? "a trader"}`}
                loading={eager ? "eager" : "lazy"}
                fetchpriority={eager ? "high" : undefined}
                onError={() => setBroken(true)}
                className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover/cert:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 animate-pulse" style={{ background: "#131a2b" }} aria-hidden="true" />
            )}
          </a>
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="shrink-0 rounded-xl bg-[#1a2233] animate-pulse" style={{ width: CARD_WIDTH_PX, aspectRatio: "3 / 2" }} />
  );
}


export function FeaturedCertificates() {
  const { items, loading, error, hasNextPage, loadMore } = useCertificatesFeed();
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const cardElsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const isHoveringRef = useRef(false);
  const pausedUntilRef = useRef(0);
  const isNearViewportRef = useRef(true);

  const [visibleIds, setVisibleIds] = useState<Set<string>>(() => new Set());
  const imageObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    imageObserverRef.current = new IntersectionObserver(
      (entries) => {
        const newlyVisible = entries.filter((e) => e.isIntersecting).map((e) => (e.target as HTMLElement).dataset.certId).filter((id): id is string => !!id);
        if (newlyVisible.length === 0) return;
        setVisibleIds((prev) => {
          if (newlyVisible.every((id) => prev.has(id))) return prev;
          const next = new Set(prev);
          newlyVisible.forEach((id) => next.add(id));
          return next;
        });
      },
      { rootMargin: "0px 400px 0px 400px" },
    );
    return () => imageObserverRef.current?.disconnect();
  }, []);

  const registerEl = useCallback((id: string, el: HTMLDivElement | null) => {
    const prevEl = cardElsRef.current.get(id);
    if (prevEl && imageObserverRef.current) imageObserverRef.current.unobserve(prevEl);
    if (el) {
      cardElsRef.current.set(id, el);
      imageObserverRef.current?.observe(el);
    } else {
      cardElsRef.current.delete(id);
    }
  }, []);

  function pauseForAWhile() {
    pausedUntilRef.current = Date.now() + RESUME_DELAY_MS;
  }

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    let lastScrollLeft = trackRef.current?.scrollLeft ?? 0;
    let idleFrames = 0;
    let isVisible = true;
    let forceRecompute = false;

    function tick() {
      if (!isVisible) return;
      const track = trackRef.current;
      if (track) {
        const scrollLeft = track.scrollLeft;
        const velocity = scrollLeft - lastScrollLeft;
        lastScrollLeft = scrollLeft;

        const blurPx = Math.min(Math.abs(velocity) * 0.15, 2.5);
        if (Math.abs(velocity) < 0.15) idleFrames++;
        else idleFrames = 0;

        const maxScroll = track.scrollWidth - track.clientWidth;
        if (hasNextPage && maxScroll - scrollLeft < (CARD_WIDTH_PX + CARD_GAP_PX) * 6) {
          loadMore();
        }

        if (idleFrames <= 2 || forceRecompute) {
          forceRecompute = false;
          track.style.filter = idleFrames > 1 || blurPx < 0.05 ? "none" : `blur(${blurPx}px)`;
          const rect = track.getBoundingClientRect();
          const viewportCenter = rect.left + rect.width / 2;
          cardElsRef.current.forEach((el) => {
            const cardRect = el.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = (cardCenter - viewportCenter) / cardRect.width;
            const rotateY = Math.max(-32, Math.min(32, distance * 22));
            const scale = 1 - Math.min(Math.abs(distance), 2.4) * 0.045;
            const opacity = Math.max(0, 1 - Math.min(Math.abs(distance), 3.2) * 0.1);
            const tiltLayer = el.querySelector<HTMLDivElement>("[data-tilt-layer]");
            const tiltX = Number(tiltLayer?.dataset.tiltX ?? 0);
            const tiltY = Number(tiltLayer?.dataset.tiltY ?? 0);
            el.style.transform = `rotateY(${rotateY}deg) scale(${scale})`;
            el.style.opacity = String(opacity);
            if (tiltLayer) tiltLayer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
          });
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    function onResize() {
      forceRecompute = true;
    }
    window.addEventListener("resize", onResize);

    let observer: IntersectionObserver | undefined;
    const el = trackRef.current;
    if (el && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          const nowVisible = !!entries[0]?.isIntersecting;
          isNearViewportRef.current = nowVisible;
          if (nowVisible && !isVisible) {
            isVisible = true;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(tick);
          } else {
            isVisible = nowVisible;
          }
        },
        { rootMargin: "600px 0px 600px 0px" },
      );
      observer.observe(el);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, [reduceMotion, hasNextPage, loadMore]);

  useEffect(() => {
    if (reduceMotion || items.length === 0) return;
    const id = setInterval(() => {
      if (!isNearViewportRef.current || isHoveringRef.current || Date.now() < pausedUntilRef.current) return;
      const track = trackRef.current;
      if (!track) return;
      const step = CARD_WIDTH_PX + CARD_GAP_PX;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - step / 2) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: step, behavior: "smooth" });
      }
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, items.length]);

  function scrollByCard(dir: 1 | -1) {
    pauseForAWhile();
    trackRef.current?.scrollBy({ left: dir * (CARD_WIDTH_PX + CARD_GAP_PX), behavior: "smooth" });
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto font-['Inter',sans-serif]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-[8px] text-center sm:text-left">
        <h2 className="text-[17px] sm:text-[18px] font-bold tracking-tight text-[#0a1020]">Featured Reward Certificates</h2>
      </div>

      <div className="relative mt-5">
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-center py-10 text-[14px] text-[#5a6478]">Couldn't reach the certificate feed right now. Retrying automatically.</p>
        ) : items.length === 0 ? (
          <p className="text-center py-10 text-[14px] text-[#5a6478]">No certificates generated yet.</p>
        ) : (
          <>
            <button
              type="button"
              aria-label="Previous certificate"
              onClick={() => scrollByCard(-1)}
              className="hidden md:flex items-center justify-center absolute left-[-16px] top-1/2 -translate-y-1/2 z-10 size-[36px] rounded-full bg-white text-[#5a6478] shadow-[0_8px_24px_rgba(10,16,32,0.15)] border border-[#e6ebf4] transition-colors duration-200 hover:text-[#2563ff]"
            >
              <ChevronIcon direction="left" />
            </button>
            <div
              ref={trackRef}
              className="cert-track flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory"
              style={{ perspective: reduceMotion ? undefined : 1400 }}
              onMouseEnter={() => { isHoveringRef.current = true; }}
              onMouseLeave={() => { isHoveringRef.current = false; pauseForAWhile(); }}
              onTouchStart={() => { isHoveringRef.current = true; }}
              onTouchEnd={() => { isHoveringRef.current = false; pauseForAWhile(); }}
              onWheel={() => pauseForAWhile()}
            >
              {items.map((cert, i) => (
                <CertificateCard
                  key={cert.certificateId}
                  cert={cert}
                  index={i}
                  eager={i < 5}
                  shouldLoad={i < 5 || visibleIds.has(cert.certificateId)}
                  registerEl={registerEl}
                  onInteract={pauseForAWhile}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next certificate"
              onClick={() => scrollByCard(1)}
              className="hidden md:flex items-center justify-center absolute right-[-16px] top-1/2 -translate-y-1/2 z-10 size-[36px] rounded-full bg-white text-[#5a6478] shadow-[0_8px_24px_rgba(10,16,32,0.15)] border border-[#e6ebf4] transition-colors duration-200 hover:text-[#2563ff]"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
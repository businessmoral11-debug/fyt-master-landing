
import { API_BASE_URL } from "@/app/api/apiBaseUrl";

const REWARDS_API_BASE = `${API_BASE_URL}/public`;

const FETCH_TIMEOUT_MS = 6000;
function timeoutSignal(): AbortSignal | undefined {
  return typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(FETCH_TIMEOUT_MS) : undefined;
}

export interface PublicPayout {
  id: string | null;
  traderName: string | null;
  country: string | null;
  countryCode: string | null;
  amount: string;
  createdAt: string | null;
  explorerUrl: string | null;
  certificateUrl: string | null;
}

export interface PublicCertificate {
  certificateId: string;
  traderName: string | null;
  country: string | null;
  countryCode: string | null;
  amount: string;
  createdAt: string;
  imageUrl: string;
  certificateUrl: string;
}

export interface ApiPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: { pagination: ApiPagination };
}

export async function fetchFeaturedPayouts(page: number, limit = 10): Promise<ApiEnvelope<PublicPayout>> {
  const res = await fetch(`${REWARDS_API_BASE}/featured-payouts?limit=${limit}&page=${page}&sort=latest`, {
    signal: timeoutSignal(),
  });
  if (!res.ok) throw new Error(`featured-payouts fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchFeaturedCertificates(page: number, limit = 24): Promise<ApiEnvelope<PublicCertificate>> {
  const res = await fetch(`${REWARDS_API_BASE}/featured-certificates?limit=${limit}&page=${page}&sort=latest`, {
    signal: timeoutSignal(),
  });
  if (!res.ok) throw new Error(`featured-certificates fetch failed: ${res.status}`);
  return res.json();
}

export function countryFlagEmoji(countryCode: string | null): string {
  if (!countryCode || countryCode.length !== 2) return "";
  const codePoints = [...countryCode.toUpperCase()].map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function countryFlagUrl(countryCode: string | null): string | null {
  if (!countryCode || countryCode.length !== 2) return null;
  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
}

export function truncateHash(hash: string): string {
  if (hash.length <= 18) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export function formatPayoutTime(iso: string): string {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" });
  const timePart = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${datePart}, ${timePart}`;
}

export function formatPayoutAmount(amount: string): string {
  const num = Number(amount);
  if (!Number.isFinite(num)) return `$${amount}`;
  const hasFraction = Math.round((num % 1) * 100) !== 0;
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: hasFraction ? 2 : 0, maximumFractionDigits: 2 })}`;
}

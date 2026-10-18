import { STEP_LABELS, fmtSize, getEntry, type PlanId, type PlatformId, type StepId } from "@/app/data/pricing";
import { pauseHeavyScenesForNav } from "@/app/three/scenePause";

/** A plan the visitor picked (plan finder or pricing picker), kept in this browser only. */
export interface SavedPlan {
  step: StepId;
  plan: PlanId;
  platform: PlatformId;
  size: number;
  savedAt: number;
}

const SAVED_PLAN_KEY = "fyt_saved_plan_v1";
const LAST_VISIT_KEY = "fyt_last_visit_v1";

export function readSavedPlan(): SavedPlan | null {
  try {
    const raw = window.localStorage.getItem(SAVED_PLAN_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as SavedPlan;
    if (!p || !getEntry(p.step, p.plan, p.platform, p.size)) return null;
    return p;
  } catch {
    return null;
  }
}

export function writeSavedPlan(p: Omit<SavedPlan, "savedAt">) {
  try {
    window.localStorage.setItem(SAVED_PLAN_KEY, JSON.stringify({ ...p, savedAt: Date.now() }));
  } catch {
    // Storage blocked (private mode): nothing to remember.
  }
}

/** Returns the previous visit time (0 if first visit) and stamps this one. */
export function stampVisit(): number {
  try {
    const last = Number(window.localStorage.getItem(LAST_VISIT_KEY) || 0);
    window.localStorage.setItem(LAST_VISIT_KEY, String(Date.now()));
    return Number.isFinite(last) ? last : 0;
  } catch {
    return 0;
  }
}

export function savedPlanLabel(p: Pick<SavedPlan, "step" | "size">): string {
  return `${fmtSize(p.size)} ${STEP_LABELS[p.step]}`;
}

/** Pricing listens for this and switches its picker to the given plan. */
export const SELECT_PLAN_EVENT = "fyt:select-plan";

export function selectPlanInPricing(p: Partial<Omit<SavedPlan, "savedAt">>) {
  window.dispatchEvent(new CustomEvent(SELECT_PLAN_EVENT, { detail: p }));
  pauseHeavyScenesForNav();
  document.getElementById("challenge")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Where "Email me this plan" and "Free demo" requests are sent. Empty until the
 * CRM / email platform gives us an endpoint (set VITE_LEAD_ENDPOINT on Vercel).
 */
export const LEAD_ENDPOINT = ((import.meta.env.VITE_LEAD_ENDPOINT as string | undefined) || "").trim();

export async function submitLead(kind: "saved-plan" | "free-demo", email: string, extra: Record<string, unknown> = {}): Promise<void> {
  if (!LEAD_ENDPOINT) return;
  try {
    await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, email, ...extra, page: window.location.href, at: new Date().toISOString() }),
    });
  } catch {
    // Network error: the visitor still sees the confirmation; the plan is also saved locally.
  }
}

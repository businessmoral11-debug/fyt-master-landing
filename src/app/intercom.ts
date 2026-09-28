declare global {
  interface Window {
    Intercom?: ((command: string, ...args: unknown[]) => void) & {
      q?: unknown[];
      c?: (args: IArguments | unknown[]) => void;
      booted?: boolean;
    };
    intercomSettings?: Record<string, unknown>;
  }
}

export const INTERCOM_APP_ID =
  (import.meta.env.VITE_INTERCOM_APP_ID as string | undefined)?.trim() || "a291av90";

let bootPromise: Promise<boolean> | null = null;
let messengerVisible = false;
const visibilityListeners = new Set<(open: boolean) => void>();

function notifyVisibility(open: boolean) {
  messengerVisible = open;
  visibilityListeners.forEach((listener) => listener(open));
}

export function subscribeIntercomVisibility(listener: (open: boolean) => void): () => void {
  visibilityListeners.add(listener);
  listener(messengerVisible);
  return () => {
    visibilityListeners.delete(listener);
  };
}

function ensureIntercomStub() {
  const w = window;
  if (typeof w.Intercom === "function") return;

  const stub = function (...args: unknown[]) {
    stub.q = stub.q || [];
    stub.q.push(args);
  } as NonNullable<Window["Intercom"]>;
  stub.q = [];
  stub.c = function (args) {
    stub.q = stub.q || [];
    stub.q.push(args);
  };
  w.Intercom = stub;
}

function loadIntercomScript(appId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById("intercom-script") as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Failed to load Intercom widget")), { once: true });
      }
      return;
    }

    ensureIntercomStub();

    const script = document.createElement("script");
    script.id = "intercom-script";
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://widget.intercom.io/widget/${appId}`;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Intercom widget"));
    document.head.appendChild(script);
  });
}

/** Boot the real Intercom messenger and hide its default launcher bubble. */
export function bootIntercom(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    const settings = {
      api_base: "https://api-iam.intercom.io",
      app_id: INTERCOM_APP_ID,
      hide_default_launcher: true,
    };
    window.intercomSettings = settings;

    await loadIntercomScript(INTERCOM_APP_ID);

    if (typeof window.Intercom !== "function") return false;

    // Widget script replaces the stub; boot/update attaches the messenger.
    window.Intercom("boot", settings);
    window.Intercom("update", settings);
    window.Intercom("onShow", () => notifyVisibility(true));
    window.Intercom("onHide", () => notifyVisibility(false));
    return true;
  })().catch((err) => {
    bootPromise = null;
    console.error("[Intercom]", err);
    return false;
  });

  return bootPromise;
}

export async function openIntercomMessenger(): Promise<void> {
  const ready = await bootIntercom();
  if (!ready || typeof window.Intercom !== "function") return;
  window.Intercom("show");
}

export async function hideIntercomMessenger(): Promise<void> {
  if (typeof window.Intercom !== "function") return;
  window.Intercom("hide");
}

export async function toggleIntercomMessenger(): Promise<void> {
  const ready = await bootIntercom();
  if (!ready || typeof window.Intercom !== "function") return;
  if (messengerVisible) window.Intercom("hide");
  else window.Intercom("show");
}

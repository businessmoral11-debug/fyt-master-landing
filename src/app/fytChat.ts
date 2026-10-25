/**
 * FYT Support chat (AI assistant + live team), served by the FYT email platform.
 * One script, loaded once per page. It draws its own bubble bottom right.
 *
 * The script has no public "open" call, so the in-page "Chat with us" buttons
 * click the widget's own launcher (it lives in an open shadow root). If the
 * script has not loaded yet, we ask it to open as soon as it is ready.
 */
export const FYT_CHAT_SRC = "https://emailsplatform.fundingyourtrades.com/w/chat.js";

type ChatWindow = Window & { __fytChat?: number; __fytChatOpen?: boolean };

/**
 * On phones the chat pins the page while it is open (body position: fixed) and
 * scrolls back to where the visitor was when it closes. This site uses smooth
 * scrolling, so that jump back was animated from the very top of the page and
 * looked like a reload. While the page is pinned, and for a moment after, we
 * switch to instant scrolling so the visitor lands back exactly where they were.
 */
let guardOn = false;
function installScrollGuard(): void {
  if (guardOn || typeof MutationObserver === "undefined") return;
  guardOn = true;
  const html = document.documentElement;
  let restore = 0;
  const sync = () => {
    if (document.body.style.position === "fixed") {
      window.clearTimeout(restore);
      html.style.scrollBehavior = "auto";
    } else if (html.style.scrollBehavior === "auto") {
      window.clearTimeout(restore);
      restore = window.setTimeout(() => {
        html.style.scrollBehavior = "";
      }, 400);
    }
  };
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ["style"] });
}

export function loadFytChat(): void {
  if (typeof document === "undefined") return;
  installScrollGuard();
  const w = window as ChatWindow;
  if (w.__fytChat) return;
  if (document.querySelector(`script[src="${FYT_CHAT_SRC}"]`)) return;
  const s = document.createElement("script");
  s.src = FYT_CHAT_SRC;
  s.async = true;
  document.body.appendChild(s);
}

function findLauncher(): HTMLElement | null {
  for (const el of Array.from(document.body.children)) {
    const root = (el as HTMLElement).shadowRoot;
    const b = root?.getElementById("b");
    if (b) return b as HTMLElement;
  }
  return null;
}

export function openFytChat(): void {
  if (typeof document === "undefined") return;
  const launcher = findLauncher();
  if (launcher) {
    launcher.click();
    return;
  }
  // Not on the page yet: open it as soon as the script is ready.
  (window as ChatWindow).__fytChatOpen = true;
  loadFytChat();
}

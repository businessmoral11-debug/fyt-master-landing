
export interface OrbitLabel {
  label: string;
  left: number;
  top: number;
  rotate: number;
}

export interface OrbitRing {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export const HERO_ORBIT_LABELS: OrbitLabel[] = [
  { label: "No Consistency Rule",     left: 385.6,  top: 838.4, rotate: -70.5 },
  { label: "Up to 100% Splits", left: 522.9,  top: 949.0, rotate: -40.7 },
  { label: "Rewards on Demand",       left: 720.0,  top: 990.0, rotate: 0 },
  { label: "Static Drawdown",         left: 917.1,  top: 949.0, rotate: 40.7 },
  { label: "200% Refundable Fee",     left: 1054.4, top: 838.4, rotate: 70.5 },
];

export const MOBILE_ORBIT_LABELS: OrbitLabel[] = [
  { label: "No Consistency Rule",     left: 120,  top: 500, rotate: -110.1 },
  { label: "Up to 100% Splits", left: 280,  top: 940, rotate: -63.43 },
  { label: "Rewards on Demand",       left: 720,  top: 980, rotate: 0 },
  { label: "Static Drawdown",         left: 1160, top: 940, rotate: 63.43 },
  { label: "200% Refundable Fee",     left: 1320, top: 500, rotate: 110.1 },
];

export type MobileLabelAnchor = "start" | "center" | "end";

export interface MobileLabelLayout {
  anchor: MobileLabelAnchor;
  wrapWidth: number;
}

export const MOBILE_LABEL_LAYOUT: MobileLabelLayout[] = [
  { anchor: "start",  wrapWidth: 220 },
  { anchor: "center", wrapWidth: 168 },
  { anchor: "center", wrapWidth: 168 },
  { anchor: "center", wrapWidth: 168 },
  { anchor: "end",    wrapWidth: 220 },
];

export interface MobileLabelBoxCss {
  items: "items-start" | "items-center" | "items-end";
  textAlign: "left" | "center" | "right";
  translateX: string;
  transformOrigin: string;
}

export function mobileLabelBoxCss(anchor: MobileLabelAnchor = "center"): MobileLabelBoxCss {
  if (anchor === "start") {
    return { items: "items-start", textAlign: "left", translateX: "0%", transformOrigin: "top left" };
  }
  if (anchor === "end") {
    return { items: "items-end", textAlign: "right", translateX: "-100%", transformOrigin: "top right" };
  }
  return { items: "items-center", textAlign: "center", translateX: "-50%", transformOrigin: "top center" };
}

export const HERO_ORBIT_RINGS: OrbitRing[] = [
  { cx: 720, cy: 800.3,  rx: 300, ry: 220.3 },
  { cx: 720, cy: 934.9,  rx: 430, ry: 354.9 },
  { cx: 720, cy: 1000.1, rx: 560, ry: 420.1 },
  { cx: 720, cy: 1140.1, rx: 840, ry: 560.1 },
];

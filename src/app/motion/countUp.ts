
export interface CountUpSegment {
  kind: "literal" | "number";
  text: string;
  target?: number;
  decimals?: number;
  hasCommas?: boolean;
}

const NUMBER_PATTERN = /\d[\d,]*(?:\.\d+)?/g;

export function parseCountUpSegments(raw: string): CountUpSegment[] {
  const segments: CountUpSegment[] = [];
  let lastIndex = 0;
  for (const match of raw.matchAll(NUMBER_PATTERN)) {
    const numStr = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ kind: "literal", text: raw.slice(lastIndex, index) });
    }
    const decimalMatch = numStr.match(/\.(\d+)$/);
    segments.push({
      kind: "number",
      text: numStr,
      target: Number(numStr.replace(/,/g, "")),
      decimals: decimalMatch ? decimalMatch[1].length : 0,
      hasCommas: numStr.includes(","),
    });
    lastIndex = index + numStr.length;
  }
  if (lastIndex < raw.length) {
    segments.push({ kind: "literal", text: raw.slice(lastIndex) });
  }
  return segments;
}

function formatNumber(value: number, decimals: number, hasCommas: boolean): string {
  const fixed = value.toFixed(decimals);
  if (!hasCommas) return fixed;
  const [whole, frac] = fixed.split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${withCommas}.${frac}` : withCommas;
}

export function renderCountUp(segments: CountUpSegment[], t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  return segments
    .map((seg) => {
      if (seg.kind === "literal") return seg.text;
      const value = (seg.target ?? 0) * clamped;
      return formatNumber(value, seg.decimals ?? 0, seg.hasCommas ?? false);
    })
    .join("");
}

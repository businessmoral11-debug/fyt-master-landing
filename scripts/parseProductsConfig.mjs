
export function extractArrayLiteral(html, marker) {
  const markerIdx = html.indexOf(marker);
  if (markerIdx === -1) throw new Error(`marker not found: ${marker}`);
  const start = html.indexOf("[", markerIdx);
  if (start === -1) throw new Error(`no "[" found after marker: ${marker}`);

  let depth = 0;
  let inString = false;
  let quote = "";
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    const prev = html[i - 1];
    if (inString) {
      if (ch === quote && prev !== "\\") inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) return html.slice(start, i + 1);
    }
  }
  throw new Error(`unterminated array literal starting at index ${start}`);
}

export function sanitizeToJson(text) {
  let out = "";
  let i = 0;
  let inString = false;
  let quote = "";
  while (i < text.length) {
    const ch = text[i];
    if (inString) {
      if (ch === "\\" && i + 1 < text.length) {
        out += ch + text[i + 1];
        i += 2;
        continue;
      }
      if (ch === quote) {
        out += '"';
        inString = false;
        i++;
        continue;
      }
      out += ch === '"' ? '\\"' : ch;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      out += '"';
      i++;
      continue;
    }
    if (ch === "/" && text[i + 1] === "/") {
      while (i < text.length && text[i] !== "\n") i++;
      continue;
    }
    const keyMatch = /^([A-Za-z_$][\w$]*|\d+)[ \t]*:/.exec(text.slice(i));
    if (keyMatch) {
      out += `"${keyMatch[1]}":`;
      i += keyMatch[0].length;
      continue;
    }
    out += ch;
    i++;
  }
  return out.replace(/,(\s*[}\]])/g, "$1");
}

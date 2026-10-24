/* Where is the visitor? Country (IP first, then time zone), region, and display names. */

/* ------------------------------- regions -------------------------------- */

export type RegionId = "south-asia" | "southeast-asia" | "east-asia" | "middle-east" | "europe" | "north-america" | "latin-america" | "oceania" | "africa";

export const REGION_NAME: Record<RegionId, string> = {
  "south-asia": "South Asia",
  "southeast-asia": "Southeast Asia",
  "east-asia": "East Asia",
  "middle-east": "the Middle East",
  europe: "Europe",
  "north-america": "North America",
  "latin-america": "Latin America",
  oceania: "Oceania",
  africa: "Africa",
};

export const REGION_CHIP: Record<RegionId, string> = {
  "south-asia": "South Asia",
  "southeast-asia": "Southeast Asia",
  "east-asia": "East Asia",
  "middle-east": "Middle East",
  europe: "Europe",
  "north-america": "North America",
  "latin-america": "Latin America",
  oceania: "Oceania",
  africa: "Africa",
};

const REGION_COUNTRIES: Record<RegionId, string[]> = {
  "south-asia": ["IN", "PK", "BD", "LK", "NP", "BT", "MV"],
  "southeast-asia": ["MY", "PH", "ID", "VN", "SG", "TH", "KH", "LA", "MM", "BN"],
  "east-asia": ["HK", "JP", "KR", "CN", "TW", "MO", "MN"],
  "middle-east": ["SA", "AE", "OM", "BH", "QA", "KW", "JO", "LB", "IL", "IQ", "IR", "TR", "YE", "SY", "PS"],
  europe: [
    "GB", "IE", "FR", "DE", "NL", "BE", "LU", "CH", "AT", "IT", "ES", "PT", "GR", "CY", "MT", "SE", "NO", "DK", "FI", "IS", "PL", "CZ", "SK", "HU", "RO", "BG", "HR", "SI", "RS", "BA",
    "AL", "MK", "ME", "XK", "UA", "BY", "MD", "LT", "LV", "EE", "RU", "AZ", "GE", "AM",
  ],
  "north-america": ["US", "CA", "MX", "PR"],
  "latin-america": ["BR", "AR", "CO", "CL", "PE", "UY", "EC", "VE", "BO", "PY", "CR", "PA", "DO", "GT", "JM", "TT"],
  oceania: ["AU", "NZ", "FJ", "PG"],
  africa: ["ZA", "NG", "KE", "EG", "MA", "DZ", "TN", "GH", "ET", "TZ", "UG", "SN", "CI", "CM", "ZM", "ZW", "MU", "NA", "BW", "RW", "AO", "MZ", "LY", "SD"],
};

const COUNTRY_REGION: Record<string, RegionId> = {};
for (const [region, list] of Object.entries(REGION_COUNTRIES) as [RegionId, string[]][]) for (const cc of list) COUNTRY_REGION[cc] = region;

export function regionOf(code: string | null | undefined): RegionId | null {
  return code ? COUNTRY_REGION[code.toUpperCase()] ?? null : null;
}

/* ------------------------------ visitor ------------------------------- */

const TZ_COUNTRY: Record<string, string> = {
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Karachi": "PK", "Asia/Dhaka": "BD", "Asia/Kathmandu": "NP", "Asia/Colombo": "LK",
  "Asia/Dubai": "AE", "Asia/Riyadh": "SA", "Asia/Qatar": "QA", "Asia/Kuwait": "KW", "Asia/Bahrain": "BH", "Asia/Muscat": "OM", "Asia/Amman": "JO", "Asia/Beirut": "LB",
  "Asia/Jerusalem": "IL", "Asia/Baghdad": "IQ", "Asia/Tehran": "IR", "Asia/Baku": "AZ", "Asia/Tbilisi": "GE", "Asia/Yerevan": "AM",
  "Africa/Lagos": "NG", "Africa/Nairobi": "KE", "Africa/Johannesburg": "ZA", "Africa/Accra": "GH", "Africa/Cairo": "EG", "Africa/Casablanca": "MA", "Africa/Algiers": "DZ",
  "Africa/Tunis": "TN", "Africa/Addis_Ababa": "ET", "Africa/Dar_es_Salaam": "TZ", "Africa/Kampala": "UG", "Africa/Dakar": "SN", "Africa/Abidjan": "CI",
  "Europe/London": "GB", "Europe/Dublin": "IE", "Europe/Berlin": "DE", "Europe/Paris": "FR", "Europe/Madrid": "ES", "Europe/Rome": "IT", "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE", "Europe/Zurich": "CH", "Europe/Vienna": "AT", "Europe/Prague": "CZ", "Europe/Bratislava": "SK", "Europe/Budapest": "HU", "Europe/Warsaw": "PL",
  "Europe/Bucharest": "RO", "Europe/Sofia": "BG", "Europe/Athens": "GR", "Europe/Lisbon": "PT", "Europe/Stockholm": "SE", "Europe/Oslo": "NO", "Europe/Copenhagen": "DK",
  "Europe/Helsinki": "FI", "Europe/Vilnius": "LT", "Europe/Riga": "LV", "Europe/Tallinn": "EE", "Europe/Kyiv": "UA", "Europe/Kiev": "UA", "Europe/Istanbul": "TR",
  "Europe/Moscow": "RU", "Europe/Belgrade": "RS", "Europe/Zagreb": "HR",
  "Asia/Kuala_Lumpur": "MY", "Asia/Singapore": "SG", "Asia/Manila": "PH", "Asia/Jakarta": "ID", "Asia/Bangkok": "TH", "Asia/Ho_Chi_Minh": "VN", "Asia/Saigon": "VN",
  "Asia/Hong_Kong": "HK", "Asia/Tokyo": "JP", "Asia/Seoul": "KR", "Asia/Shanghai": "CN", "Asia/Taipei": "TW",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU", "Australia/Perth": "AU", "Australia/Adelaide": "AU", "Pacific/Auckland": "NZ",
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Los_Angeles": "US", "America/Phoenix": "US", "America/Anchorage": "US", "Pacific/Honolulu": "US",
  "America/Detroit": "US", "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA", "America/Winnipeg": "CA", "America/Halifax": "CA",
  "America/Sao_Paulo": "BR", "America/Mexico_City": "MX", "America/Bogota": "CO", "America/Lima": "PE", "America/Santiago": "CL", "America/Argentina/Buenos_Aires": "AR", "America/Buenos_Aires": "AR",
};

/** Country from time zone first, then browser language. No network call, nothing tracked. `?country=DE` forces one for testing. */
export function detectVisitor(): { code: string | null; region: RegionId | null } {
  try {
    const override = new URLSearchParams(window.location.search).get("country");
    if (override && /^[a-z]{2}$/i.test(override)) {
      const code = override.toUpperCase();
      return { code, region: regionOf(code) };
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (TZ_COUNTRY[tz]) {
      const code = TZ_COUNTRY[tz];
      return { code, region: regionOf(code) };
    }
    for (const lang of navigator.languages ?? [navigator.language]) {
      const m = /-([A-Z]{2})$/i.exec(lang ?? "");
      if (m) {
        const code = m[1].toUpperCase();
        if (regionOf(code)) return { code, region: regionOf(code) };
      }
    }
    // Unknown country: a region can still be read from the time zone name.
    if (tz.startsWith("Europe/")) return { code: null, region: "europe" };
    if (tz.startsWith("Africa/")) return { code: null, region: "africa" };
    if (tz.startsWith("Australia/") || tz.startsWith("Pacific/")) return { code: null, region: "oceania" };
  } catch {
    // Falls through to worldwide.
  }
  return { code: null, region: null };
}

/** Country from the visitor's IP (so a VPN or travel is respected). Cached for the tab. */
export async function lookupIpCountry(): Promise<string | null> {
  const KEY = "fyt_ip_cc_v1";
  try {
    const hit = window.sessionStorage.getItem(KEY);
    if (hit && /^[A-Z]{2}$/.test(hit)) return hit;
  } catch {
    // Storage blocked: just look it up.
  }
  const ask = async (url: string, pick: (r: Response) => Promise<string | null | undefined>): Promise<string | null> => {
    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), 2500);
    try {
      const r = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
      if (!r.ok) return null;
      const cc = (await pick(r))?.trim().toUpperCase();
      return cc && /^[A-Z]{2}$/.test(cc) && cc !== "XX" && cc !== "T1" ? cc : null;
    } catch {
      return null;
    } finally {
      window.clearTimeout(t);
    }
  };
  const cc = await new Promise<string | null>((resolve) => {
    let left = 2;
    const done = (v: string | null) => {
      if (v) resolve(v);
      else if (--left === 0) resolve(null);
    };
    ask("https://api.country.is/", async (r) => (await r.json()).country).then(done);
    ask("https://www.cloudflare.com/cdn-cgi/trace", async (r) => /(?:^|\n)loc=([A-Z]{2})/.exec(await r.text())?.[1]).then(done);
  });
  if (cc) {
    try {
      window.sessionStorage.setItem(KEY, cc);
    } catch {
      // Not cached: fine.
    }
  }
  return cc;
}

const NAME_THE: Record<string, string> = { US: "the USA", GB: "the UK", AE: "the UAE", NL: "the Netherlands", PH: "the Philippines" };
const NAME_PLAIN: Record<string, string> = { US: "USA", GB: "UK", AE: "UAE", CZ: "Czechia" };

export function countryPlain(code: string): string {
  if (NAME_PLAIN[code]) return NAME_PLAIN[code];
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
export function countryThe(code: string): string {
  return NAME_THE[code] ?? countryPlain(code);
}


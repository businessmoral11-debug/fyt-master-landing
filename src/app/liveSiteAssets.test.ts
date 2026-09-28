import { describe, it, expect } from "vitest";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_ROOT = resolve(__dirname, "../assets/live-site");

function assetPath(relPath: string): string {
  return resolve(ASSETS_ROOT, relPath);
}

function expectRealFile(relPath: string) {
  const p = assetPath(relPath);
  expect(existsSync(p), `${relPath} should exist on disk`).toBe(true);
  expect(statSync(p).size, `${relPath} should be non-empty`).toBeGreaterThan(0);
}

describe("hero assets", () => {
  const files = ["hero/IMG_3065-scaled.jpg"];
  it.each(files)("%s exists and is non-empty", (f) => expectRealFile(f));
});

describe("press logo assets", () => {
  const files = [
    "press-logos/676767.jpg",
    "press-logos/photo_5836782245585292581_x.jpg",
    "press-logos/barchart.webp",
    "press-logos/benzinga.webp",
    "press-logos/businessinsider.webp",
    "press-logos/digitaljournal.webp",
    "press-logos/firmfinder.png",
    "press-logos/the-trusted-prop.png",
    "press-logos/yahoo.webp",
  ];
  it.each(files)("%s exists and is non-empty", (f) => expectRealFile(f));
});

describe("payment icon assets", () => {
  const files = [
    "payment-icons/visa-logo-visa-icon-free-free-vector.jpg",
    "payment-icons/Mastercard_logo.webp",
    "payment-icons/1713982543bitcoin-logo-png-black.png",
    "payment-icons/tether.svg",
    "payment-icons/ethereum-eth.svg",
    "payment-icons/179431.png",
  ];
  it.each(files)("%s exists and is non-empty", (f) => expectRealFile(f));
});

describe("platform screenshot assets", () => {
  const files = [
    "platforms/unnamed.png",
    "platforms/IMG_7010.png",
    "platforms/IMG_6087.png",
    "platforms/image_2025-12-18_15-10-11.png",
    "platforms/unnamed.webp",
    "platforms/image_2025-12-18_14-57-00.png",
  ];
  it.each(files)("%s exists and is non-empty", (f) => expectRealFile(f));
});

describe("live payouts certificate image carousel assets", () => {
  const files = Array.from({ length: 21 }, (_, i) => `payout-certificates/${471 + i}.png`);
  it.each(files)("%s exists and is non-empty", (f) => expectRealFile(f));
});

describe("testimonial screenshot carousel assets", () => {
  const suffixes = [
    "124922", "125001", "125018", "125030", "125042",
    "125050", "125104", "125120", "125128", "125138",
  ];
  const files = suffixes.map((s) => `testimonial-screenshots/Screenshot_20260520-${s}.png`);
  it.each(files)("%s exists and is non-empty", (f) => expectRealFile(f));
});

describe("named testimonial photo assets", () => {
  const files = [
    "testimonial-named-photos/Gabriel.jpg",
    "testimonial-named-photos/damien.jpg",
    "testimonial-named-photos/edmund.jpg",
    "testimonial-named-photos/waqas.jpg",
    "testimonial-named-photos/Edmund-2.jpg",
    "testimonial-named-photos/damien-2.jpg",
    "testimonial-named-photos/gabriel-2.jpg",
    "testimonial-named-photos/waqas-2.jpg",
    "testimonial-named-photos/Kateherin.jpg",
    "testimonial-named-photos/josef.jpg",
    "testimonial-named-photos/shehzad.jpg",
  ];
  it.each(files)("%s exists and is non-empty", (f) => expectRealFile(f));
});


describe("payout certificate carousel assets", () => {
  const jpgNums = [6, 7, 8, 9, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
  const pngNums = [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81];
  const files = [
    ...jpgNums.map((n) => `certificates/Frame-${n}-scaled.jpg`),
    ...pngNums.map((n) => `certificates/Frame-${n}-scaled.png`),
  ];
  it.each(files)("%s exists and is non-empty", (f) => expectRealFile(f));
});

describe("feature-grid icon assets", () => {
  const files = [
    "feature-icons/1st.svg",
    "feature-icons/2nd.svg",
    "feature-icons/6V2.svg",
    "feature-icons/SECOND.svg",
    "feature-icons/THRD.svg",
    "feature-icons/Vector-3-1.png",
    "feature-icons/Vector-3.png",
    "feature-icons/Vector-4-1.png",
    "feature-icons/Vector-4.png",
    "feature-icons/What-you-get-from-us_.svg",
    "feature-icons/challenge-1.svg",
    "feature-icons/eight.svg",
    "feature-icons/fi_18510671.svg",
    "feature-icons/fifth.svg",
    "feature-icons/fourth.svg",
    "feature-icons/seventh.svg",
    "feature-icons/stak.svg",
    "feature-icons/third.svg",
    "feature-icons/vector3.svg",
    "feature-icons/vector4.svg",
  ];
  it.each(files)("%s exists and is non-empty", (f) => expectRealFile(f));
});

describe("UI/social icon assets", () => {
  const files = [
    "ui-icons/arrowhead-up-1.png",
    "ui-icons/close.png",
    "ui-icons/discord.png",
    "ui-icons/down-arrow.png",
    "ui-icons/hamburger.png",
    "ui-icons/instagram.png",
    "ui-icons/right-arrow-4.png",
    "ui-icons/telegram.png",
    "ui-icons/twitter-1.png",
    "ui-icons/youtube.png",
  ];
  it.each(files)("%s exists and is non-empty", (f) => expectRealFile(f));
});

describe("misc assets", () => {
  const files = [
    "misc/Frame-1000006347.png",
    "misc/Line-1.png",
    "misc/Table.png",
    "misc/available-trading-platform.png",
    "misc/6328118554263228298.jpg",
    "misc/IMG_7043.jpg",
    "misc/photo_6311796192479743598_y.jpg",
    "misc/FYT_200-Refund-Fee-copy.png",
    "misc/FYT_5M-copy.png",
    "misc/FYT_95-Profit-Split-copy.png",
    "misc/IMG_1080-1-1024x266-1.webp",
    "misc/IMG_8135.jpg",
    "misc/6066483156774227824.jpg",
    "misc/6104640861707636965.jpg",
    "misc/6104640861707636967.jpg",
    "misc/6104640861707636968.jpg",
    "misc/6104640861707636969.jpg",
    "misc/6104640861707636970.jpg",
    "misc/IMG_9585.jpg",
    "misc/6181506534194483764.jpg",
    "misc/6181506534194483765.jpg",
    "misc/6181506534194483766.jpg",
    "misc/IMG_0659.jpg",
  ];
  it.each(files)("%s exists and is non-empty", (f) => expectRealFile(f));
});

describe("spec-crop assets", () => {
  it("dashboard-mockup.png exists and is non-empty", () => {
    const p = resolve(__dirname, "../assets/spec-crops/dashboard-mockup.png");
    expect(existsSync(p), "dashboard-mockup.png should exist on disk").toBe(true);
    expect(statSync(p).size, "dashboard-mockup.png should be non-empty").toBeGreaterThan(0);
  });
});

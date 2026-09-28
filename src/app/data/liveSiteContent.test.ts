import { describe, it, expect } from "vitest";
import {
  HERO_CONTENT,
  PROMO_BANNER,
  FAQ_ITEMS,
  KEY_METRICS,
  LIVE_PAYOUTS_CONTENT,
  FEATURES_GRID,
  PAYOUT_STATISTICS,
  VERIFICATION_SECTION,
  HOW_IT_WORKS,
  PLATFORMS_SECTION,
  TRADER_FEEDBACK,
  HEAR_FROM_TRADERS,
  SUPPORT_SECTION,
  FINAL_CTA,
  FOOTER_LINKS,
  NAV_LINKS,
  FOOTER_COLUMNS,
  TRUSTINDEX_WIDGET,
  VIDEO_URLS,
} from "./liveSiteContent";

describe("HERO_CONTENT", () => {
  it("matches verified live copy", () => {
    expect(HERO_CONTENT.headlineMain).toBe("Trade without Hidden Rules.");
    expect(HERO_CONTENT.headlineBlue).toBe("Get Rewards in 24 Hours.");
    expect(HERO_CONTENT.checklist).toEqual([
      "No Consistency Rule",
      "Up to 100% Reward Split",
      "1st Reward on Demand",
      "Static Drawdown",
    ]);
    expect(HERO_CONTENT.ctaPrimary).toEqual({ label: "Get Started Now", href: "#challenge" });
    expect(HERO_CONTENT.ctaSecondary).toEqual({ label: "Chat with us", href: "https://discord.gg/6NYNSAwxeZ" });
  });
});

describe("PROMO_BANNER", () => {
  it("matches verified live copy", () => {
    expect(PROMO_BANNER.headingPrefix).toBe("New To FYT? ");
    expect(PROMO_BANNER.headingHighlight).toBe("40% Off + Buy 1 Get 2 Instantly");
    expect(PROMO_BANNER.body).toBe(
      "Receive 40% OFF + Instant BOGO using the code FYT40 for new users only. Don't miss this exclusive offer!"
    );
    expect(PROMO_BANNER.code).toBe("FYT40");
    expect(PROMO_BANNER.footnote).toBe("Valid for new users only. Terms and conditions apply.");
  });
});

describe("FAQ_ITEMS", () => {
  it("has exactly 4 verified pairs", () => {
    expect(FAQ_ITEMS).toHaveLength(4);
    expect(FAQ_ITEMS[0]).toEqual({
      q: "When does the Evaluation/Challenge Start?",
      a: "Your evaluation/challenge begins the moment your account credentials are sent to you. Get ready to trade from day one!",
    });
    expect(FAQ_ITEMS[1]).toEqual({
      q: "Keep 18% of your challenge rewards!",
      a: "Starting from your second reward, you'll receive 18% of the virtual targets earned during the challenge plus your refundable fee!",
    });
    expect(FAQ_ITEMS[2]).toEqual({
      q: "Do I have to pay the loss incurred on the account?",
      a: "When you sign up with us, you're choosing peace of mind. We take full responsibility for any losses incurred on your account, you are not liable for covering them.",
    });
    expect(FAQ_ITEMS[3]).toEqual({
      q: "Is the Evaluation fee refundable?",
      a: "Your evaluation fee is 100% refundable after your second reward, our way of recognizing your commitment. Anything greater than 100% that you see are bonuses that comes with particular promos. Therefore, anything more will depend on the particular promo that you signed up with.",
    });
  });
});

describe("KEY_METRICS", () => {
  it("matches verified live copy", () => {
    expect(KEY_METRICS).toEqual([
      { value: "$3.5M+", label: "In Rewards" },
      { value: "21,500+", label: "FYT Traders" },
      { value: "105+", label: "Countries" },
    ]);
  });
});

describe("LIVE_PAYOUTS_CONTENT", () => {
  it("matches verified live copy", () => {
    expect(LIVE_PAYOUTS_CONTENT).toEqual({
      heading: "Live payouts. Verified rewards.",
      tickerLabel: "RECENT VERIFIED REWARDS",
    });
  });
});

describe("FEATURES_GRID", () => {
  it("has the verified heading and 8 cards", () => {
    expect(FEATURES_GRID.heading).toBe("What you get from us?");
    expect(FEATURES_GRID.cards).toEqual([
      { title: "Get 18% Reward Bonus", desc: "Earn an extra in bonus rewards when you complete the challenge" },
      { title: "Up to 100% Reward Split", desc: "Earn the highest profit share from your performance" },
      { title: "Up to 200% Refund Bonus", desc: "Get rewarded even more with refund incentives" },
      { title: "Weekly Rewards & Free Reset", desc: "Faster payouts and second chances to boost your success" },
      { title: "No Time Limit", desc: "Trade at your own pace, no deadlines, no pressure" },
      { title: "Static Drawdowns", desc: "Fair and consistent drawdown rules based on balance" },
      { title: "Weekend Holding", desc: "Keep positions open overnight or over the weekend" },
      { title: "News Trading", desc: "Trade/hold positions without restrictions with our challenge accounts" },
    ]);
  });
});

describe("PAYOUT_STATISTICS", () => {
  it("matches verified live copy", () => {
    expect(PAYOUT_STATISTICS).toEqual([
      { value: "Up to 100% Split", label: "Paid up to 100% reward splits" },
      { value: "105 Minutes", label: "Average Reward Speed" },
      { value: "$3.5M+", label: "Reward Paid Out" },
    ]);
  });
});

describe("VERIFICATION_SECTION", () => {
  it("matches verified live copy, including the known-broken CTA target", () => {
    expect(VERIFICATION_SECTION.kickerGold).toBe("The Only Prop Firm");
    expect(VERIFICATION_SECTION.kickerWhite).toBe(" Giving Direct Access To Verified Paid Traders");
    expect(VERIFICATION_SECTION.headingMain).toBe("Verify Us Before You Commit. Hear Straight From");
    expect(VERIFICATION_SECTION.headingHighlight).toBe(" Traders Who've Already Been Paid.");
    expect(VERIFICATION_SECTION.subheading).toBe(
      "In an industry full of doubt, we're the only prop firm that lets you speak directly with traders who've already been paid."
    );
    expect(VERIFICATION_SECTION.cta).toEqual({
      label: "Speak with a Funded Trader",
      href: "https://fundingyourtrades.com/funding-your-trades-payouts/#speak",
    });
  });
});

describe("HOW_IT_WORKS", () => {
  it("matches verified live copy", () => {
    expect(HOW_IT_WORKS.heading).toBe("How You Can Get Simulated Funding");
    expect(HOW_IT_WORKS.steps).toEqual([
      { label: "Challenge", desc: "Prove Your Skills Here" },
      { label: "Funded", desc: "Get Funded Up To 200K" },
      { label: "Rewards", desc: "Get Up To 100% Rewards" },
    ]);
  });
});

describe("PLATFORMS_SECTION", () => {
  it("matches verified live copy", () => {
    expect(PLATFORMS_SECTION.heading).toBe("available trading platform");
    expect(PLATFORMS_SECTION.subheading).toBe(
      "Access powerful platforms designed to maximize your trading rewards"
    );
    expect(PLATFORMS_SECTION.platform5.title).toBe("Platform 5");
    expect(PLATFORMS_SECTION.platform5.body).toBe(
      "Unlock the full potential of your trading with Platform 5, engineered for elite traders who demand precision, speed and advanced features that deliver results, empowering you to stay ahead of every market move."
    );
    expect(PLATFORMS_SECTION.matchTrader.title).toBe("Match-Trader");
    expect(PLATFORMS_SECTION.matchTrader.body).toBe(
      "MatchTrader is a fast-rising platform known for its intuitive user interface and powerful functionalities. Designed to streamline your trading experience"
    );
    expect(PLATFORMS_SECTION.testAccountHref).toBe(
      "https://intercom.help/funding-your-trades/en/articles/12850361-test-accounts"
    );
  });
});

describe("TRADER_FEEDBACK", () => {
  it("has 8 verified named quotes", () => {
    expect(TRADER_FEEDBACK.quotes).toEqual([
      {
        name: "Javier",
        quote:
          "Funding YourTrades feels more transparent now. No vague rules or hidden conditions. What's on the website is exactly what you get. That kind of honesty matters a lot in this space.",
      },
      {
        name: "Hafeez Ullah",
        quote:
          "Phase2 Passed, Alhamdolillah Phase02 25K with @fundingurtrades Profit Traget Completed. Over all good expereince with @fundingurtrades. Good trading conditions and crypto spreads are very low. Powerfull trading dashboard. Lets hope soon i will get Funded acount",
      },
      {
        name: "Sahirr A Haji",
        quote:
          "FYT is stand out of crowd due to no daily draw down limit, What gives me more space to manage equity accordingly... Match-trader platform is outstanding",
      },
      {
        name: "taxfreehogg",
        quote:
          "I have only been trading with FYT for a couple of weeks, but I love it so far. Credentials are sent out almost immediately after purchasing a challenge, as well as after passing a Phase 1 or 2 challenge. I'll update this once I have my first live account underway, but it's been a wonderful experience up until this point.",
      },
      {
        name: "Aeston",
        quote:
          "I had a payout rejected under the old FYT team last year, and honestly, I had written it off as a loss. But recently, I got an email from the new team saying they were reviewing old cases - and they refunded me! That kind of gesture shows real integrity. I'm giving FYT another shot because of this.",
      },
      {
        name: "Arthur",
        quote:
          "Passed the challenge and just received my first payout. It hit my account the next day - no excuses, no follow-ups needed. That reliability earns major points from me.",
      },
      {
        name: "Michael Brown",
        quote:
          "Started off with the $10K account just to test things out. Passed in 2 weeks. Now I'm funded and just received my second payout. Smooth experience so far.",
      },
      {
        name: "Finley Cartwright",
        quote:
          "I've been with FYT since the early days, and the changes after the ownership shift have been huge. The platform feels smoother, the rules make more sense, and the support is 10x better than before. You can tell the new team actually listens to traders.",
      },
    ]);
  });
});

describe("HEAR_FROM_TRADERS", () => {
  it("matches verified live copy", () => {
    expect(HEAR_FROM_TRADERS).toEqual({
      heading: "Hear From Our Traders",
      cta: { label: "Become Next Success Story!", href: "https://fundingyourtrades.com/#challenge" },
    });
  });
});

describe("SUPPORT_SECTION", () => {
  it("matches verified live copy", () => {
    expect(SUPPORT_SECTION).toEqual({
      heading: "24x7 Around the Clock Support",
      subheading: "Always-on support team available for your trading journey.",
      cta: { label: "Get Support", href: "#support" },
    });
  });
});

describe("FINAL_CTA", () => {
  it("matches verified live copy", () => {
    expect(FINAL_CTA.heading).toBe("100X Your Rewards. Start Your Funded Journey Today");
    expect(FINAL_CTA.body).toBe(
      "Unlock bigger rewards and a smarter path to simulated trading. Our challenge gives you the opportunity and rules designed for long‑term success, while our community keeps you motivated, informed, and improving every day. When you are with us, you never trade alone and your rewards grow with your discipline"
    );
  });
});

describe("FOOTER_LINKS", () => {
  it("has 12 nav links and 5 social links, all verified", () => {
    expect(FOOTER_LINKS.nav).toEqual([
      { label: "Rewards Proof", href: "https://fundingyourtrades.com/fundingyourtrades-reviews-trader-results/" },
      { label: "Affiliate Registration", href: "https://fundingyourtrades.com/affiliate-registration/" },
      { label: "Affiliate Login", href: "https://fundingyourtrades.com/affiliate-account/" },
      { label: "Affiliate Reset Password", href: "https://fundingyourtrades.com/affiliate-reset-password/" },
      { label: "FAQ", href: "https://intercom.help/funding-your-trades/en/" },
      { label: "Contact Us", href: "https://fundingyourtrades.com/contact/" },
      { label: "Terms of Services", href: "https://fundingyourtrades.com/terms-of-services/" },
      { label: "Privacy Policy", href: "https://fundingyourtrades.com/privacy-policy/" },
      { label: "Risk Disclosure", href: "https://fundingyourtrades.com/risk-disclosure/" },
      { label: "Anti-Money Laundering Policy", href: "https://fundingyourtrades.com/anti-money-laundering-policy/" },
      { label: "Cookie Policy", href: "https://fundingyourtrades.com/cookie-policy/" },
      { label: "Refund Policy", href: "https://fundingyourtrades.com/refund_returns/" },
    ]);
    expect(FOOTER_LINKS.social).toEqual([
      { label: "Discord", href: "https://discord.gg/6NYNSAwxeZ" },
      { label: "Instagram", href: "https://www.instagram.com/fundingyourtrades" },
      { label: "Telegram", href: "https://t.me/fundingyourtrades" },
      { label: "X", href: "https://x.com/fundingurtrades" },
      { label: "YouTube", href: "https://www.youtube.com/@FundingYourTrades" },
    ]);
  });
});

describe("VIDEO_URLS", () => {
  it("has exactly 1 hero + 17 testimonial + 3 misc hotlinked URLs, all https on fundingyourtrades.com", () => {
    expect(Object.keys(VIDEO_URLS.hero)).toHaveLength(1);
    expect(Object.keys(VIDEO_URLS.testimonials)).toHaveLength(17);
    expect(Object.keys(VIDEO_URLS.misc)).toHaveLength(3);

    const all = [
      ...Object.values(VIDEO_URLS.hero),
      ...Object.values(VIDEO_URLS.testimonials),
      ...Object.values(VIDEO_URLS.misc),
    ];
    expect(all).toHaveLength(21);
    for (const url of all) {
      expect(url).toMatch(/^https:\/\/fundingyourtrades\.com\/wp-content\/uploads\/.+\.mp4$/);
    }
    expect(new Set(all).size).toBe(all.length);
  });

  it("matches the verified live URLs exactly", () => {
    expect(VIDEO_URLS.hero.welcome).toBe("https://fundingyourtrades.com/wp-content/uploads/2025/07/Welcome-to-FYT-2.mp4");
    expect(VIDEO_URLS.testimonials.damien).toBe("https://fundingyourtrades.com/wp-content/uploads/2025/12/Damien-trader.mp4");
    expect(VIDEO_URLS.testimonials.rohit).toBe("https://fundingyourtrades.com/wp-content/uploads/2026/06/ROHIT-VIDEO-FINAL-.mp4");
    expect(VIDEO_URLS.misc.howToPurchase).toBe(
      "https://fundingyourtrades.com/wp-content/uploads/2025/05/How-to-make-a-Successful-Purchase-at-FYT.mp4"
    );
  });
});

describe("TRUSTINDEX_WIDGET", () => {
  it("matches the verified portable embed config", () => {
    expect(TRUSTINDEX_WIDGET).toEqual({
      loaderSrc: "https://cdn.trustindex.io/loader.js?1c0d261737201100820687d5af1",
      dataPid: "521672873e0c61161e165e3e45b",
      dataLayoutId: "29",
      dataSetId: "dark-minimal",
    });
  });
});

describe("NAV_LINKS", () => {
  it("matches the verified live nav structure", () => {
    expect(NAV_LINKS.items).toEqual([
      { type: "link", label: "Rewards Proof", href: "https://rewards.fundingyourtrades.com/" },
      {
        type: "dropdown",
        label: "Affiliate",
        items: [
          { label: "Affiliate Registration", href: "https://fundingyourtrades.com/affiliate-registration/" },
          { label: "Login", href: "https://fundingyourtrades.com/affiliate-account/" },
          { label: "Reset Password", href: "https://fundingyourtrades.com/affiliate-reset-password/" },
        ],
      },
      { type: "link", label: "FAQ", href: "https://intercom.help/funding-your-trades/en/" },
      { type: "link", label: "Contact Us", href: "https://fundingyourtrades.com/contact/" },
    ]);
    expect(NAV_LINKS.login).toEqual({ label: "Login/Sign up", href: "https://clients.fundingyourtrades.com/login" });
    expect(NAV_LINKS.buyHere).toEqual({ label: "Buy Here", href: "#challenge" });
  });
});

describe("FOOTER_COLUMNS", () => {
  it("matches the verified live footer link structure", () => {
    expect(FOOTER_COLUMNS).toEqual([
      {
        heading: "PRODUCT",
        items: [
          { label: "How it works", href: "#how-it-works" },
          { label: "Reward ledger", href: "#live-payouts" },
        ],
      },
      {
        heading: "COMPANY",
        items: [
          { label: "FAQ", href: "https://intercom.help/funding-your-trades/en/" },
          { label: "Affiliate", href: "https://fundingyourtrades.com/affiliate-registration/" },
          { label: "Contact", href: "https://fundingyourtrades.com/contact/" },
        ],
      },
      {
        heading: "LEGAL",
        items: [
          { label: "Terms of Service", href: "https://fundingyourtrades.com/terms-of-services/" },
          { label: "Privacy Policy", href: "https://fundingyourtrades.com/privacy-policy/" },
          { label: "Risk Disclosure", href: "https://fundingyourtrades.com/risk-disclosure/" },
          { label: "Refund Policy", href: "https://fundingyourtrades.com/refund_returns/" },
        ],
      },
    ]);
  });
});

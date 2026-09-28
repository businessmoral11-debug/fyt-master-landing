export type TestimonialReview = {
  name: string;
  initials: string;
  color: string;
  rating: number;
  date: string;
  title: string;
  quote: string;
};

export type TestimonialVideo = {
  name: string;
  caption: string;
  videoUrl: string;
  posterUrl: string;
};

export const TESTIMONIAL_REVIEWS: TestimonialReview[] = [
  { name: "Sakil Shaikh", initials: "SS", color: "#3b82f6", rating: 5, date: "2026-07-26", title: "Best firm", quote: "The best propfirm ever I have trade with" },
  { name: "Neeraj Chopra", initials: "NC", color: "linear-gradient(119deg, #60a5fa 0%, #3b82f6 73%)", rating: 4, date: "2026-07-25", title: "Rise bank transfer took four business days", quote: "Requested payout via Rise bank transfer. Money arrived safely, but took four business days to clear into my local account. Switching to crypto next time for faster payout." },
  { name: "Lincoln Ward", initials: "LW", color: "#3b82f6", rating: 4, date: "2026-07-25", title: "Up to 100% split feels incredible", quote: "maximum profit split add-on during checkout. Keeping up to 100% of my profit share makes time spent analyzing charts feel properly rewarded." },
  { name: "Shoaib Akhtar", initials: "SA", color: "linear-gradient(119deg, #60a5fa 0%, #3b82f6 73%)", rating: 5, date: "2026-07-25", title: "Lowered my own leverage inside portal controls", quote: "Felt myself taking impulsive trades during slow hours. Went into account settings and dropped my leverage manually. Instant discipline helper." },
  { name: "Firdaus Ahmad", initials: "FA", color: "#3b82f6", rating: 5, date: "2026-07-25", title: "Passed without waiting", quote: "Passed phase one instantly with one massive gold runner. Zero consistency rule meant I advanced without waiting." },
  { name: "Omar Al-Kaabi", initials: "OA", color: "linear-gradient(119deg, #60a5fa 0%, #3b82f6 73%)", rating: 5, date: "2026-07-25", title: "Appreciated human support agents", quote: "I asked a complicated question regarding scaling limits. A real person explained it using a clear example. Good communication made me feel valued as a customer." },
  { name: "Leon Mitchell", initials: "LM", color: "#3b82f6", rating: 4, date: "2026-07-25", title: "Spreads widen slightly during Asian rollover hour", quote: "Rollover period causes spreads on minor pairs to open up temporarily. Tapped my stop loss once. Now I just widen buffer zones before sleeping." },
  { name: "Kian Soriano", initials: "KS", color: "linear-gradient(119deg, #60a5fa 0%, #3b82f6 73%)", rating: 5, date: "2026-07-25", title: "Trustindex rating matched my experience", quote: "Checked their 4.6 Trustindex score before purchasing. Rules and payout timelines match what traders posted online perfectly. Genuine firm." },
  { name: "Amit Pandey", initials: "AP", color: "#3b82f6", rating: 5, date: "2026-07-25", title: "Weekly reward payouts keep my discipline tight", quote: "Taking weekly reward splits stops me from overtrading out of greed. Withdrawing regular profits built real consistency in my personal trading routine." },
  { name: "Syazwan Ali", initials: "SA", color: "linear-gradient(119deg, #60a5fa 0%, #3b82f6 73%)", rating: 4, date: "2026-07-25", title: "Test accounts build huge confidence", quote: "Testing accounts before making a purchase is something every firm should allow. I spent two days evaluating their execution speeds on demo. Confidence in their system made me buy a 50k challenge." },
  { name: "Rizwan Gul", initials: "RG", color: "#3b82f6", rating: 5, date: "2026-07-25", title: "No time limits allowed me to wait for quality setups", quote: "Took me almost 6 weeks to pass because I skipped many trading days completely. Having no time limit meant zero deadline pressure. Best decision I made." },
  { name: "Saud Al-Saud", initials: "SA", color: "linear-gradient(119deg, #60a5fa 0%, #3b82f6 73%)", rating: 5, date: "2026-07-25", title: "Instant funding skipped demo stress", quote: "Skipped evaluation phases entirely. Buying an Instant account let me manage simulated capital from day one. Respecting my risk parameters feels much more natural now." },
  { name: "Jude Watson", initials: "JW", color: "#3b82f6", rating: 5, date: "2026-07-25", title: "Hedging saved my trade during an unexpected spike", quote: "Market moved violently during an unannounced central bank speech. Opened a quick hedge trade to freeze floating loss, analyzed chart structure, and closed safely. Glad hedging is allowed." },
  { name: "Carter Brooks", initials: "CB", color: "linear-gradient(119deg, #60a5fa 0%, #3b82f6 73%)", rating: 5, date: "2026-07-25", title: "Free reset gave me a second chance", quote: "Entered drawdown early on my fresh account and felt frustrated. Having a free reset feature allowed me to reset my mindset and restart my strategy properly." },
  { name: "Jericho Aquino", initials: "JA", color: "#3b82f6", rating: 5, date: "2026-07-25", title: "Local trade copier mirrors entries flawlessly", quote: "Mirrored entries from my personal retail account into my challenge dashboard using a local copier. Copy trading is allowed. Orders executed simultaneously across screens with zero delay." },
  { name: "Rohit Sen", initials: "RS", color: "linear-gradient(119deg, #60a5fa 0%, #3b82f6 73%)", rating: 5, date: "2026-07-25", title: "Dashboard stats track everything cleanly", quote: "I like how clearly this dashboard tracks everything. Daily drawdown, max loss, and targets are easy to follow. Less confusion means less second guessing while trading." },
  { name: "Saeed Al-Falasi", initials: "SA", color: "#3b82f6", rating: 5, date: "2026-07-25", title: "2 Step Pro targets felt very achievable", quote: "Took a $100k 2 Step Pro account. 10% phase one and 6% phase two targets felt very reasonable. Never felt forced to overleverage just to hit goals." },
  { name: "Fawad Ahmed", initials: "FA", color: "linear-gradient(119deg, #60a5fa 0%, #3b82f6 73%)", rating: 5, date: "2026-07-25", title: "Prime account fits changing work shifts", quote: "My job hours change weekly, making consistency rules annoying. Prime account removing consistency requirements lets me trade heavy on Tuesday and take Wednesday off without penalties." },
  { name: "Babatunde Adeyemi", initials: "BA", color: "#3b82f6", rating: 5, date: "2026-07-25", title: "18% evaluation split was a great bonus", quote: "Earning an 18% reward split from evaluation phase profits is brilliant. Receiving payout cash before even getting funded boosted my morale massively." },
  { name: "Khairul Hafiz", initials: "KH", color: "linear-gradient(119deg, #60a5fa 0%, #3b82f6 73%)", rating: 5, date: "2026-07-25", title: "Traded CPI news without issues", quote: "Executed my order right during CPI data release. News trading is allowed on challenges, so my order filled clean without compliance warnings. Made my monthly goal fast." },
];

export const TESTIMONIAL_VIDEOS: TestimonialVideo[] = [
  { name: "Devon", caption: "Got my payout with FYT and the whole funding experience felt clear and professional.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/08/FYT-july-12th.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/08/6079921074356295115.jpg" },
  { name: "Waqas", caption: "One of the most professional prop firms I've worked with so far.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2025/12/Waqas-trader.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2025/12/waqas.jpg" },
  { name: "Taufiq Sayed", caption: "Live payout during the interview — proof that rewards actually move.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/08/FYT-interview-1st-july_2.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/08/6079921074356295116.jpg" },
  { name: "Damien", caption: "The evaluation process was smooth, transparent, and very trader-friendly.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2025/12/Damien-trader.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2025/12/damien.jpg" },
  { name: "Kush", caption: "Live payout during the interview — transparent and trader-focused.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/08/FYT-july-video-9th_2.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/08/6079921074356295117.jpg" },
  { name: "Nicolas", caption: "This funding experience completely changed the way I trade and scale accounts.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/06/Nicholas-Video.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/06/6181506534194483764.jpg" },
  { name: "Edmund", caption: "Highly recommended for serious traders who want real scalability.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2025/12/Edmond_2.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2025/12/edmund.jpg" },
  { name: "Nadir", caption: "This funding experience completely changed the way I trade and scale accounts.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/06/NADIR-HUSSAIN-FINAL-.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/06/6181506534194483765.jpg" },
  { name: "Katherine", caption: "Amazing experience with excellent support and transparent processes.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/01/FYT-7.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/01/photo_6311796192479743598_y.jpg" },
  { name: "Rohit", caption: "This funding experience completely changed the way I trade and scale accounts.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/06/ROHIT-VIDEO-FINAL-.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/06/6181506534194483766.jpg" },
  { name: "Abigail", caption: "Joining this program was the best trading decision I've ever made.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/03/Rebecca-final-interview.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/03/IMG_8135.jpg" },
  { name: "Shubham", caption: "This funding experience completely changed the way I trade and scale accounts.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/Shubam-part-2.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/6104640861707636965.jpg" },
  { name: "Bharath", caption: "Amazing experience with excellent support and transparent processes.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/01/FYT-8.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/01/6328118554263228298.jpg" },
  { name: "Emad", caption: "This funding experience completely changed the way I trade and scale accounts.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/FYT-may-1st.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/6104640861707636968.jpg" },
  { name: "Gabriel", caption: "This funding experience completely changed the way I trade and scale accounts.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2025/12/Gabriel-trader.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2025/12/Gabriel.jpg" },
  { name: "Ibrahim", caption: "This funding experience completely changed the way I trade and scale accounts.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/FYT-may-2nd-2nd-ver.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/6104640861707636967.jpg" },
  { name: "Anisha", caption: "This funding experience completely changed the way I trade and scale accounts.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/Anisha-part-2.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/6104640861707636970.jpg" },
  { name: "Charls", caption: "This funding experience completely changed the way I trade and scale accounts.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/Charles-part-2.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/6104640861707636969.jpg" },
  { name: "Dylan", caption: "This funding experience completely changed the way I trade and scale accounts.", videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/FYT-Dylan.mp4", posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/05/6066483156774227824.jpg" },
];

export type TestimonialSlideItem =
  | { kind: "review"; review: TestimonialReview }
  | { kind: "video"; video: TestimonialVideo };

export type TestimonialPage = {
  topRow: TestimonialSlideItem[];
  bottomRow: TestimonialSlideItem[];
};

export function buildTestimonialPages(
  reviews: TestimonialReview[],
  videos: TestimonialVideo[],
): TestimonialPage[] {
  const rows: TestimonialSlideItem[][] = [];
  let ri = 0;
  let vi = 0;
  let reviewsFirst = true;

  while (ri + 1 < reviews.length && vi < videos.length) {
    const reviewItems: TestimonialSlideItem[] = [
      { kind: "review", review: reviews[ri] },
      { kind: "review", review: reviews[ri + 1] },
    ];
    const videoItem: TestimonialSlideItem = { kind: "video", video: videos[vi] };
    rows.push(reviewsFirst ? [...reviewItems, videoItem] : [videoItem, ...reviewItems]);
    ri += 2;
    vi += 1;
    reviewsFirst = !reviewsFirst;
  }

  const remainingReviews = reviews.slice(ri).map((review): TestimonialSlideItem => ({ kind: "review", review }));
  const remainingVideos = videos.slice(vi).map((video): TestimonialSlideItem => ({ kind: "video", video }));
  for (let i = 0; i < remainingReviews.length; i += 3) {
    rows.push(remainingReviews.slice(i, i + 3));
  }
  for (let i = 0; i < remainingVideos.length; i += 3) {
    rows.push(remainingVideos.slice(i, i + 3));
  }

  const pages: TestimonialPage[] = [];
  for (let i = 0; i < rows.length; i += 2) {
    pages.push({ topRow: rows[i] ?? [], bottomRow: rows[i + 1] ?? [] });
  }
  return pages;
}

export const TESTIMONIAL_PAGES: TestimonialPage[] = buildTestimonialPages(TESTIMONIAL_REVIEWS, TESTIMONIAL_VIDEOS);

export const TESTIMONIAL_FLAT_ITEMS: TestimonialSlideItem[] = TESTIMONIAL_PAGES.flatMap(
  (page) => [...page.topRow, ...page.bottomRow],
);

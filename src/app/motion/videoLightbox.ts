import type { TestimonialVideo } from "@/app/data/testimonials";

export type VideoSource =
  | { kind: "mp4"; src: string; poster: string; title: string }
  | { kind: "youtube"; videoId: string; title: string };

const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;

export function extractYouTubeVideoId(url: string): string {
  const short = url.match(/^https?:\/\/(?:www\.)?youtu\.be\/([\w-]{11})/);
  if (short) return short[1];
  const watch = url.match(/[?&]v=([\w-]{11})/);
  if (watch) return watch[1];
  const embed = url.match(/\/embed\/([\w-]{11})/);
  if (embed) return embed[1];
  throw new Error(`extractYouTubeVideoId: could not find a video id in "${url}"`);
}

export function buildYouTubeEmbedUrl(videoId: string): string {
  if (!YOUTUBE_ID_PATTERN.test(videoId)) {
    throw new Error(`buildYouTubeEmbedUrl: "${videoId}" is not a valid YouTube video id`);
  }
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function testimonialVideoSource(video: TestimonialVideo): VideoSource {
  return {
    kind: "mp4",
    src: video.videoUrl,
    poster: video.posterUrl,
    title: `${video.name}, FYT trader video testimonial`,
  };
}

export const PRICING_EXPLAINER_VIDEO_URL = "https://youtu.be/_c-tAUlBZbU";

export function pricingExplainerVideoSource(): VideoSource {
  return {
    kind: "youtube",
    videoId: extractYouTubeVideoId(PRICING_EXPLAINER_VIDEO_URL),
    title: "See how it works, FYT",
  };
}

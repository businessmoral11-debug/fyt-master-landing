import { describe, it, expect } from "vitest";
import {
  extractYouTubeVideoId,
  buildYouTubeEmbedUrl,
  testimonialVideoSource,
  pricingExplainerVideoSource,
  PRICING_EXPLAINER_VIDEO_URL,
} from "./videoLightbox";
import type { TestimonialVideo } from "@/app/data/testimonials";

describe("extractYouTubeVideoId", () => {
  it("extracts the id from a youtu.be short link", () => {
    expect(extractYouTubeVideoId("https://youtu.be/_c-tAUlBZbU")).toBe("_c-tAUlBZbU");
  });

  it("extracts the id from a youtube.com/watch link", () => {
    expect(extractYouTubeVideoId("https://www.youtube.com/watch?v=_c-tAUlBZbU")).toBe("_c-tAUlBZbU");
  });

  it("extracts the id from a youtube.com/watch link with extra query params", () => {
    expect(extractYouTubeVideoId("https://www.youtube.com/watch?v=_c-tAUlBZbU&t=10s")).toBe("_c-tAUlBZbU");
  });

  it("extracts the id from a youtube.com/embed link", () => {
    expect(extractYouTubeVideoId("https://www.youtube.com/embed/_c-tAUlBZbU")).toBe("_c-tAUlBZbU");
  });

  it("throws when the url has no recognizable video id", () => {
    expect(() => extractYouTubeVideoId("https://example.com/not-a-video")).toThrow(
      'could not find a video id in "https://example.com/not-a-video"',
    );
  });
});

describe("buildYouTubeEmbedUrl", () => {
  it("builds an autoplaying embed url for a valid id", () => {
    expect(buildYouTubeEmbedUrl("_c-tAUlBZbU")).toBe("https://www.youtube.com/embed/_c-tAUlBZbU?autoplay=1&rel=0");
  });

  it("throws for an id that isn't exactly 11 chars", () => {
    expect(() => buildYouTubeEmbedUrl("short")).toThrow('"short" is not a valid YouTube video id');
  });
});

describe("testimonialVideoSource", () => {
  const video: TestimonialVideo = {
    name: "Nicholas",
    caption: "This funding experience completely changed the way I trade and scale accounts.",
    videoUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/06/Nicholas-Video.mp4",
    posterUrl: "https://fundingyourtrades.com/wp-content/uploads/2026/06/6181506534194483764.jpg",
  };

  it("maps a TestimonialVideo to an mp4 VideoSource", () => {
    expect(testimonialVideoSource(video)).toEqual({
      kind: "mp4",
      src: "https://fundingyourtrades.com/wp-content/uploads/2026/06/Nicholas-Video.mp4",
      poster: "https://fundingyourtrades.com/wp-content/uploads/2026/06/6181506534194483764.jpg",
      title: "Nicholas, FYT trader video testimonial",
    });
  });
});

describe("pricingExplainerVideoSource", () => {
  it("resolves the hardcoded pricing explainer URL to a youtube VideoSource", () => {
    expect(pricingExplainerVideoSource()).toEqual({
      kind: "youtube",
      videoId: "_c-tAUlBZbU",
      title: "See how it works, FYT",
    });
  });

  it("stores the explainer video as the raw youtu.be share url", () => {
    expect(PRICING_EXPLAINER_VIDEO_URL).toBe("https://youtu.be/_c-tAUlBZbU");
  });
});

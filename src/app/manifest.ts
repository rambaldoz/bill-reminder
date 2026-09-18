import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bill Tracker & Reminder",
    short_name: "Bill Tracker",
    description: "Track recurring and one-off bills, and never miss a due date.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f3f5f9",
    theme_color: "#f3f5f9",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

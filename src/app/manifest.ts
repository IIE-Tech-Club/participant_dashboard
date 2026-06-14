import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#00f5ff",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

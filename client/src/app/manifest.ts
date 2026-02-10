import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "🫶iDocs — Free Online PDF & Document Tools",
    short_name: "iDocs",
    description:
      "Merge, split, compress, convert, edit, and secure your PDF files online — all free. No installation required.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["utilities", "productivity", "business"],
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "iDocs Desktop View",
      },
      {
        src: "/screenshots/mobile.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "iDocs Mobile View",
      },
    ],
    shortcuts: [
      {
        name: "Merge PDF",
        short_name: "Merge",
        description: "Combine multiple PDFs into one",
        url: "/tool/merge-pdf",
        icons: [{ src: "/icons/merge.png", sizes: "96x96" }],
      },
      {
        name: "Split PDF",
        short_name: "Split",
        description: "Split PDF into separate files",
        url: "/tool/split-pdf",
        icons: [{ src: "/icons/split.png", sizes: "96x96" }],
      },
      {
        name: "Compress PDF",
        short_name: "Compress",
        description: "Reduce PDF file size",
        url: "/tool/compress-pdf",
        icons: [{ src: "/icons/compress.png", sizes: "96x96" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}

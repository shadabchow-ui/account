import { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_ACCOUNT_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/signin`, lastModified: now },
  ];
}

const base = process.env.NEXT_PUBLIC_ACCOUNT_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: [{ userAgent: "*" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

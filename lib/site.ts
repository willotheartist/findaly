// lib/site.ts

type BreadcrumbItem = {
  name: string
  item: string // absolute or relative URL
}

type ArticleInput = {
  url: string // absolute or relative
  headline: string
  description: string
  image?: string | string[] // absolute or relative
  datePublished?: string // ISO yyyy-mm-dd (or full ISO)
  dateModified?: string // ISO
  authorName?: string // default: Findaly
  publisherName?: string // default: Findaly
  publisherLogo?: string // absolute or relative
}

type FaqItem = {
  q: string
  a: string
}

export function getSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (env) return env.replace(/\/+$/, "")

  // Vercel fallback (no protocol sometimes)
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const withProto = vercel.startsWith("http") ? vercel : `https://${vercel}`
    return withProto.replace(/\/+$/, "")
  }

  // Final fallback
  return "http://localhost:3000"
}

export function absoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) return getSiteUrl()
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl

  const base = getSiteUrl()
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`
  return `${base}${path}`
}

export function truncate(str: string, n: number) {
  if (!str) return ""
  const s = str.replace(/\s+/g, " ").trim()
  if (s.length <= n) return s
  return `${s.slice(0, n - 1).trim()}…`
}

/**
 * Safer JSON-LD string output (keeps script tags clean).
 * Use like:
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(obj) }} />
 */
export function jsonLd(obj: unknown) {
  return JSON.stringify(obj)
}

/**
 * BreadcrumbList JSON-LD
 *
 * Example:
 * breadcrumbJsonLd([
 *  { name: "Home", item: "/" },
 *  { name: "Guides", item: "/guides" },
 *  { name: "Swift Trawler buying guide", item: "/guides/beneteau-swift-trawler-buying-guide" },
 * ])
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  const normalized = (items || []).map((x, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: x.name,
    item: absoluteUrl(x.item),
  }))

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: normalized,
  }
}

/**
 * Article JSON-LD (used for guides / editorial pages)
 * Keep it consistent across all clusters.
 */
export function articleJsonLd(input: ArticleInput) {
  const publisherName = input.publisherName || "Findaly"
  const publisherLogo = input.publisherLogo || "/logo.png"
  const authorName = input.authorName || "Findaly"

  const images = Array.isArray(input.image)
    ? input.image
    : input.image
      ? [input.image]
      : ["/hero-buy.jpg"]

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    author: { "@type": "Organization", name: authorName },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: { "@type": "ImageObject", url: absoluteUrl(publisherLogo) },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(input.url) },
    image: images.map((x) => absoluteUrl(x)),
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
  }
}

/**
 * FAQPage JSON-LD
 */
export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (faqs || []).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}
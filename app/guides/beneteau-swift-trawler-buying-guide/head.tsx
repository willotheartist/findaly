import { absoluteUrl } from "@/lib/site";

export default function Head() {
  const title = "Beneteau Swift Trawler Buying Guide (2026) | Findaly";
  const description =
    "What to check before buying a Beneteau Swift Trawler: pricing context, survey focus areas, engines/systems, and negotiation red flags.";
  const canonical = absoluteUrl("/guides/beneteau-swift-trawler-buying-guide");

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Findaly" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}

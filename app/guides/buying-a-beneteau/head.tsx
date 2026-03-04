import { absoluteUrl } from "@/lib/site";

export default function Head() {
  const title = "Buying a Beneteau (2026 Guide) | Findaly";
  const description =
    "A practical, global guide to buying a Beneteau — models, pricing ranges, what to inspect, and how to buy clean in 2026.";
  const canonical = absoluteUrl("/guides/buying-a-beneteau");

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

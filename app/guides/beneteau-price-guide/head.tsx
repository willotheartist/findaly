import { absoluteUrl } from "@/lib/site";

export default function Head() {
  const title = "Beneteau Price Guide (2026) | Findaly";
  const description =
    "Beneteau prices explained: what drives value, realistic global price bands, model context, running costs, and negotiation tips.";
  const canonical = absoluteUrl("/guides/beneteau-price-guide");

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

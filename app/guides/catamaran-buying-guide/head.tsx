import { absoluteUrl } from "@/lib/site";

export default function Head() {
  const title = "Catamaran Buying Guide (2026) | Findaly";
  const description =
    "How to buy a catamaran clean: layout trade-offs, survey focus, engines/systems, charter wear, pricing context, and negotiation tips.";
  const canonical = absoluteUrl("/guides/catamaran-buying-guide");

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

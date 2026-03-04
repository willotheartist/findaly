import { absoluteUrl } from "@/lib/site";

export default function Head() {
  const title = "Beneteau Oceanis vs First (2026) | Findaly";
  const description =
    "Oceanis vs First: how they differ in feel, use-case, resale, and ownership costs — plus what to inspect when buying used.";
  const canonical = absoluteUrl("/guides/beneteau-oceanis-vs-first");

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

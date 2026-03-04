import { absoluteUrl } from "@/lib/site";

export default function Head() {
  const title = "Used Beneteau Checklist (2026) | Findaly";
  const description =
    "A practical checklist for buying a used Beneteau: rig/sails, engines/systems, paperwork, survey focus, and deal-breaker red flags.";
  const canonical = absoluteUrl("/guides/used-beneteau-checklist");

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

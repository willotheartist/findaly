import { absoluteUrl } from "@/lib/site";

export default function Head() {
  const title = "Yacht Finance | Findaly";
  const description =
    "Marine finance options for every vessel and every budget. Understand deposits, terms, surveys, and loan types before you make an offer.";
  const canonical = absoluteUrl("/finance");

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
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

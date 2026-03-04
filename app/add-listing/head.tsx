import { absoluteUrl } from "@/lib/site";

export default function Head() {
  const title = "List a Boat | Findaly";
  const description = "Create a boat listing on Findaly in minutes.";
  const canonical = absoluteUrl("/add-listing");

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

      <meta name="robots" content="noindex,follow" />
      <meta name="googlebot" content="noindex,follow" />
    </>
  );
}

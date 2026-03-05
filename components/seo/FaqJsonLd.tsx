// components/seo/FaqJsonLd.tsx
import { faqJsonLd, jsonLd } from "@/lib/site";

type FaqItem = { q: string; a: string };

export default function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd(faqs)) }}
    />
  );
}
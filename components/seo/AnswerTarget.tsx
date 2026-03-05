// components/seo/AnswerTarget.tsx
import Link from "next/link";

type Fact = { label: string; value: string };
type Cta = { label: string; href: string };

export default function AnswerTarget(props: {
  eyebrow?: string;
  title: string;
  summary: string;
  bullets?: string[];
  facts?: Fact[];
  ctas?: Cta[];
}) {
  const {
    eyebrow = "Quick answer",
    title,
    summary,
    bullets = [],
    facts = [],
    ctas = [],
  } = props;

  return (
    <section
      className="rounded-2xl border p-6 md:p-7"
      style={{
        borderColor: "rgba(10,33,31,0.10)",
        background: "rgba(10,33,31,0.02)",
      }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div
            className="text-[11px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: "rgba(10,33,31,0.45)" }}
          >
            {eyebrow}
          </div>

          <h2
            className="mt-2 text-[22px] md:text-[26px] font-semibold tracking-tight leading-[1.15]"
            style={{ color: "#0a211f" }}
          >
            {title}
          </h2>

          <p className="mt-3 text-[15.5px] leading-relaxed" style={{ color: "rgba(10,33,31,0.70)" }}>
            {summary}
          </p>

          {bullets.length ? (
            <ul className="mt-4 space-y-2">
              {bullets.map((b) => (
                <li key={b} className="text-[14.5px] leading-relaxed" style={{ color: "rgba(10,33,31,0.65)" }}>
                  <span style={{ color: "#0a211f", opacity: 0.9, marginRight: 8 }}>•</span>
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {facts.length ? (
          <div className="w-full md:w-[320px] shrink-0">
            <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "rgba(10,33,31,0.08)" }}>
              <div className="text-[12px] font-semibold tracking-[0.14em] uppercase" style={{ color: "rgba(10,33,31,0.45)" }}>
                Key facts
              </div>

              <div className="mt-3 space-y-3">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-start justify-between gap-3">
                    <div className="text-[12.5px]" style={{ color: "rgba(10,33,31,0.55)" }}>
                      {f.label}
                    </div>
                    <div className="text-[13.5px] font-semibold text-right" style={{ color: "#0a211f" }}>
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {ctas.length ? (
              <div className="mt-3 grid gap-2">
                {ctas.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-[13.5px] font-semibold"
                    style={{
                      background: "rgba(10,33,31,0.92)",
                      color: "#fff86c",
                    }}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
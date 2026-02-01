export default function DestinationSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-700">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

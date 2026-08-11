import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd, TickList } from "@/components/ui/Bits";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { legalDocs, legalBySlug } from "@/content/legal";

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = legalBySlug(slug);
  if (!doc) return buildMetadata({ title: "Not found", description: "", noIndex: true });

  return buildMetadata({
    title: doc.title,
    description: doc.description,
    path: `/legal/${doc.slug}`,
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = legalBySlug(slug);
  if (!doc) notFound();

  const trail = [
    { name: "Home", href: "/" },
    { name: doc.title, href: `/legal/${doc.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHeader
        eyebrow="Legal"
        title={doc.title}
        lead={doc.description}
        trail={trail}
        size="sm"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500">
          Effective {doc.updated}
        </p>
      </PageHeader>

      <Section tight>
        <div className="grid gap-14 lg:grid-cols-[0.32fr_1fr] lg:gap-16">
          {/* Contents */}
          <nav
            aria-label="On this page"
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-400">
              On this page
            </p>
            <ul className="mt-5 grid gap-2 border-l border-white/8 pl-4">
              {doc.sections.map((s) => (
                <li key={s.heading}>
                  <a
                    href={`#${slugId(s.heading)}`}
                    className="block text-[13px] leading-snug text-ink-400 transition-colors hover:text-teal-300"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-white/8 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                Other documents
              </p>
              <ul className="mt-4 grid gap-2">
                {legalDocs
                  .filter((d) => d.slug !== doc.slug)
                  .map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/legal/${d.slug}`}
                        className="text-[13px] text-ink-400 transition-colors hover:text-teal-300"
                      >
                        {d.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </nav>

          {/* Body */}
          <article>
            <Reveal>
              <p className="text-[16px] leading-relaxed text-ink-200">{doc.intro}</p>
            </Reveal>

            <div className="mt-12 grid gap-12">
              {doc.sections.map((s, i) => (
                <Reveal key={s.heading} delay={i * 0.03} id={slugId(s.heading)}>
                  <section className="scroll-mt-32">
                    <h2 className="text-[22px] font-semibold tracking-tight text-ink-50">
                      {s.heading}
                    </h2>
                    <div className="mt-4 grid gap-4">
                      {s.body.map((p) => (
                        <p key={p} className="text-[15px] leading-relaxed text-ink-300">
                          {p}
                        </p>
                      ))}
                    </div>
                    {s.list && <TickList items={s.list} className="mt-6" tone="muted" />}
                  </section>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-14">
              <p className="rounded-[0.5rem] border border-white/8 bg-white/[0.02] px-5 py-4 text-[12.5px] leading-relaxed text-ink-500">
                Questions about this document? Contact us and ask for the Privacy
                Officer. We&apos;ll get you a real answer, not a form letter.
              </p>
            </Reveal>
          </article>
        </div>
      </Section>
    </>
  );
}

function slugId(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

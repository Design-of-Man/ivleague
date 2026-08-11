import { Section, SectionHeading } from "@/components/ui/Section";
import { fetchInstagramPosts } from "@/lib/instagram";
import { site } from "@/content/site";
import { InstagramGrid } from "./InstagramGrid";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Server component. Fetches the feed at build/revalidate time so the grid is
 * static HTML, then hands it to a client grid for the lightbox interaction.
 */
export async function InstagramFeed({ limit = 9 }: { limit?: number }) {
  const { posts, live } = await fetchInstagramPosts(limit);

  return (
    <Section id="instagram" className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgba(31,205,192,0.06),transparent_70%)]"
      />

      <SectionHeading
        eyebrow="Follow along"
        title={
          <>
            Inside the center,
            <br />
            <span className="text-gradient">week to week.</span>
          </>
        }
        lead="Patient wins, new therapies, staff you'll actually meet, and the occasional shot of a very good recliner."
        action={
          <ButtonLink href={site.social.instagram} variant="secondary" external>
            <InstagramGlyph />
            {site.social.instagramHandle}
          </ButtonLink>
        }
      />

      <div className="mt-14">
        <InstagramGrid posts={posts} live={live} />
      </div>
    </Section>
  );
}

function InstagramGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2a3.8 3.8 0 0 1-.9 1.4c-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.3.83-.4.4-.63.8-.83 1.3-.16.4-.35 1-.4 2.1C2.6 9.9 2.6 10.3 2.6 12s0 2.1.07 3.3c.05 1.1.24 1.7.4 2.1.2.5.44.9.83 1.3.4.4.8.63 1.3.83.4.16 1 .35 2.1.4 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.44 1.3-.83.4-.4.63-.8.83-1.3.16-.4.35-1 .4-2.1.07-1.2.07-1.6.07-3.3s0-2.1-.07-3.3c-.05-1.1-.24-1.7-.4-2.1a3.5 3.5 0 0 0-.83-1.3 3.5 3.5 0 0 0-1.3-.83c-.4-.16-1-.35-2.1-.4C15.5 4 15.1 4 12 4Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm6.3-8.3a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z" />
    </svg>
  );
}

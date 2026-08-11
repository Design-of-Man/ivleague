"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { InstagramPost } from "@/lib/instagram";
import { site } from "@/content/site";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Instagram serves square crops at up to 1080px regardless of how small the
 * tile is. Routing them through next/image transcodes to AVIF and cuts the
 * request to the width actually painted — and the optimizer's own cache
 * outlives the short-lived signature on the CDN URL, so a tile that would
 * otherwise 403 between hourly revalidations keeps rendering.
 */
const GRID_SIZES = "(min-width: 1024px) 22vw, (min-width: 640px) 31vw, 46vw";
const LIGHTBOX_SIZES = "(min-width: 768px) 640px, 100vw";

export function InstagramGrid({
  posts,
  live,
}: {
  posts: InstagramPost[];
  live: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) =>
        i === null ? null : (i + dir + posts.length) % posts.length,
      ),
    [posts.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <>
      <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
        {posts.map((post, i) => (
          <StaggerItem key={post.id}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-[0.625rem] border border-white/8 bg-ink-900 text-left"
              aria-label={`Open Instagram post ${i + 1}`}
            >
              {post.placeholder ? (
                <PlaceholderTile post={post} index={i} />
              ) : (
                <Image
                  src={post.thumbnailUrl ?? post.mediaUrl}
                  alt={
                    post.caption
                      ? truncate(post.caption, 120)
                      : "Instagram post"
                  }
                  fill
                  sizes={GRID_SIZES}
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                />
              )}

              {/* Overlay */}
              <span className="absolute inset-0 bg-gradient-to-t from-ink-950/92 via-ink-950/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100">
                <span className="line-clamp-3 text-[12.5px] leading-relaxed text-ink-100">
                  {post.caption}
                </span>
              </span>

              {/* Media-type chip */}
              {post.mediaType !== "IMAGE" && (
                <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-ink-950/60 text-ink-100 backdrop-blur-sm">
                  {post.mediaType === "VIDEO" ? <PlayGlyph /> : <StackGlyph />}
                </span>
              )}

              <span className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-teal-400 opacity-0 shadow-[0_0_10px_rgba(31,205,192,0.9)] transition-opacity duration-500 group-hover:opacity-100" />
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      {!live && (
        <p className="mt-6 text-center text-[12px] text-ink-500">
          Showing sample tiles.{" "}
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-teal-400"
          >
            See the live feed on Instagram
          </a>
          .
        </p>
      )}

      {/* ------------------------------ Lightbox ----------------------------- */}
      {open !== null && (
        <div
          className="lightbox fixed inset-0 z-90 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Instagram post"
        >
          <div
            className="absolute inset-0 bg-ink-950/94 backdrop-blur-xl"
            onClick={close}
          />

          <div className="lightbox-panel relative grid max-h-[86vh] w-full max-w-4xl overflow-hidden rounded-[0.625rem] border border-white/10 bg-ink-900 md:grid-cols-[1.15fr_0.85fr]">
            <div className="relative aspect-square bg-ink-950">
              {posts[open].placeholder ? (
                <PlaceholderTile post={posts[open]} index={open} />
              ) : (
                <Image
                  src={posts[open].mediaUrl}
                  alt={posts[open].caption || "Instagram post"}
                  fill
                  sizes={LIGHTBOX_SIZES}
                  priority
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex max-h-[42vh] flex-col gap-5 overflow-y-auto p-6 md:max-h-none md:p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-teal-300 to-teal-600 text-[13px] font-bold text-ink-950">
                  IV
                </span>
                <div>
                  <div className="text-[13.5px] font-medium text-ink-50">
                    {site.social.instagramHandle}
                  </div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
                    {new Date(posts[open].timestamp).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      },
                    )}
                  </div>
                </div>
              </div>

              <p className="flex-1 whitespace-pre-line text-[14px] leading-relaxed text-ink-300">
                {posts[open].caption}
              </p>

              <a
                href={posts[open].permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-teal-400 text-[14px] font-semibold text-ink-950 transition-colors hover:bg-teal-300"
              >
                View on Instagram
              </a>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink-950/70 text-ink-200 backdrop-blur-sm transition-colors hover:text-teal-300"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="m4 4 8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {[-1, 1].map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => step(dir as 1 | -1)}
              aria-label={dir === 1 ? "Next post" : "Previous post"}
              className={cn(
                "absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-ink-950/70 text-ink-200 backdrop-blur-sm transition-colors hover:text-teal-300 lg:grid",
                dir === 1 ? "right-6" : "left-6",
              )}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d={
                    dir === 1
                      ? "M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
                      : "M13.5 8h-11m0 0L7 3.5M2.5 8 7 12.5"
                  }
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

/**
 * Designed stand-in for a real post — a branded card rather than a grey box, so
 * the section reads as content on day one and swaps to photography the moment a
 * token is configured.
 */
function PlaceholderTile({
  post,
  index,
}: {
  post: InstagramPost;
  index: number;
}) {
  const hue = 168 + ((index * 5) % 15);
  return (
    <div className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-ink-950 p-5 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 100% at ${22 + ((index * 17) % 46)}% ${18 + ((index * 23) % 44)}%, hsl(${hue} 72% 30%) 0%, hsl(${hue + 8} 60% 13%) 46%, #05080b 100%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.11) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(70% 70% at 50% 50%, black, transparent)",
        }}
      />

      <div className="relative flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-teal-400 text-[9px] font-bold text-ink-950">
          IV
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-teal-200/70">
          ivleagueinfusions
        </span>
      </div>

      <p className="relative font-display text-[clamp(0.95rem,0.7rem+0.9vw,1.35rem)] font-semibold leading-[1.15] tracking-tight text-ink-50">
        {post.label}
      </p>

      <div className="relative flex items-center justify-between">
        <span className="h-px w-8 bg-teal-400/70" />
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-400">
          {new Date(post.timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          })}
        </span>
      </div>
    </div>
  );
}

function PlayGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M5 3.5v9l7.5-4.5L5 3.5Z" />
    </svg>
  );
}

function StackGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="2.5"
        width="8"
        height="8"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M5.5 13.5h6a2 2 0 0 0 2-2v-6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

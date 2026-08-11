"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  meta?: ReactNode;
};

export function Accordion({
  items,
  className,
  defaultOpen,
  allowMultiple = false,
}: {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: string;
  allowMultiple?: boolean;
}) {
  const [open, setOpen] = useState<string[]>(defaultOpen ? [defaultOpen] : []);

  const toggle = (id: string) =>
    setOpen((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : allowMultiple
          ? [...prev, id]
          : [id],
    );

  return (
    <div className={cn("divide-y divide-white/8 border-y border-white/8", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        // ids arrive from content (category names, etc.) and can contain
        // spaces, which are illegal in an IDREF and break aria-controls.
        const panelId = `panel-${item.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return (
          <div key={item.id} className="group">
            <h3>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-300"
              >
                <span className="flex flex-1 flex-col gap-1.5">
                  <span
                    className={cn(
                      "text-[17px] font-medium leading-snug transition-colors duration-300 sm:text-lg",
                      isOpen ? "text-teal-200" : "text-ink-50 group-hover:text-teal-100",
                    )}
                  >
                    {item.title}
                  </span>
                  {item.meta && (
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-400">
                      {item.meta}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "relative mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-out-expo)]",
                    isOpen
                      ? "rotate-45 border-teal-400/60 bg-teal-400/12"
                      : "border-white/12 group-hover:border-teal-400/40",
                  )}
                  aria-hidden="true"
                >
                  <span className="absolute h-[1.5px] w-3 rounded-full bg-current text-teal-300" />
                  <span className="absolute h-3 w-[1.5px] rounded-full bg-current text-teal-300" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-7 pr-10 text-[15px] leading-relaxed text-ink-300">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

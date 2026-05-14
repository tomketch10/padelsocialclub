import { cn } from "@/lib/utils";

/**
 * Styled text container for long-form legal/marketing copy.
 * Applies our brand-aware spacing and typography to nested headings, paragraphs, lists, and links.
 */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl mx-auto px-6 py-16 md:py-24 text-foreground/85 leading-relaxed",
        "[&_h1]:font-heading [&_h1]:text-4xl md:[&_h1]:text-5xl [&_h1]:text-primary [&_h1]:mb-8 [&_h1]:uppercase",
        "[&_h2]:font-heading [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:uppercase [&_h2]:tracking-wide",
        "[&_h3]:font-heading [&_h3]:text-xl [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2",
        "[&_p]:mb-4",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1",
        "[&_a]:text-primary [&_a]:underline [&_a:hover]:text-primary/80",
        "[&_strong]:text-foreground",
        "[&_hr]:my-8 [&_hr]:border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

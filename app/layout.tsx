import type { Metadata } from "next";
import { project } from "@/data/project";
import "./globals.css";

/**
 * Root layout.
 *
 * No `next/font` loader: Helvetica Neue is licensed and cannot be served, so
 * it is declared as a `local()` @font-face in globals.css with a fallback
 * stack. See the note at the top of that file.
 *
 * Metadata is read from the project data rather than written twice.
 */

export const metadata: Metadata = {
  title: `${project.meta.name} — ${project.meta.tagline}`,
  description: project.meta.description,
  ...(project.meta.url ? { metadataBase: new URL(project.meta.url) } : {}),
  openGraph: {
    title: project.meta.name,
    description: project.meta.description,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={project.meta.locale} className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

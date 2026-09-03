import type { Metadata } from "next";
import "./globals.css";

/* No next/font loader here: Helvetica Neue is a system face, not a served
   webfont, so it is declared as a stack in globals.css instead. */

export const metadata: Metadata = {
  title: "MW LINE A",
  description: "MW LINE A",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

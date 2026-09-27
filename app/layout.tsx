import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Family Atlas",
  description: "Explore one family's people, places, lineage and stories.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className="antialiased">{children}</body>
    </html>
  );
}

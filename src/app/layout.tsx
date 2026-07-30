import type { Metadata } from "next";
import "./globals.css";
import Curtain from "@/components/motion/Curtain";
import { identity, seo } from "@/content/profile";

/* No webfonts. Type is the native system UI stack, declared in globals.css —
   see --font-system. Nothing to download, no layout shift, and it renders as
   whatever the visitor's platform already uses. */

export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: {
    default: seo.title,
    template: `%s · ${identity.name}`,
  },
  description: seo.description,
  keywords: [identity.name, identity.currentRole, "portfolio", "developer"],
  authors: [{ name: identity.fullName }],
  creator: identity.fullName,
  openGraph: {
    type: "profile",
    title: seo.title,
    description: seo.description,
    url: seo.url,
    siteName: `${identity.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="grain min-h-dvh">
        {/* Reveal animations render from a hidden state. Without JS there is
            nothing to animate them in, so unhide everything up front. */}
        <noscript>
          <style>{`[style*="opacity"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <div aria-hidden className="ambience" />
        <Curtain />
        {children}
      </body>
    </html>
  );
}

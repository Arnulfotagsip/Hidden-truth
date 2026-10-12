import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ArtDefs } from "@/game/art/defs";
import { GameProvider } from "@/components/game/GameProvider";

export const metadata: Metadata = {
  title: "CASE FILES: Hidden Truths",
  description: "A 100-case detective hidden-object and puzzle adventure. Every clue tells a story.",
};

export const viewport: Viewport = {
  themeColor: "#0e1018",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <ArtDefs />
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}

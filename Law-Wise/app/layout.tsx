import "@/src/index.css";
import type { Metadata } from "next";
import { Providers } from "@/src/components/Providers";

export const metadata: Metadata = {
  title: "LawWise",
  description: "AI-powered legal document insights",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}



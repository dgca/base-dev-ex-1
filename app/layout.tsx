import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { minikitConfig } from "@/minikit.config";
import { RootProvider } from "./rootProvider";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "";

  return {
    title: minikitConfig.frame.name,
    description: minikitConfig.frame.description,
    openGraph: {
      title: minikitConfig.frame.name,
      description: minikitConfig.frame.description,
      url: baseUrl,
      siteName: minikitConfig.frame.name,
      images: [
        {
          url: `${baseUrl}/hero.png`,
          width: 1200,
          height: 630,
          alt: minikitConfig.frame.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: minikitConfig.frame.name,
      description: minikitConfig.frame.description,
      images: [`${baseUrl}/hero.png`],
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: baseUrl + "/feedImageUrl.png",
        button: {
          title: `Join the Waitlist`,
          action: {
            type: "launch_frame",
            name: minikitConfig.frame.name,
            url: baseUrl,
            splashImageUrl: minikitConfig.frame.splashImageUrl,
            splashBackgroundColor: "#000000",
          },
        },
      }),
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sourceCodePro.variable}`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tide Charts for Fishing | Tides for Fishing | Fishing Tide Charts",
  description: "Tide charts for fishing with live tides, solunar periods, species bite times and fishing forecasts for 3,300+ US coastal locations across all 23 coastal states.",
  keywords: [
    "tide charts for fishing",
    "tides for fishing",
    "tide chart for fishing",
    "fishing tide chart",
    "live tide charts",
    "solunar periods",
    "fishing forecast",
    "US tide charts",
    "tide predictions",
  ],
  openGraph: {
    title: "Tide Charts for Fishing | Tides for Fishing | Fishing Tide Charts",
    description: "Live tide charts, solunar periods, species bite times and fishing forecasts for 3,300+ US coastal locations.",
    url: "https://tidechartspro.com",
    siteName: "TideChartsPro",
    type: "website",
  },
  alternates: {
    canonical: "https://tidechartspro.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="riEUbWlY7TBJfYqju0PWtKopx20MU6NlJCvJNBjIc1g" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KJJQB4NW02" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KJJQB4NW02');
        `}} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

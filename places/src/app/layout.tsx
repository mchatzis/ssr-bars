import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
    title: 'Your Page Title',
    description: 'Description of your page',
    keywords: 'keyword1, keyword2',
    authors: [{ name: 'Author Name', url: 'https://authorwebsite.com' }],
    openGraph: {
      title: 'Open Graph Title',
      description: 'Open Graph Description',
      url: 'https://yourwebsite.com',
      images: [
        {
          url: 'https://yourwebsite.com/image.jpg',
          width: 800,
          height: 600,
          alt: 'Image Alt Text',
        },
      ],
    },
  };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

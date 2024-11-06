import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";

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
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

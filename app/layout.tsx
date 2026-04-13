import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: "Monricher Construction and Development Corp",
  description:
    "Premium construction, renovation, and fit-out website for Monricher Construction and Development Corp."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${manrope.variable} ${playfair.variable} bg-background font-sans text-text antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

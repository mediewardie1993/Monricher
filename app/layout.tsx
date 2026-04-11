import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display"
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
        className={`${manrope.variable} ${jakarta.variable} bg-background font-sans text-text antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

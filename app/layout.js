import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Login System",
  description: "A simple login system built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-gray-900 text-gray-100`}
      >
        <main className="flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
// Import the Inter font from Google Fonts
import { Inter } from "next/font/google";

// Import global styles
import "./globals.css";

// Initialize the 'Inter' font, setting the required Latin subset and a CSS variable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Define metadata for the web application
export const metadata = {
  title: "Login System",
  description: "A simple login system built with Next.js",
};

// Root layout component that wraps all pages of the application
export default function RootLayout({ children }) {
  return (
    // Set the HTML language attribute and apply the dark theme
    <html lang="en" className="dark">
      <body
        // Apply the imported font, default styling, and background styles to the body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-gray-900 text-gray-100`}
      >
        {/* Main container for the application content */}
        <main className="flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
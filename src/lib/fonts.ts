import { Geist, Geist_Mono } from "next/font/google";

/**
 * Primary sans-serif font - Geist
 * A modern, clean sans-serif font for UI and body text
 */
export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * Monospace font for code blocks and technical content
 */
export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * Font CSS variables to apply to the document
 */
export const fontVariables = `${fontSans.variable} ${fontMono.variable}`;

/**
 * Font class names for direct usage
 */
export const fontClasses = {
  sans: fontSans.className,
  mono: fontMono.className,
};

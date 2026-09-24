import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-body",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-head",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Мемлекеттің демографиялық әлеуеті және халықтың сапасы",
  description:
    "Қазақстанның демографиялық жағдайы туралы интерактивті 3D-презентация: халық саны, әлеммен салыстыру, ауыл мен қала, болашаққа болжам және ұсыныстар.",
};

export const viewport: Viewport = {
  themeColor: "#050b16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="kk" className={`${inter.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}

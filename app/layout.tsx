import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Troyani Inversiones - Tanques Industriales | Soluciones de Almacenamiento",
  description: "Fabricación y venta de tanques industriales certificados. Cisternas, biodigestores y soluciones de almacenamiento a medida con estándares internacionales ASME y API.",
  keywords: "tanques industriales, cisternas, biodigestores, almacenamiento industrial, tanques Rotoplas, ASME, API, Lima, Perú",
  authors: [{ name: "Troyani Inversiones" }],
  openGraph: {
    title: "Troyani Inversiones - Tanques Industriales",
    description: "Soluciones de almacenamiento industrial certificadas con más de 15 años de experiencia",
    url: "https://troyani.com",
    siteName: "Troyani Inversiones",
    locale: "es_PE",
    type: "website",
  },
  icons: {
    icon: "/icon1.ico",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0066CC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
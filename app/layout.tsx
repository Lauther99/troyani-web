import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { site } from "@/lib/site";

// next/font descarga las fuentes en el build y las sirve desde el propio dominio:
// sin peticiones a Google en runtime. Variables WOFF2, subset latin.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://troyani.com"),
  title: {
    default: "Troyani Inversiones | Tanques, cisternas, biodigestores y tolvas",
    template: "%s | Troyani",
  },
  description:
    "Tanques de polietileno, cisternas, biodigestores, tolvas y accesorios. Precios en S/ con IGV, ficha técnica y cotización por WhatsApp.",
  openGraph: {
    siteName: "Troyani Inversiones",
    locale: "es_PE",
    type: "website",
  },
  icons: { icon: "/brand/icon.ico" },
  // La demo no se indexa: sus precios y stock son de referencia.
  robots: site.modo_demo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Excepción a la regla de tokens: la API de metadata exige un literal (= --color-primary).
  themeColor: "#172B3A",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PE" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-control focus:bg-surface focus:px-4 focus:py-2 focus:text-primary"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

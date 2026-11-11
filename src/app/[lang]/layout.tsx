import type { Metadata, Viewport } from "next";
import { Gochi_Hand, Mali } from "next/font/google";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { hasLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import "@/styles/globals.css";

const gochi = Gochi_Hand({ weight: "400", subsets: ["latin"], variable: "--font-gochi", display: "swap" });
const mali = Mali({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-mali", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: "#f4efdf",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { ca: "/ca", es: "/es", "x-default": "/ca" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${lang}`,
      locale: lang === "ca" ? "ca_ES" : "es_ES",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/og.jpg"],
    },
  };
}

function jsonLd(lang: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#negoci`,
    name: site.name,
    description,
    url: `${site.url}/${lang}`,
    image: `${site.url}/og.jpg`,
    logo: `${site.url}/il/logo-joan.webp`,
    telephone: site.phone.replace(/\s/g, ""),
    sameAs: [site.instagram.url, site.googleMaps],
    hasMap: site.googleMaps,
    email: site.titular.email,
    areaServed: { "@type": "AdministrativeArea", name: site.areaServed },
    founder: { "@type": "Person", name: site.person },
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: lang === "ca" ? "Tall de pernil en directe per a casaments i esdeveniments" : "Corte de jamón en directo para bodas y eventos",
      },
    },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <html lang={lang} className={`${gochi.variable} ${mali.variable}`}>
      <head>
        {/* Marca que hay JS antes de pintar, para que las animaciones de entrada no parpadeen */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang, dict.meta.description)).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}

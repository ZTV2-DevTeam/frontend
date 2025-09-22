/**
 * SEO Configuration for FTV Application
 * Centralized configuration for all SEO-related settings
 */

export const SEO_CONFIG = {
  // Site Information
  site: {
    name: "FTV - Kőbányai Szent László Gimnázium",
    title: "FTV - Forgatássszervező Platform",
    description: "A Kőbányai Szent László Gimnázium Média tagozatának forgatásszervező rendszere.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ftv.szlg.info",
    logo: "/logo.png",
    favicon: "/favicon.ico",
    image: "/og-image.png", // Default Open Graph image
  },

  // Organization Information
  organization: {
    name: "Kőbányai Szent László Gimnázium",
    description: "Kőbányai Szent László Gimnázium - Emelt Tömegkommunikáció- és Médiaismeret Tagozat",
    url: "https://szlgbp.hu",
    logo: "/school-logo.png",
    address: {
      streetAddress: "Kőrösi Csoma Sándor út 28-34.",
      addressLocality: "Budapest",
      postalCode: "1102",
      addressCountry: "HU",
    },
    foundingDate: "1907",
    areaServed: "Budapest, Hungary",
  },

  // Default Meta Tags
  defaultMeta: {
    title: "FTV - Forgatássszervező Platform",
    titleTemplate: "%s | FTV - Kőbányai Szent László Gimnázium",
    description: "Professzionális forgatásszervező rendszer a Kőbányai Szent László Gimnázium Média tagozata számára.",
    keywords: [
      "forgatás",
      "média",
      "oktatás",
      "gimnázium",
      "Budapest",
      "Kőbánya",
      "adminisztráció",
      "szervezés",
      "KaCsa",
      "Kamasz Csatorna",
    ],
    author: "FTV Fejlesztői Csapat",
    viewport: "width=device-width, initial-scale=1",
    robots: "index, follow",
    language: "hu",
    charset: "utf-8",
  },


  // Open Graph Defaults
  openGraph: {
    type: "website",
    locale: "hu_HU",
    siteName: "FTV - Kőbányai Szent László Gimnázium",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "FTV - Kőbányai Szent László Gimnázium",
      },
    ],
  },

  // Structured Data Templates
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": "https://szlgbp.hu/",
      name: "Kőbányai Szent László Gimnázium",
      alternateName: "Szent László Gimnázium",
      description: "Kőbányai Szent László Gimnázium - Emelt Tömegkommunikáció- és Médiaismeret Tagozat",
      url: "https://szlgbp.hu",
      logo: {
        "@type": "ImageObject",
        url: "http://szlgbp.hu/static/img/szlgbp_bagoly_512_w.png",
        width: 512,
        height: 512,
      },
      foundingDate: "1907",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kőrösi Csoma Sándor út 28-34.",
        addressLocality: "Budapest",
        postalCode: "1102",
        addressCountry: "HU",
      },
    },
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://ftv.szlg.info/#website",
      name: "FTV - Forgatássszervező Platform",
      description: "A Kőbányai Szent László Gimnázium Média tagozatának forgatásszervező rendszere.",
      url: "https://ftv.szlg.info",
      publisher: {
        "@id": "https://szlgbp.hu/",
      },
      inLanguage: "hu-HU",
    },
  },

  // Sitemap Configuration
  sitemap: {
    changeFrequency: {
      homepage: "daily",
      application: "weekly",
      static: "monthly",
      content: "weekly",
    },
    priority: {
      homepage: 1.0,
      mainPages: 0.9,
      application: 0.8,
      subPages: 0.7,
      static: 0.5,
    },
  },

  // Robots Configuration
  robots: {
    userAgent: "*",
    allow: ["/"],
    disallow: [
      "/api/",
      "/app/api/",
      "/admin/",
      "/_next/",
      "/private/",
      "/*.json$",
      '/tests/',
    ],
    crawlDelay: 1,
    sitemap: "https://ftv.szlgbp.hu/sitemap.xml",
  },
} as const;

export type SEOConfig = typeof SEO_CONFIG;
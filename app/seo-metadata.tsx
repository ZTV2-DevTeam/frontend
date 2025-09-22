import type { Metadata } from 'next';
import { SEO_CONFIG } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: "FTV - Forgatásszervező Platform | Kőbányai Szent László Gimnázium",
  description: "Professzionális forgatásszervező rendszer a Kőbányai Szent László Gimnázium Média tagozata számára.",
  keywords: [
    "forgatás menedzsment",
    "média rendszer",
    "Kőbányai Szent László Gimnázium",
    "FTV",
    "KaCsa",
    "Kamasz Csatorna",
    "Budapest gimnázium",
    "film tagozat",
    "televízió tagozat",
    "média oktatás"
  ],
  openGraph: {
    title: "FTV - Forgatásszervező Platform",
    description: "Professzionális forgatásszervező rendszer a Kőbányai Szent László Gimnázium Média tagozata számára.",
    url: SEO_CONFIG.site.url,
    type: "website",
    locale: "hu_HU",
    siteName: SEO_CONFIG.site.name,
    images: [
      {
        url: `${SEO_CONFIG.site.url}/og-homepage.png`,
        width: 1200,
        height: 630,
        alt: "FTV - Forgatásszervező Platform",
      },
    ],
  },
  alternates: {
    canonical: SEO_CONFIG.site.url,
  },
  other: {
    "og:image:type": "image/png",
    "og:image:secure_url": `${SEO_CONFIG.site.url}/og-homepage.png`,
  },
};

// Generate structured data for homepage
const homepageStructuredData = [
  // Organization data
  SEO_CONFIG.structuredData.organization,
  
  // Website data with search action
  {
    ...SEO_CONFIG.structuredData.website,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SEO_CONFIG.site.url}/app/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  
  // WebApplication data
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FTV - Forgatásszervező Platform",
    description: "Professzionális forgatásszervező rendszer a Kőbányai Szent László Gimnázium Média tagozata számára.",
    url: SEO_CONFIG.site.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "HUF",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@id": `${SEO_CONFIG.organization.url}/#organization`,
    },
    featureList: [
      "Forgatás szervezés és menedzsment",
      "Személyi beosztások kezelése", 
      "KaCsa híradó tartalomkezelés",
      "Média eszköz nyilvántartás",
      "Statisztikák és jelentések",
      "Felhasználói jogosultság rendszer",
    ],
    screenshot: `${SEO_CONFIG.site.url}/app-screenshot.png`,
    softwareVersion: "2.0.0-beta",
    releaseNotes: "Új felhasználói felület, bővített funkciók, jobb teljesítmény",
  },
  
];

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      {homepageStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 0),
          }}
        />
      ))}
      
      {/* Your existing homepage component content */}
    </>
  );
}
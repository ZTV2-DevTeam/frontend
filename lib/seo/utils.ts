import type { Metadata } from "next";
import { SEO_CONFIG } from "./config";

/**
 * SEO Utility Functions
 * Helper functions for generating SEO metadata and structured data
 */

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate comprehensive metadata for Next.js pages
 */
export function generateMetadata(props: SEOProps = {}): Metadata {
  const {
    title,
    description = SEO_CONFIG.defaultMeta.description,
    keywords = SEO_CONFIG.defaultMeta.keywords,
    image,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    author = SEO_CONFIG.defaultMeta.author,
    noIndex = false,
    noFollow = false,
    canonical,
  } = props;

  // Generate full title
  const fullTitle = title 
    ? `${title} | ${SEO_CONFIG.site.title}`
    : SEO_CONFIG.site.title;

  // Generate full URL
  const fullUrl = url 
    ? `${SEO_CONFIG.site.url}${url.startsWith('/') ? url : `/${url}`}`
    : SEO_CONFIG.site.url;

  // Generate image URL
  const imageUrl = image 
    ? (image.startsWith('http') ? image : `${SEO_CONFIG.site.url}${image}`)
    : `${SEO_CONFIG.site.url}${SEO_CONFIG.site.image}`;

  // Robots directive
  const robots = noIndex || noFollow 
    ? `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`
    : SEO_CONFIG.defaultMeta.robots;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: author }],
    creator: author,
    publisher: SEO_CONFIG.organization.name,
    robots,
    alternates: {
      canonical: canonical || fullUrl,
    },
    openGraph: {
      type,
      locale: SEO_CONFIG.openGraph.locale,
      siteName: SEO_CONFIG.openGraph.siteName,
      title: fullTitle,
      description,
      url: fullUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || SEO_CONFIG.site.title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    other: {
      "application-name": SEO_CONFIG.site.name,
      "apple-mobile-web-app-title": SEO_CONFIG.site.name,
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "msapplication-TileColor": "#ffffff",
      "msapplication-tap-highlight": "no",
      "theme-color": "#ffffff",
    },
  };

  return metadata;
}

/**
 * Generate structured data (JSON-LD) for pages
 */
export function generateStructuredData(type: string, data: Record<string, unknown> = {}) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return baseStructuredData;
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SEO_CONFIG.site.url}${item.url}`,
    })),
  };
}

/**
 * Generate WebPage structured data
 */
export function generateWebPageStructuredData(props: {
  name: string;
  description: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
  lastModified?: string;
  author?: string;
}) {
  const { name, description, url, breadcrumbs, lastModified, author } = props;

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SEO_CONFIG.site.url}${url}#webpage`,
    name,
    description,
    url: `${SEO_CONFIG.site.url}${url}`,
    isPartOf: {
      "@id": `${SEO_CONFIG.site.url}/#website`,
    },
    inLanguage: "hu-HU",
    ...(lastModified && { dateModified: lastModified }),
    ...(author && {
      author: {
        "@type": "Person",
        name: author,
      },
    }),
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    structuredData.breadcrumb = {
      "@id": `${SEO_CONFIG.site.url}${url}#breadcrumb`,
    };
  }

  return structuredData;
}

/**
 * Generate Article structured data
 */
export function generateArticleStructuredData(props: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  publisher?: string;
}) {
  const {
    headline,
    description,
    url,
    image,
    author,
    datePublished,
    dateModified,
    publisher = SEO_CONFIG.organization.name,
  } = props;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SEO_CONFIG.site.url}${url}#article`,
    headline,
    description,
    url: `${SEO_CONFIG.site.url}${url}`,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: publisher,
      logo: {
        "@type": "ImageObject",
        url: `${SEO_CONFIG.site.url}${SEO_CONFIG.site.logo}`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SEO_CONFIG.site.url}${url}`,
    },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image.startsWith('http') ? image : `${SEO_CONFIG.site.url}${image}`,
      },
    }),
    inLanguage: "hu-HU",
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Video structured data
 */
export function generateVideoStructuredData(props: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  author?: string;
}) {
  const {
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    contentUrl,
    embedUrl,
    author,
  } = props;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    uploadDate,
    ...(duration && { duration }),
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl }),
    ...(author && {
      author: {
        "@type": "Person",
        name: author,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.organization.name,
      logo: {
        "@type": "ImageObject",
        url: `${SEO_CONFIG.site.url}${SEO_CONFIG.site.logo}`,
      },
    },
  };
}

/**
 * Clean and optimize URL for SEO
 */
export function optimizeUrl(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[áàâäãå]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôöõ]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[ő]/g, 'o')
    .replace(/[ű]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.site.url}${cleanPath}`;
}

/**
 * Validate and clean description for optimal length
 */
export function optimizeDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) {
    return description;
  }
  
  const trimmed = description.substring(0, maxLength - 3);
  const lastSpace = trimmed.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return trimmed.substring(0, lastSpace) + '...';
  }
  
  return trimmed + '...';
}

/**
 * Generate meta keywords from text content
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  const commonWords = new Set([
    'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'the', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'és', 'vagy', 'de', 'hogy', 'ha', 'amikor', 'ahol', 'amely', 'ami', 'egy', 'ez', 'az', 'ezt', 'azt', 'van', 'volt', 'lesz', 'lehet', 'kell', 'fog', 'mint', 'vagy', 'csak', 'már', 'még', 'is', 'nem', 'igen'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));

  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}
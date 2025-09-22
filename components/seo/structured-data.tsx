import React from 'react';
import { 
  generateBreadcrumbStructuredData,
  generateWebPageStructuredData,
  generateArticleStructuredData,
  generateFAQStructuredData,
  generateVideoStructuredData,
  type BreadcrumbItem,
} from '@/lib/seo/utils';
import { SEO_CONFIG } from '@/lib/seo/config';

export interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Component to inject structured data (JSON-LD) into the page head
 */
export function StructuredData({ data }: StructuredDataProps) {
  const jsonData = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {jsonData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item, null, 0),
          }}
        />
      ))}
    </>
  );
}

export interface OrganizationStructuredDataProps {
  customData?: Record<string, unknown>;
}

/**
 * Organization Structured Data Component
 */
export function OrganizationStructuredData({ customData }: OrganizationStructuredDataProps) {
  const data = {
    ...SEO_CONFIG.structuredData.organization,
    ...customData,
  };

  return <StructuredData data={data} />;
}

export interface WebsiteStructuredDataProps {
  customData?: Record<string, unknown>;
}

/**
 * Website Structured Data Component
 */
export function WebsiteStructuredData({ customData }: WebsiteStructuredDataProps) {
  const data = {
    ...SEO_CONFIG.structuredData.website,
    ...customData,
  };

  return <StructuredData data={data} />;
}

export interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb Structured Data Component
 */
export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const data = generateBreadcrumbStructuredData(items);
  return <StructuredData data={data} />;
}

export interface WebPageStructuredDataProps {
  name: string;
  description: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
  lastModified?: string;
  author?: string;
}

/**
 * WebPage Structured Data Component
 */
export function WebPageStructuredData(props: WebPageStructuredDataProps) {
  const data = generateWebPageStructuredData(props);
  return <StructuredData data={data} />;
}

export interface ArticleStructuredDataProps {
  headline: string;
  description: string;
  url: string;
  image?: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  publisher?: string;
}

/**
 * Article Structured Data Component
 */
export function ArticleStructuredData(props: ArticleStructuredDataProps) {
  const data = generateArticleStructuredData(props);
  return <StructuredData data={data} />;
}

export interface FAQStructuredDataProps {
  faqs: Array<{ question: string; answer: string }>;
}

/**
 * FAQ Structured Data Component
 */
export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const data = generateFAQStructuredData(faqs);
  return <StructuredData data={data} />;
}

export interface VideoStructuredDataProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  author?: string;
}

/**
 * Video Structured Data Component
 */
export function VideoStructuredData(props: VideoStructuredDataProps) {
  const data = generateVideoStructuredData(props);
  return <StructuredData data={data} />;
}

/**
 * Default Structured Data Bundle for typical pages
 */
export function DefaultStructuredData() {
  return (
    <>
      <OrganizationStructuredData />
      <WebsiteStructuredData />
    </>
  );
}

export interface LocalBusinessStructuredDataProps {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone?: string;
  email?: string;
  url?: string;
  openingHours?: string[];
  image?: string;
  priceRange?: string;
}

/**
 * Local Business Structured Data Component
 */
export function LocalBusinessStructuredData({
  name,
  description,
  address,
  telephone,
  email,
  url,
  openingHours,
  image,
  priceRange,
}: LocalBusinessStructuredDataProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    address: {
      "@type": "PostalAddress",
      ...address,
    },
    ...(telephone && { telephone }),
    ...(email && { email }),
    ...(url && { url }),
    ...(openingHours && { openingHours }),
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image.startsWith('http') ? image : `${SEO_CONFIG.site.url}${image}`,
      },
    }),
    ...(priceRange && { priceRange }),
  };

  return <StructuredData data={data} />;
}

export interface EventStructuredDataProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address?: {
      streetAddress: string;
      addressLocality: string;
      postalCode: string;
      addressCountry: string;
    };
  };
  organizer?: {
    name: string;
    url?: string;
  };
  offers?: {
    price: string;
    priceCurrency: string;
    availability: string;
    url?: string;
  };
  image?: string;
}

/**
 * Event Structured Data Component
 */
export function EventStructuredData({
  name,
  description,
  startDate,
  endDate,
  location,
  organizer,
  offers,
  image,
}: EventStructuredDataProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    location: {
      "@type": "Place",
      name: location.name,
      ...(location.address && {
        address: {
          "@type": "PostalAddress",
          ...location.address,
        },
      }),
    },
    ...(organizer && {
      organizer: {
        "@type": "Organization",
        ...organizer,
      },
    }),
    ...(offers && {
      offers: {
        "@type": "Offer",
        ...offers,
      },
    }),
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image.startsWith('http') ? image : `${SEO_CONFIG.site.url}${image}`,
      },
    }),
  };

  return <StructuredData data={data} />;
}
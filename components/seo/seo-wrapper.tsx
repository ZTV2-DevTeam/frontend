import React from 'react';
import { generateWebPageStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo/utils';
import { generateBreadcrumbsFromUrl } from '@/lib/seo/url-utils';
import { DefaultStructuredData } from './structured-data';
import { SEOLinks } from './seo-links';
import { MetaTags } from './meta-tags';

export interface SEOWrapperProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  customStructuredData?: Record<string, unknown> | Record<string, unknown>[];
  preloadResources?: Array<{
    href: string;
    as: 'script' | 'style' | 'image' | 'font' | 'document';
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }>;
}

/**
 * Comprehensive SEO Wrapper Component
 * Combines all SEO features into a single wrapper component
 */
export function SEOWrapper({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  noIndex = false,
  noFollow = false,
  canonical,
  children,
  showBreadcrumbs = true,
  customStructuredData,
  preloadResources = [],
}: SEOWrapperProps) {
  // Generate breadcrumbs
  const breadcrumbs = showBreadcrumbs ? generateBreadcrumbsFromUrl(url) : [];
  
  // Generate structured data
  const webPageData = generateWebPageStructuredData({
    name: title || 'FTV Page',
    description: description || 'FTV Application Page',
    url,
    breadcrumbs: breadcrumbs.length > 1 ? breadcrumbs : undefined,
    lastModified: modifiedTime,
    author,
  });

  const breadcrumbData = breadcrumbs.length > 1 
    ? generateBreadcrumbStructuredData(breadcrumbs)
    : null;

  const allStructuredData = [
    webPageData,
    ...(breadcrumbData ? [breadcrumbData] : []),
    ...(customStructuredData ? (Array.isArray(customStructuredData) ? customStructuredData : [customStructuredData]) : []),
  ];

  return (
    <>
      {/* Meta Tags */}
      <MetaTags
        title={title}
        description={description}
        keywords={keywords}
        image={image}
        url={url}
        type={type}
        author={author}
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        noIndex={noIndex}
        noFollow={noFollow}
        canonical={canonical}
      />

      {/* SEO Links */}
      <SEOLinks
        canonical={canonical || url}
        preload={preloadResources}
      />

      {/* Structured Data */}
      <DefaultStructuredData />
      {allStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 0),
          }}
        />
      ))}

      {/* Page Content */}
      {children}
    </>
  );
}

export interface PageSEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  customMeta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}

/**
 * Simplified Page SEO Component for use in page metadata
 */
export function PageSEO({
  title,
  description,
  url,
  image,
  keywords,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  breadcrumbs,
  customMeta = [],
}: PageSEOProps) {
  const webPageData = generateWebPageStructuredData({
    name: title,
    description,
    url,
    breadcrumbs,
    lastModified: modifiedTime,
    author,
  });

  const breadcrumbData = breadcrumbs && breadcrumbs.length > 1 
    ? generateBreadcrumbStructuredData(breadcrumbs)
    : null;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      {author && <meta name="author" content={author} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Instagram & Messenger Optimization */}
      <meta property="instagram:title" content={title} />
      <meta property="instagram:description" content={description} />
      {image && <meta property="instagram:image" content={image} />}
      
      {/* Custom Meta */}
      {customMeta.map((meta, index) => (
        <meta
          key={index}
          {...(meta.name && { name: meta.name })}
          {...(meta.property && { property: meta.property })}
          content={meta.content}
        />
      ))}
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageData, null, 0),
        }}
      />
      
      {breadcrumbData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData, null, 0),
          }}
        />
      )}
    </>
  );
}

export interface SEODebugProps {
  data: {
    title?: string;
    description?: string;
    keywords?: string[];
    url?: string;
    canonical?: string;
    structured?: Record<string, unknown>[];
  };
}

/**
 * SEO Debug Component for development
 */
export function SEODebug({ data }: SEODebugProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <details className="fixed bottom-4 right-4 bg-black text-white p-4 rounded z-50 max-w-md text-xs">
      <summary className="cursor-pointer font-bold">SEO Debug Info</summary>
      <div className="mt-2 space-y-2">
        <div>
          <strong>Title:</strong> {data.title || 'Not set'}
          <br />
          <small>Length: {data.title?.length || 0} chars</small>
        </div>
        
        <div>
          <strong>Description:</strong> {data.description || 'Not set'}
          <br />
          <small>Length: {data.description?.length || 0} chars</small>
        </div>
        
        <div>
          <strong>Keywords:</strong> {data.keywords?.join(', ') || 'Not set'}
          <br />
          <small>Count: {data.keywords?.length || 0}</small>
        </div>
        
        <div>
          <strong>URL:</strong> {data.url || 'Not set'}
        </div>
        
        <div>
          <strong>Canonical:</strong> {data.canonical || 'Not set'}
        </div>
        
        <div>
          <strong>Structured Data:</strong> {data.structured?.length || 0} items
        </div>
      </div>
    </details>
  );
}
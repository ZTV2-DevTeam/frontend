import React from 'react';
import { SEO_CONFIG } from '@/lib/seo/config';

export interface CanonicalLinkProps {
  url: string;
}

/**
 * Canonical Link Component
 * Generates proper canonical URL tag for SEO
 */
export function CanonicalLink({ url }: CanonicalLinkProps) {
  const canonicalUrl = url.startsWith('http') 
    ? url 
    : `${SEO_CONFIG.site.url}${url.startsWith('/') ? url : `/${url}`}`;

  return <link rel="canonical" href={canonicalUrl} />;
}

export interface HreflangLink {
  lang: string;
  href: string;
}

export interface HreflangLinksProps {
  links: HreflangLink[];
  currentUrl: string;
}

/**
 * Hreflang Links Component
 * Generates hreflang attributes for international SEO
 */
export function HreflangLinks({ links, currentUrl }: HreflangLinksProps) {
  const selfLink = {
    lang: 'hu',
    href: currentUrl.startsWith('http') 
      ? currentUrl 
      : `${SEO_CONFIG.site.url}${currentUrl}`,
  };

  const allLinks = [selfLink, ...links];

  return (
    <>
      {allLinks.map((link) => (
        <link
          key={link.lang}
          rel="alternate"
          hrefLang={link.lang}
          href={link.href}
        />
      ))}
      {/* x-default for international targeting */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={selfLink.href}
      />
    </>
  );
}

export interface AlternateLinksProps {
  currentUrl: string;
  alternateVersions?: Array<{
    media?: string;
    href: string;
    title?: string;
    type?: string;
  }>;
}

/**
 * Alternate Links Component
 * Generates alternate link tags for different versions/formats
 */
export function AlternateLinks({ currentUrl, alternateVersions = [] }: AlternateLinksProps) {
  const baseUrl = currentUrl.startsWith('http') 
    ? currentUrl 
    : `${SEO_CONFIG.site.url}${currentUrl}`;

  return (
    <>
      {/* Self reference */}
      <link rel="self" href={baseUrl} />
      
      {/* RSS/Atom feeds if applicable */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${SEO_CONFIG.site.name} RSS Feed`}
        href={`${SEO_CONFIG.site.url}/feed.xml`}
      />
      
      <link
        rel="alternate"
        type="application/atom+xml"
        title={`${SEO_CONFIG.site.name} Atom Feed`}
        href={`${SEO_CONFIG.site.url}/atom.xml`}
      />
      
      {/* Custom alternate versions */}
      {alternateVersions.map((version, index) => (
        <link
          key={index}
          rel="alternate"
          {...(version.media && { media: version.media })}
          {...(version.type && { type: version.type })}
          {...(version.title && { title: version.title })}
          href={version.href}
        />
      ))}
    </>
  );
}

export interface PrevNextLinksProps {
  prevUrl?: string;
  nextUrl?: string;
}

/**
 * Previous/Next Links Component
 * Generates rel="prev" and rel="next" for pagination
 */
export function PrevNextLinks({ prevUrl, nextUrl }: PrevNextLinksProps) {
  return (
    <>
      {prevUrl && (
        <link
          rel="prev"
          href={prevUrl.startsWith('http') 
            ? prevUrl 
            : `${SEO_CONFIG.site.url}${prevUrl}`
          }
        />
      )}
      {nextUrl && (
        <link
          rel="next"
          href={nextUrl.startsWith('http') 
            ? nextUrl 
            : `${SEO_CONFIG.site.url}${nextUrl}`
          }
        />
      )}
    </>
  );
}

export interface PreloadLinksProps {
  resources: Array<{
    href: string;
    as: 'script' | 'style' | 'image' | 'font' | 'document';
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }>;
}

/**
 * Preload Links Component
 * Generates resource preload hints for performance
 */
export function PreloadLinks({ resources }: PreloadLinksProps) {
  return (
    <>
      {resources.map((resource, index) => (
        <link
          key={index}
          rel="preload"
          href={resource.href}
          as={resource.as}
          {...(resource.type && { type: resource.type })}
          {...(resource.crossOrigin && { crossOrigin: resource.crossOrigin })}
        />
      ))}
    </>
  );
}

export interface PrefetchLinksProps {
  urls: string[];
}

/**
 * Prefetch Links Component
 * Generates DNS prefetch and preconnect hints
 */
export function PrefetchLinks({ urls }: PrefetchLinksProps) {
  return (
    <>
      {urls.map((url) => (
        <React.Fragment key={url}>
          <link rel="dns-prefetch" href={url} />
          {url.includes('googleapis') || url.includes('gstatic') ? (
            <link rel="preconnect" href={url} crossOrigin="anonymous" />
          ) : (
            <link rel="preconnect" href={url} />
          )}
        </React.Fragment>
      ))}
    </>
  );
}

export interface SEOLinksProps {
  canonical?: string;
  hreflang?: HreflangLink[];
  prev?: string;
  next?: string;
  alternates?: Array<{
    media?: string;
    href: string;
    title?: string;
    type?: string;
  }>;
  preload?: Array<{
    href: string;
    as: 'script' | 'style' | 'image' | 'font' | 'document';
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }>;
  prefetch?: string[];
}

/**
 * Comprehensive SEO Links Component
 * Combines all SEO-related link tags
 */
export function SEOLinks({
  canonical,
  hreflang = [],
  prev,
  next,
  alternates = [],
  preload = [],
  prefetch = [],
}: SEOLinksProps) {
  const currentUrl = canonical || '/';

  return (
    <>
      {/* Canonical URL */}
      {canonical && <CanonicalLink url={canonical} />}
      
      {/* Hreflang Links */}
      {hreflang.length > 0 && (
        <HreflangLinks links={hreflang} currentUrl={currentUrl} />
      )}
      
      {/* Pagination Links */}
      <PrevNextLinks prevUrl={prev} nextUrl={next} />
      
      {/* Alternate Links */}
      <AlternateLinks currentUrl={currentUrl} alternateVersions={alternates} />
      
      {/* Performance Links */}
      {preload.length > 0 && <PreloadLinks resources={preload} />}
      {prefetch.length > 0 && <PrefetchLinks urls={prefetch} />}
    </>
  );
}
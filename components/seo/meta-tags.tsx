import React from 'react';
import { type SEOProps } from '@/lib/seo/utils';
import { SEO_CONFIG } from '@/lib/seo/config';

export interface MetaTagsProps extends SEOProps {
  className?: string;
}

/**
 * Dynamic Meta Tags Component
 * Generates comprehensive meta tags for improved SEO
 */
export function MetaTags(props: MetaTagsProps) {
  const {
    title,
    description = SEO_CONFIG.defaultMeta.description,
    keywords = SEO_CONFIG.defaultMeta.keywords,
    image,
    url,
    type = "website",
    author = SEO_CONFIG.defaultMeta.author,
    noIndex = false,
    noFollow = false,
    canonical,
    publishedTime,
    modifiedTime,
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

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="language" content="hu" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || fullUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SEO_CONFIG.openGraph.siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title || SEO_CONFIG.site.title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={SEO_CONFIG.openGraph.locale} />
      
      {/* Article specific Open Graph tags */}
      {type === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:author" content={author} />
          <meta property="article:section" content="Media" />
          {keywords.map((keyword) => (
            <meta key={keyword} property="article:tag" content={keyword} />
          ))}
        </>
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="application-name" content={SEO_CONFIG.site.name} />
      <meta name="apple-mobile-web-app-title" content={SEO_CONFIG.site.name} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Social Media App Links */}
      <meta property="al:ios:app_name" content="Instagram" />
      <meta property="al:ios:app_store_id" content="389801252" />
      <meta property="al:android:app_name" content="Instagram" />
      <meta property="al:android:package" content="com.instagram.android" />
      
      <meta property="al:ios:app_name" content="Messenger" />
      <meta property="al:ios:app_store_id" content="454638411" />
      <meta property="al:android:app_name" content="Messenger" />
      <meta property="al:android:package" content="com.facebook.orca" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* DNS prefetch for better performance */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    </>
  );
}

export interface OpenGraphTagsProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article" | "profile";
  siteName?: string;
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

/**
 * Standalone Open Graph Tags Component
 */
export function OpenGraphTags({
  title,
  description,
  url,
  image,
  type = "website",
  siteName = SEO_CONFIG.openGraph.siteName,
  locale = SEO_CONFIG.openGraph.locale,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: OpenGraphTagsProps) {
  const fullUrl = url.startsWith('http') ? url : `${SEO_CONFIG.site.url}${url}`;
  const imageUrl = image 
    ? (image.startsWith('http') ? image : `${SEO_CONFIG.site.url}${image}`)
    : `${SEO_CONFIG.site.url}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(SEO_CONFIG.organization.name)}&type=${encodeURIComponent(type)}`;

  return (
    <>
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/svg+xml" />
      <meta property="og:locale" content={locale} />
      
      {/* Article specific tags */}
      {type === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
    </>
  );
}

export interface MessengerCardTagsProps {
  title: string;
  description: string;
  image?: string;
  url: string;
}

/**
 * Messenger Sharing Tags Component
 */
export function MessengerCardTags({
  title,
  description,
  image,
  url,
}: MessengerCardTagsProps) {
  const imageUrl = image 
    ? (image.startsWith('http') ? image : `${SEO_CONFIG.site.url}${image}`)
    : `${SEO_CONFIG.site.url}/api/og?title=${encodeURIComponent(title)}`;

  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="fb:app_id" content="your-facebook-app-id" />
    </>
  );
}

export interface InstagramSharingTagsProps {
  title: string;
  description: string;
  image?: string;
  url: string;
}

/**
 * Instagram Sharing Optimization Tags Component
 */
export function InstagramSharingTags({
  title,
  description,
  image,
  url,
}: InstagramSharingTagsProps) {
  const imageUrl = image 
    ? (image.startsWith('http') ? image : `${SEO_CONFIG.site.url}${image}`)
    : `${SEO_CONFIG.site.url}/api/og?title=${encodeURIComponent(title)}`;

  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1080" />
      <meta property="og:image:height" content="1080" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta property="article:author" content="@szlgbp" />
    </>
  );
}
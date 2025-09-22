/**
 * SEO Components Export
 * Centralized exports for all SEO React components
 */

// Meta Tags Components
export { MetaTags, OpenGraphTags, MessengerCardTags, InstagramSharingTags } from './meta-tags';
export type { MetaTagsProps, OpenGraphTagsProps, MessengerCardTagsProps, InstagramSharingTagsProps } from './meta-tags';

// Structured Data Components
export {
  StructuredData,
  OrganizationStructuredData,
  WebsiteStructuredData,
  BreadcrumbStructuredData,
  WebPageStructuredData,
  ArticleStructuredData,
  FAQStructuredData,
  VideoStructuredData,
  DefaultStructuredData,
  LocalBusinessStructuredData,
  EventStructuredData,
} from './structured-data';

export type {
  StructuredDataProps,
  OrganizationStructuredDataProps,
  WebsiteStructuredDataProps,
  BreadcrumbStructuredDataProps,
  WebPageStructuredDataProps,
  ArticleStructuredDataProps,
  FAQStructuredDataProps,
  VideoStructuredDataProps,
  LocalBusinessStructuredDataProps,
  EventStructuredDataProps,
} from './structured-data';

// SEO Links Components
export {
  CanonicalLink,
  HreflangLinks,
  AlternateLinks,
  PrevNextLinks,
  PreloadLinks,
  PrefetchLinks,
  SEOLinks,
} from './seo-links';

export type {
  CanonicalLinkProps,
  HreflangLink,
  HreflangLinksProps,
  AlternateLinksProps,
  PrevNextLinksProps,
  PreloadLinksProps,
  PrefetchLinksProps,
  SEOLinksProps,
} from './seo-links';

// SEO Head Component
export { SEOHead } from './seo-head';
export type { SEOHeadProps } from './seo-head';

// SEO Wrapper Components
export { SEOWrapper, PageSEO, SEODebug } from './seo-wrapper';
export type { SEOWrapperProps, PageSEOProps, SEODebugProps } from './seo-wrapper';

// SEO Image Components
export {
  SEOImage,
  LazyImage,
  ResponsiveImage,
  ImageGallery,
  generateImageSizes,
  createBlurDataURL,
  useImagePerformance,
} from './seo-image';

export type {
  SEOImageProps,
  LazyImageProps,
  ResponsiveImageProps,
  ImageGalleryProps,
} from './seo-image';
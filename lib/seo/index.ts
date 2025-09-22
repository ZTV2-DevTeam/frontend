/**
 * SEO Components and Utilities Export
 * Centralized exports for all SEO-related functionality
 */

// Configuration
export { SEO_CONFIG } from './config';
export type { SEOConfig } from './config';

// Utilities
export {
  generateMetadata,
  generateStructuredData,
  generateBreadcrumbStructuredData,
  generateWebPageStructuredData,
  generateArticleStructuredData,
  generateFAQStructuredData,
  generateVideoStructuredData,
  optimizeUrl,
  generateCanonicalUrl,
  optimizeDescription,
  extractKeywords,
} from './utils';

export type {
  SEOProps,
  BreadcrumbItem,
} from './utils';

// URL Utilities
export {
  createSlug,
  generateContentUrl,
  parseIdFromUrl,
  validateUrlStructure,
  generateBreadcrumbsFromUrl,
  generateCanonicalUrl as generateCanonicalUrlFromPath,
  cleanQueryParams,
  generateUrlVariants,
  isExternalUrl,
  generateSocialUrls,
} from './url-utils';
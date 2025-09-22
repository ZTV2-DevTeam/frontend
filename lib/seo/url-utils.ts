/**
 * URL and SEO utilities for the FTV application
 * Functions for creating SEO-friendly URLs and managing URL structures
 */

import { SEO_CONFIG } from './config';

/**
 * Generate SEO-friendly slug from text
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Handle Hungarian characters
    .replace(/[áàâäãå]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôöõő]/g, 'o')
    .replace(/[úùûüű]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[ý]/g, 'y')
    // Remove special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Remove multiple hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '');
}

/**
 * Generate SEO-friendly URL for different content types
 */
export function generateContentUrl(
  type: 'filming' | 'announcement' | 'kacsa' | 'user' | 'help',
  data: {
    id: string | number;
    title?: string;
    name?: string;
    slug?: string;
  }
): string {
  const baseUrls = {
    filming: '/app/forgatasok',
    announcement: '/app/kozlemenyek',
    kacsa: '/app/kacsa',
    user: '/app/felhasznalok',
    help: '/app/segitseg',
  };

  const baseUrl = baseUrls[type];
  
  if (data.slug) {
    return `${baseUrl}/${data.slug}`;
  }
  
  if (data.title) {
    const slug = createSlug(data.title);
    return `${baseUrl}/${data.id}-${slug}`;
  }
  
  if (data.name) {
    const slug = createSlug(data.name);
    return `${baseUrl}/${data.id}-${slug}`;
  }
  
  return `${baseUrl}/${data.id}`;
}

/**
 * Parse ID from SEO-friendly URL
 */
export function parseIdFromUrl(url: string): string | null {
  const segments = url.split('/');
  const lastSegment = segments[segments.length - 1];
  
  // Check if it's a simple ID
  if (/^\d+$/.test(lastSegment)) {
    return lastSegment;
  }
  
  // Check if it's ID-slug format
  const match = lastSegment.match(/^(\d+)-.+/);
  if (match) {
    return match[1];
  }
  
  return null;
}

/**
 * Validate URL structure for SEO compliance
 */
export function validateUrlStructure(url: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check length
  if (url.length > 255) {
    issues.push('URL is too long (over 255 characters)');
    suggestions.push('Consider shortening the URL or using a slug');
  }
  
  // Check for special characters
  if (/[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]/.test(url)) {
    issues.push('URL contains invalid characters');
    suggestions.push('Use only alphanumeric characters, hyphens, and standard URL characters');
  }
  
  // Check for spaces
  if (url.includes(' ')) {
    issues.push('URL contains spaces');
    suggestions.push('Replace spaces with hyphens or URL encoding');
  }
  
  // Check for multiple consecutive hyphens
  if (url.includes('--')) {
    issues.push('URL contains consecutive hyphens');
    suggestions.push('Use single hyphens to separate words');
  }
  
  // Check for trailing slash consistency
  if (url.length > 1 && url.endsWith('/')) {
    suggestions.push('Consider removing trailing slash for consistency');
  }
  
  // Check depth
  const depth = url.split('/').length - 1;
  if (depth > 5) {
    issues.push('URL is too deep (more than 5 levels)');
    suggestions.push('Consider flattening the URL structure');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}

/**
 * Generate breadcrumb data from URL
 */
export function generateBreadcrumbsFromUrl(url: string): Array<{
  name: string;
  url: string;
}> {
  const segments = url.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Főoldal', url: '/' }];
  
  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    
    // Map segments to readable names
    const segmentName = mapSegmentToName(segments[i]);
    
    if (segmentName) {
      breadcrumbs.push({
        name: segmentName,
        url: currentPath,
      });
    }
  }
  
  return breadcrumbs;
}

/**
 * Map URL segment to readable name for breadcrumbs
 */
function mapSegmentToName(segment: string): string {
  const segmentMap: Record<string, string> = {
    'app': 'Alkalmazás',
    'forgatasok': 'Forgatások',
    'uj': 'Új forgatás',
    'kozlemenyek': 'Közlemények',
    'kacsa': 'KaCsa',
    'beosztas': 'Beosztás',
    'beallitasok': 'Beállítások',
    'segitseg': 'Segítség',
    'admin-utmutato': 'Admin útmutató',
    'iranyitopult': 'Irányítópult',
    'first-steps': 'Első lépések',
    'changelog': 'Változásnapló',
    'technical-details': 'Technikai részletek',
    'design-guide': 'Design útmutató',
    'privacy-policy': 'Adatvédelmi szabályzat',
    'terms-of-service': 'Felhasználási feltételek',
    'login': 'Bejelentkezés',
    'felhasznalok': 'Felhasználók',
    'statisztikak': 'Statisztikák',
    'eszkozok': 'Eszközök',
  };
  
  // Direct mapping
  if (segmentMap[segment]) {
    return segmentMap[segment];
  }
  
  // Check if it's an ID-slug format
  const match = segment.match(/^(\d+)-(.+)/);
  if (match) {
    return match[2].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  // Check if it's just a number (ID)
  if (/^\d+$/.test(segment)) {
    return `Elem #${segment}`;
  }
  
  // Fallback: capitalize and replace hyphens with spaces
  return segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Generate canonical URL with proper formatting
 */
export function generateCanonicalUrl(path: string): string {
  // Remove query parameters and fragments for canonical URL
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // Ensure path starts with /
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  // Remove trailing slash unless it's the root
  const finalPath = normalizedPath.length > 1 && normalizedPath.endsWith('/') 
    ? normalizedPath.slice(0, -1) 
    : normalizedPath;
  
  return `${SEO_CONFIG.site.url}${finalPath}`;
}

/**
 * Extract and clean query parameters for SEO
 */
export function cleanQueryParams(url: string, allowedParams: string[] = []): string {
  const urlObj = new URL(url, SEO_CONFIG.site.url);
  const cleanParams = new URLSearchParams();
  
  // Only keep allowed parameters
  allowedParams.forEach(param => {
    const value = urlObj.searchParams.get(param);
    if (value) {
      cleanParams.set(param, value);
    }
  });
  
  const cleanQuery = cleanParams.toString();
  return `${urlObj.pathname}${cleanQuery ? `?${cleanQuery}` : ''}`;
}

/**
 * Generate URL variants for testing and optimization
 */
export function generateUrlVariants(baseUrl: string, title?: string): {
  short: string;
  descriptive: string;
  seoOptimized: string;
} {
  const id = parseIdFromUrl(baseUrl);
  const basePath = baseUrl.replace(/\/[^/]*$/, '');
  
  return {
    short: id ? `${basePath}/${id}` : baseUrl,
    descriptive: title ? `${basePath}/${createSlug(title)}` : baseUrl,
    seoOptimized: title && id ? `${basePath}/${id}-${createSlug(title)}` : baseUrl,
  };
}

/**
 * Check if URL is external
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const siteObj = new URL(SEO_CONFIG.site.url);
    return urlObj.hostname !== siteObj.hostname;
  } catch {
    return false;
  }
}

/**
 * Generate social sharing URLs
 */
export function generateSocialUrls(url: string, title: string, description?: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : '';
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    instagram: `https://www.instagram.com/`,
    messenger: `https://www.messenger.com/`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription} ${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };
}
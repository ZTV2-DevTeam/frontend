# FTV Advanced SEO Implementation Guide

## Overview

This document details the comprehensive SEO implementation for the FTV (Forgatásszervező Platform) application, featuring advanced meta tags, dynamic Open Graph image generation, structured data, and optimized social media sharing for Instagram and Messenger.

## 🚀 Features Implemented

### 1. Dynamic OG Image Generation
- **SVG-based dynamic images**: `/api/og` endpoint generates custom Open Graph images on-demand
- **Theme support**: Light and dark mode themes
- **Content types**: Different visual styles for articles, profiles, and default pages
- **Performance optimized**: Aggressive caching (1-year cache headers)
- **Parameters**:
  - `title`: Custom title text
  - `subtitle`: Subtitle text (defaults to organization name)
  - `theme`: `light` or `dark`
  - `type`: `default`, `article`, `profile`, etc.
  - `width`: Image width (default: 1200px)
  - `height`: Image height (default: 630px)

### 2. Meta Tags System

#### Core Meta Tags (`components/seo/meta-tags.tsx`)
- **MetaTags**: Comprehensive meta tag component with SEO optimization
- **OpenGraphTags**: Enhanced OpenGraph implementation with dynamic image generation
- **InstagramSharingTags**: Optimized sharing for Instagram stories and DMs
- **MessengerCardTags**: Facebook Messenger sharing optimization

#### Key Features:
- Dynamic title and description generation
- Automatic image optimization with fallback to generated OG images
- Proper URL canonicalization
- Multi-language support (Hungarian primary, English alternate)
- Schema.org structured data integration

### 3. Social Media Integration

#### Supported Platforms:
- ✅ **Instagram**: Optimized for sharing in stories and DMs
- ✅ **Facebook/Messenger**: Enhanced sharing cards
- ❌ **Twitter**: Removed per user requirements

#### Instagram Optimization:
- Square image format (1080x1080) for Instagram posts
- Stories-optimized meta tags
- Instagram DM deep linking support

#### Messenger Integration:
- Facebook App ID integration
- Rich message previews
- Messenger-specific sharing URLs

### 4. Structured Data (JSON-LD)

#### Organization Schema:
```json
{
  "@type": "EducationalOrganization",
  "name": "Kőbányai Szent László Gimnázium",
  "description": "Média és kommunikáció specializációval rendelkező gimnázium",
  "url": "https://szlgbp.hu/",
  "logo": "https://ftv.szlg.info/logo.png"
}
```

#### Website Schema:
- SearchAction implementation
- Breadcrumb navigation
- Site-wide structured data

#### WebApplication Schema:
- Feature list documentation
- Publisher information
- Version and release notes

### 5. Technical SEO

#### XML Sitemap (`/sitemap.xml`)
- Dynamic generation based on app structure
- Proper priority and changefreq settings
- Multi-language URL support
- Automatic last modified timestamps

#### Robots.txt (`/robots.txt`)
- Optimized for search engines and social media crawlers
- Sitemap reference
- Proper disallow rules for admin areas
- Instagram and Facebook bot support

#### Performance Optimizations:
- Preconnect to external domains
- DNS prefetch for critical resources
- Resource hints for fonts and images
- Optimized caching strategies

## 📁 File Structure

```
lib/seo/
├── config.ts              # Central SEO configuration
├── utils.ts               # SEO utility functions
└── url-utils.ts           # URL helpers and social sharing

components/seo/
├── index.ts               # SEO components exports
├── meta-tags.tsx          # Meta tag components
├── structured-data.tsx    # JSON-LD structured data
├── seo-links.tsx          # SEO-related links
├── seo-image.tsx          # Image optimization
└── seo-wrapper.tsx        # Complete SEO wrapper

app/
├── layout.tsx             # Root layout with global SEO
├── sitemap.xml/route.ts   # Dynamic sitemap generation
├── robots.txt/route.ts    # Dynamic robots.txt
└── api/og/route.ts        # Dynamic OG image generation
```

## 🛠️ Usage Examples

### Basic Page SEO:
```tsx
import { MetaTags } from '@/components/seo';

export default function AboutPage() {
  return (
    <>
      <MetaTags
        title="Rólunk - FTV Platform"
        description="Tudj meg többet a Kőbányai Szent László Gimnázium Média tagozatáról"
        type="article"
      />
      {/* Page content */}
    </>
  );
}
```

### Custom OG Image:
```tsx
<MetaTags
  title="Forgatás Esemény"
  description="Következő forgatásunk részletei"
  image="/api/og?title=Forgatás%20Esemény&theme=dark&type=filming"
/>
```

### Instagram Sharing:
```tsx
import { InstagramSharingTags } from '@/components/seo';

<InstagramSharingTags
  title="Legújabb projektünk"
  description="Tekintsd meg a gimnázium legújabb média projektjét"
  url="/projects/latest"
/>
```

## 🎨 OG Image Customization

### URL Parameters:
- **Basic**: `/api/og?title=Custom%20Title`
- **Themed**: `/api/og?title=Article&theme=dark&type=article`
- **Sized**: `/api/og?title=Square&width=1080&height=1080`

### Color Themes:
- **Light**: Clean white background with blue accents
- **Dark**: Dark slate background with bright blue accents

### Content Types:
- **default**: Standard layout with logo
- **article**: Film strip decorative elements
- **filming**: Enhanced media-focused design
- **profile**: User-focused layout

## 📈 Performance Features

### Caching Strategy:
- **OG Images**: 1-year cache with immutable headers
- **Sitemap**: 1-hour cache with revalidation
- **Robots.txt**: 24-hour cache

### Image Optimization:
- SVG format for crisp scaling
- Minimal file sizes
- Proper alt text generation
- Responsive image hints

## 🔧 Configuration

### SEO Config (`lib/seo/config.ts`):
```typescript
export const SEO_CONFIG = {
  site: {
    name: "FTV - Kőbányai Szent László Gimnázium",
    title: "FTV - Forgatásszervező Platform",
    description: "A Kőbányai Szent László Gimnázium Média tagozatának forgatásszervező rendszere.",
    url: "https://ftv.szlg.info",
    logo: "/logo.png",
    favicon: "/favicon.ico",
    image: "/og-default.png"
  },
  organization: {
    name: "Kőbányai Szent László Gimnázium",
    url: "https://szlgbp.hu/",
    description: "Média és kommunikáció specializációval rendelkező gimnázium Budapest XX. kerületében.",
    email: "info@szlgbp.hu",
    phone: "+36-1-262-5630",
    address: {
      street: "Bp., Kőbányai út 31.",
      city: "Budapest",
      postalCode: "1239",
      country: "Hungary"
    }
  },
  social: {
    instagram: "https://www.instagram.com/szlgbp/",
    messenger: "https://m.me/szlgbp",
    youtube: "https://www.youtube.com/@szlgbp",
    website: "https://szlgbp.hu/"
  }
};
```

## 🚀 Deployment Notes

### Environment Variables:
- Ensure `NEXT_PUBLIC_SITE_URL` is set for production
- Configure proper domain for Open Graph images
- Set up analytics and monitoring

### Verification:
1. **Open Graph Debugger**: Use Facebook's sharing debugger
2. **Instagram Testing**: Test sharing in Instagram stories
3. **Google Rich Results**: Test structured data
4. **Sitemap Validation**: Verify XML sitemap accessibility

### Performance Monitoring:
- Monitor OG image generation response times
- Track social sharing analytics
- Validate SEO scoring with tools like Lighthouse

## 📊 Analytics Integration

The SEO system is designed to work with:
- Google Analytics 4
- Google Search Console
- Facebook Analytics
- Instagram Insights
- Core Web Vitals monitoring

## 🔄 Maintenance

### Regular Tasks:
1. Update sitemap priorities based on content importance
2. Refresh structured data with new features
3. Monitor and update social platform requirements
4. Validate OG image generation performance

### Version Updates:
- Keep Next.js metadata API usage current
- Update social platform meta tag requirements
- Refresh structured data schemas as needed

---

**Last Updated**: January 2025  
**Version**: 2.0.0  
**Contact**: FTV Development Team
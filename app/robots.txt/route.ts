import { NextResponse } from 'next/server';
import { SEO_CONFIG } from '@/lib/seo/config';

/**
 * Dynamic robots.txt generation for the FTV application
 * Provides proper directives for search engine crawlers
 */

export async function GET() {
  const robotsConfig = SEO_CONFIG.robots;
  
  // Generate robots.txt content
  const robotsContent = `# Robots.txt for ${SEO_CONFIG.site.name}
# Generated dynamically

User-agent: ${robotsConfig.userAgent}

# Allow access to main content
${robotsConfig.allow.map(path => `Allow: ${path}`).join('\n')}

# Disallow access to sensitive areas
${robotsConfig.disallow.map(path => `Disallow: ${path}`).join('\n')}

# Crawl delay
Crawl-delay: ${robotsConfig.crawlDelay}

# Sitemap location
Sitemap: ${robotsConfig.sitemap}

# Additional directives for specific user agents
User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /tests/
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /tests/
Crawl-delay: 1

User-agent: Slurp
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /tests/
Crawl-delay: 2

User-agent: DuckDuckBot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /tests/
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /tests/
Crawl-delay: 3

User-agent: YandexBot
Allow: /
Disallow: /api/
Disallow: /tests/
Disallow: /admin/
Crawl-delay: 2

# Block malicious crawlers
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Allow social media crawlers for better sharing
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

# Host directive (optional, for single domain)
Host: ${new URL(SEO_CONFIG.site.url).hostname}

# Clean-param directive to ignore tracking parameters
Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content

# Last updated comment
# Last updated: ${new Date().toISOString()}
`;

  return new NextResponse(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}
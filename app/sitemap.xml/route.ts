import { NextResponse } from 'next/server';
import { SEO_CONFIG } from '@/lib/seo/config';

/**
 * Dynamic sitemap generation for the FTV application
 * Generates XML sitemap with proper priorities and change frequencies
 */

// Static routes with their configurations
const staticRoutes = [
  {
    url: '/',
    changeFreq: 'daily',
    priority: 1.0,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/privacy-policy',
    changeFreq: 'monthly',
    priority: 0.5,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/terms-of-service',
    changeFreq: 'monthly',
    priority: 0.5,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/login',
    changeFreq: 'weekly',
    priority: 0.7,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/app',
    changeFreq: 'daily',
    priority: 0.9,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/app/iranyitopult',
    changeFreq: 'daily',
    priority: 0.8,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/app/forgatasok',
    changeFreq: 'weekly',
    priority: 0.8,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/app/forgatasok/uj',
    changeFreq: 'weekly',
    priority: 0.7,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/app/beosztas',
    changeFreq: 'weekly',
    priority: 0.8,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/app/kozlemenyek',
    changeFreq: 'daily',
    priority: 0.8,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/app/kacsa',
    changeFreq: 'weekly',
    priority: 0.8,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/app/beallitasok',
    changeFreq: 'monthly',
    priority: 0.6,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/app/segitseg',
    changeFreq: 'monthly',
    priority: 0.7,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/app/segitseg/admin-utmutato',
    changeFreq: 'monthly',
    priority: 0.6,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/app/first-steps',
    changeFreq: 'monthly',
    priority: 0.6,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/changelog',
    changeFreq: 'weekly',
    priority: 0.6,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/technical-details',
    changeFreq: 'monthly',
    priority: 0.5,
    lastMod: new Date().toISOString(),
  },
  {
    url: '/design-guide',
    changeFreq: 'monthly',
    priority: 0.5,
    lastMod: new Date().toISOString(),
  },
];

/**
 * Generate dynamic routes based on application data
 * This would typically fetch from your database or API
 */
async function getDynamicRoutes(): Promise<Array<{
  url: string;
  changeFreq: string;
  priority: number;
  lastMod: string;
}>> {
  const dynamicRoutes: Array<{
    url: string;
    changeFreq: string;
    priority: number;
    lastMod: string;
  }> = [];

  try {
    // TODO: Fetch actual data from your API/database
    // Example for filming sessions
    // const filmingSessions = await fetch('/api/filming-sessions').then(r => r.json());
    // filmingSessions.forEach(session => {
    //   dynamicRoutes.push({
    //     url: `/app/forgatasok/${session.id}`,
    //     changeFreq: 'weekly',
    //     priority: 0.7,
    //     lastMod: session.updatedAt || new Date().toISOString(),
    //   });
    // });

    // Example for announcements
    // const announcements = await fetch('/api/announcements').then(r => r.json());
    // announcements.forEach(announcement => {
    //   dynamicRoutes.push({
    //     url: `/app/kozlemenyek/${announcement.id}`,
    //     changeFreq: 'weekly',
    //     priority: 0.6,
    //     lastMod: announcement.updatedAt || new Date().toISOString(),
    //   });
    // });

    // Example for KaCsa content
    // const kacsaContent = await fetch('/api/kacsa').then(r => r.json());
    // kacsaContent.forEach(content => {
    //   dynamicRoutes.push({
    //     url: `/app/kacsa/${content.id}`,
    //     changeFreq: 'monthly',
    //     priority: 0.6,
    //     lastMod: content.updatedAt || new Date().toISOString(),
    //   });
    // });

  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap:', error);
  }

  return dynamicRoutes;
}

/**
 * Generate XML sitemap content
 */
function generateSitemapXML(routes: Array<{
  url: string;
  changeFreq: string;
  priority: number;
  lastMod: string;
}>) {
  const urls = routes.map(route => {
    const fullUrl = `${SEO_CONFIG.site.url}${route.url}`;
    return `
    <url>
      <loc>${fullUrl}</loc>
      <lastmod>${route.lastMod}</lastmod>
      <changefreq>${route.changeFreq}</changefreq>
      <priority>${route.priority}</priority>
    </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
}

/**
 * API route handler for sitemap.xml
 */
export async function GET() {
  try {
    // Get dynamic routes
    const dynamicRoutes = await getDynamicRoutes();
    
    // Combine static and dynamic routes
    const allRoutes = [...staticRoutes, ...dynamicRoutes];
    
    // Generate XML
    const sitemapXML = generateSitemapXML(allRoutes);
    
    return new NextResponse(sitemapXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
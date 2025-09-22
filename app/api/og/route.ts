import { NextRequest, NextResponse } from 'next/server';

/**
 * Dynamic OG Image Generation API
 * Generates SVG-based Open Graph images on demand
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract parameters
    const title = searchParams.get('title') || 'FTV - Forgatásszervező Platform';
    const subtitle = searchParams.get('subtitle') || 'Kőbányai Szent László Gimnázium';
    const theme = searchParams.get('theme') || 'light';
    const type = searchParams.get('type') || 'default'; // default, article, profile, etc.
    const width = parseInt(searchParams.get('width') || '1200');
    const height = parseInt(searchParams.get('height') || '630');

    // Color schemes
    const themes = {
      light: {
        background: '#ffffff',
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f59e0b',
        text: '#1e293b',
        border: '#e2e8f0',
      },
      dark: {
        background: '#0f172a',
        primary: '#3b82f6',
        secondary: '#94a3b8',
        accent: '#fbbf24',
        text: '#f8fafc',
        border: '#334155',
      },
    };

    const colors = themes[theme as keyof typeof themes] || themes.light;

    // Generate SVG
    const svg = generateOGSVG({
      title,
      subtitle,
      colors,
      width,
      height,
      type,
    });

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new NextResponse('Error generating image', { status: 500 });
  }
}

interface ColorScheme {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  border: string;
}

interface OGSVGProps {
  title: string;
  subtitle: string;
  colors: ColorScheme;
  width: number;
  height: number;
  type: string;
}

function generateOGSVG({ title, subtitle, colors, width, height, type }: OGSVGProps): string {
  // Text wrapping function
  const wrapText = (text: string, maxLength: number = 40): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    return lines.slice(0, 3); // Max 3 lines
  };

  const titleLines = wrapText(title, 35);
  const subtitleLines = wrapText(subtitle, 50);

  // Calculate positions
  const centerX = width / 2;
  const centerY = height / 2;
  const logoSize = 80;
  const titleStartY = centerY - 40;
  const subtitleStartY = titleStartY + (titleLines.length * 40) + 20;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradient background -->
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.background};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.border};stop-opacity:1" />
        </linearGradient>
        
        <!-- Logo gradient -->
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
        </linearGradient>

        <!-- Text shadow filter -->
        <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology operator="dilate" radius="2"/>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
      
      <!-- Decorative elements -->
      ${generateDecorativeElements(colors, width, height, type)}
      
      <!-- Logo/Icon -->
      <g transform="translate(${centerX - logoSize/2}, ${centerY - 120})">
        ${generateLogo(logoSize, colors)}
      </g>
      
      <!-- Title -->
      <g transform="translate(${centerX}, ${titleStartY})" text-anchor="middle">
        ${titleLines.map((line, index) => `
          <text x="0" y="${index * 45}" 
                font-family="Inter, system-ui, sans-serif" 
                font-size="42" 
                font-weight="700" 
                fill="${colors.text}"
                filter="url(#textShadow)">
            ${escapeXml(line)}
          </text>
        `).join('')}
      </g>
      
      <!-- Subtitle -->
      <g transform="translate(${centerX}, ${subtitleStartY})" text-anchor="middle">
        ${subtitleLines.map((line, index) => `
          <text x="0" y="${index * 30}" 
                font-family="Inter, system-ui, sans-serif" 
                font-size="24" 
                font-weight="400" 
                fill="${colors.secondary}">
            ${escapeXml(line)}
          </text>
        `).join('')}
      </g>
      
      <!-- Bottom branding -->
      <g transform="translate(60, ${height - 60})">
        <text font-family="Inter, system-ui, sans-serif" 
              font-size="18" 
              font-weight="500" 
              fill="${colors.secondary}">
          ftv.szlg.info
        </text>
      </g>
      
      <!-- Type indicator -->
      ${type !== 'default' ? `
        <g transform="translate(${width - 120}, 60)">
          <rect x="0" y="0" width="100" height="30" rx="15" fill="${colors.accent}"/>
          <text x="50" y="20" 
                text-anchor="middle" 
                font-family="Inter, system-ui, sans-serif" 
                font-size="14" 
                font-weight="600" 
                fill="${colors.background}">
            ${escapeXml(type.toUpperCase())}
          </text>
        </g>
      ` : ''}
    </svg>
  `.trim();
}

function generateLogo(size: number, colors: ColorScheme): string {
  return `
    <!-- Camera/Film Icon -->
    <rect x="0" y="${size * 0.3}" width="${size}" height="${size * 0.4}" rx="8" fill="url(#logoGradient)"/>
    <rect x="${size * 0.15}" y="${size * 0.45}" width="${size * 0.7}" height="${size * 0.1}" fill="${colors.background}"/>
    <circle cx="${size * 0.3}" cy="${size * 0.5}" r="${size * 0.08}" fill="${colors.background}"/>
    <circle cx="${size * 0.7}" cy="${size * 0.5}" r="${size * 0.08}" fill="${colors.background}"/>
    <rect x="${size * 0.25}" y="${size * 0.1}" width="${size * 0.5}" height="${size * 0.25}" rx="4" fill="url(#logoGradient)"/>
    <circle cx="${size * 0.5}" cy="${size * 0.22}" r="${size * 0.06}" fill="${colors.background}"/>
  `;
}

function generateDecorativeElements(colors: ColorScheme, width: number, height: number, type: string): string {
  const elements = [];
  
  // Add film strip pattern for media content
  if (type === 'article' || type === 'filming') {
    // Left film strip
    elements.push(`
      <g opacity="0.1">
        <rect x="0" y="0" width="40" height="${height}" fill="${colors.primary}"/>
        ${Array.from({ length: Math.floor(height / 30) }, (_, i) => `
          <rect x="8" y="${i * 30 + 5}" width="8" height="15" fill="${colors.background}"/>
          <rect x="24" y="${i * 30 + 5}" width="8" height="15" fill="${colors.background}"/>
        `).join('')}
      </g>
    `);
    
    // Right film strip
    elements.push(`
      <g opacity="0.1">
        <rect x="${width - 40}" y="0" width="40" height="${height}" fill="${colors.primary}"/>
        ${Array.from({ length: Math.floor(height / 30) }, (_, i) => `
          <rect x="${width - 32}" y="${i * 30 + 5}" width="8" height="15" fill="${colors.background}"/>
          <rect x="${width - 16}" y="${i * 30 + 5}" width="8" height="15" fill="${colors.background}"/>
        `).join('')}
      </g>
    `);
  }
  
  // Add geometric patterns for other types
  else {
    elements.push(`
      <g opacity="0.05">
        <circle cx="100" cy="100" r="50" fill="${colors.accent}"/>
        <circle cx="${width - 100}" cy="${height - 100}" r="60" fill="${colors.primary}"/>
        <rect x="${width - 150}" y="50" width="100" height="100" rx="20" fill="${colors.secondary}" transform="rotate(15 ${width - 100} 100)"/>
      </g>
    `);
  }
  
  return elements.join('');
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
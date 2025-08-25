/**
 * Profile Picture Utilities
 * 
 * This module provides utilities for fetching and managing user profile pictures
 * from various services and providing fallback options.
 */

/**
 * Simple hash function for generating consistent seeds
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

/**
 * Theme color to hex mapping for avatar services
 */
const THEME_COLOR_HEX_MAP = {
  red: 'EF4444',
  amber: 'F59E0B', 
  yellow: 'EAB308',
  green: '10B981',
  cyan: '06B6D4',
  blue: '3B82F6',
  indigo: '6366F1',
  purple: '8B5CF6',
  pink: 'EC4899',
  slate: '64748B'
} as const

/**
 * Convert OKLCH color to hex for use in avatar services
 * Simplified conversion for common OKLCH patterns used in themes
 */
function oklchToHex(oklchString: string): string {
  // Extract OKLCH values using regex
  const match = oklchString.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) return '3B82F6'; // Default blue fallback
  
  const [, l, c, h] = match.map(Number);
  
  // Simplified conversion - map common theme colors to their hex equivalents
  // This is a basic approximation for the most common theme colors
  const hue = h % 360;
  
  // Map hue ranges to approximate hex colors
  if (hue >= 15 && hue <= 35) return 'EF4444'; // red
  if (hue >= 55 && hue <= 65) return 'F59E0B'; // amber  
  if (hue >= 80 && hue <= 95) return 'EAB308'; // yellow
  if (hue >= 155 && hue <= 175) return '10B981'; // green
  if (hue >= 190 && hue <= 200) return '06B6D4'; // cyan
  if (hue >= 210 && hue <= 220) return '3B82F6'; // blue
  if (hue >= 240 && hue <= 270) return '6366F1'; // indigo
  if (hue >= 300 && hue <= 310) return '8B5CF6'; // purple
  if (hue >= 325 && hue <= 335) return 'EC4899'; // pink
  
  // Default fallback
  return '3B82F6';
}

/**
 * Get theme color hex from theme color name
 */
function getThemeColorHex(themeColor?: string): string {
  if (themeColor && themeColor in THEME_COLOR_HEX_MAP) {
    return THEME_COLOR_HEX_MAP[themeColor as keyof typeof THEME_COLOR_HEX_MAP];
  }
  return getPrimaryColorHex();
}

/**
 * Get primary color hex from CSS custom property
 */
function getPrimaryColorHex(): string {
  if (typeof window === 'undefined') return '3B82F6';
  
  try {
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary')
      .trim();
    
    if (primaryColor && primaryColor.startsWith('oklch')) {
      return oklchToHex(primaryColor);
    }
  } catch (error) {
    console.warn('Failed to get primary color from CSS:', error);
  }
  
  return '3B82F6'; // Default blue fallback
}

/**
 * Generate a UI Avatars URL (fallback service with guaranteed image)
 * This service generates avatars based on initials and is very reliable
 */
export function getUIAvatarsUrl(
  name: string, 
  size: number = 128, 
  themeColor?: string, 
  color: string = 'FFFFFF'
): string {
  const background = getThemeColorHex(themeColor)
  const encodedName = encodeURIComponent(name.substring(0, 2).toUpperCase())
  return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=${background}&color=${color}&format=png&rounded=true&font-size=0.6`
}

/**
 * Generate a DiceBear avatar URL (modern avatar generation service)
 * Provides consistent, attractive shapes-style avatars based on email
 */
export function getDiceBearUrl(email: string, size: number = 128, style: string = 'shapes', themeColor?: string): string {
  const seed = encodeURIComponent(email.toLowerCase().trim())
  const primaryColor = getThemeColorHex(themeColor)
  
  // Create a palette based on the primary color with complementary colors
  const baseColors = [primaryColor]
// Generate 3 random colors in the current color hue range for variety
const complementaryColors = Array.from({ length: 3 }, (_, i) => {
    // Convert hex to HSL, shift hue by 120° for complementary colors
    function hexToHsl(hex: string): { h: number; s: number; l: number } {
        hex = hex.replace(/^#/, '');
        if (hex.length === 6) {
            const r = parseInt(hex.slice(0, 2), 16) / 255;
            const g = parseInt(hex.slice(2, 4), 16) / 255;
            const b = parseInt(hex.slice(4, 6), 16) / 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h = 0, s = 0, l = (max + min) / 2;
            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
        }
        return { h: 210, s: 90, l: 60 }; // fallback blue
    }

    function hslToHex(h: number, s: number, l: number): string {
        s /= 100; l /= 100;
        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) =>
            Math.round(255 * (l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1))));
        return f(0).toString(16).padStart(2, '0') +
                     f(8).toString(16).padStart(2, '0') +
                     f(4).toString(16).padStart(2, '0');
    }

    const hsl = hexToHsl(primaryColor);
    // Shift hue by 120°, 180°, and 240° for variety
    const shiftedHue = (hsl.h + (i + 1) * 120) % 360;
    const hex = hslToHex(shiftedHue, hsl.s, hsl.l);
    return hex.toUpperCase();
});
  // Combine primary color with complementary colors
  const colorPalette = [primaryColor, ...complementaryColors].slice(0, 4).join(',')
  
// If style is 'shapes', add shape1Color, shape2Color, shape3Color from the palette
if (style === 'shapes') {
    const [shape1Color, shape2Color, shape3Color] = complementaryColors.slice(0, 3)
    return `https://api.dicebear.com/9.x/${style}/png?seed=${seed}&size=${size}&backgroundColor=${colorPalette}&shape1Color=${shape1Color}&shape2Color=${shape2Color}&shape3Color=${shape3Color}`
}
return `https://api.dicebear.com/9.x/${style}/png?seed=${seed}&size=${size}&backgroundColor=${colorPalette}`
}

/**
 * Generate a DiceBear initials avatar URL as a secondary option
 */
export function getDiceBearInitialsUrl(email: string, size: number = 128, themeColor?: string): string {
  const seed = encodeURIComponent(email.toLowerCase().trim())
  const primaryColor = getThemeColorHex(themeColor)
  
  // Use the same color palette strategy as the main DiceBear function
  const complementaryColors = ['8B5CF6', '06B6D4', '10B981', 'F59E0B']
  const colorPalette = [primaryColor, ...complementaryColors].slice(0, 4).join(',')
  
  return `https://api.dicebear.com/9.x/initials/png?seed=${seed}&size=${size}&backgroundColor=${colorPalette}&backgroundType=gradientLinear&fontSize=36`
}

/**
 * Generate user initials from name
 */
export function getUserInitials(firstName: string, lastName: string): string {
  const name = `${firstName} ${lastName}`.trim()
  if (name && name !== ' ') {
    const parts = name.split(' ').filter(part => part.length > 0)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    } else if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase()
    }
  }
  
  // Return default initials if no valid name parts
  return 'UN'
}

/**
 * Profile picture sources in order of preference
 */
export const ProfilePictureSources = {
  DICEBEAR_SHAPES: 'dicebear-shapes',
  DICEBEAR_INITIALS: 'dicebear-initials',
  UI_AVATARS: 'ui-avatars',
  FALLBACK: 'fallback'
} as const

export type ProfilePictureSource = typeof ProfilePictureSources[keyof typeof ProfilePictureSources]

/**
 * Get profile picture URLs in order of preference
 */
export function getProfilePictureUrls(
  email: string, 
  firstName: string = '', 
  lastName: string = '', 
  username: string = '',
  size: number = 128,
  themeColor?: string
): Array<{ url: string; source: ProfilePictureSource }> {
  const displayName = `${firstName} ${lastName}`.trim() || 'Unknown User'
  
  return [
    {
      url: getDiceBearUrl(email, size, 'shapes', themeColor),
      source: ProfilePictureSources.DICEBEAR_SHAPES
    },
    {
      url: getDiceBearInitialsUrl(email, size, themeColor),
      source: ProfilePictureSources.DICEBEAR_INITIALS
    },
    {
      url: getUIAvatarsUrl(displayName, size, themeColor),
      source: ProfilePictureSources.UI_AVATARS
    }
  ]
}

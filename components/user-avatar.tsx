"use client"

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/theme-context'
import { 
  getProfilePictureUrls, 
  getUserInitials,
  type ProfilePictureSource,
  ProfilePictureSources 
} from '@/lib/profile-picture'

interface UserAvatarProps {
  email: string
  firstName: string
  lastName: string
  username?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fallbackClassName?: string
  /**
   * Whether to apply grayscale filter to the image
   * Useful for maintaining consistent styling
   */
  grayscale?: boolean
  /**
   * Custom size in pixels (overrides the size prop)
   */
  customSize?: number
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-20 w-20'
}

const sizePx = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 80
}

export function UserAvatar({
  email,
  firstName,
  lastName,
  username,
  size = 'md',
  className,
  fallbackClassName,
  grayscale = false,
  customSize
}: UserAvatarProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [currentSource, setCurrentSource] = useState<ProfilePictureSource | null>(null)
  
  // Get current theme for color customization
  const { themeColor } = useTheme()

  const actualSize = customSize || sizePx[size]
  const sizeClass = customSize ? '' : sizeClasses[size]
  const customSizeStyle = customSize ? { width: customSize, height: customSize } : {}

  // Get user initials for fallback
  const initials = getUserInitials(lastName, firstName)

  // Get profile picture URLs in order of preference with theme color
  const pictureUrls = getProfilePictureUrls(email, lastName, firstName, actualSize, themeColor)

  useEffect(() => {
    let cancelled = false
    setImageStatus('loading')
    setCurrentImageUrl(null)
    setCurrentSource(null)

    // Hardcoded workaround for specific username
    // Extract username from email if username prop is not provided
    const extractedUsername = username || email.split('@')[0]
    
    if (extractedUsername === 'balla.botond.23f') {
      // Directly set the hardcoded GitHub profile picture for this specific user
      const hardcodedUrl = 'https://github.com/PstasDev.png'
      setCurrentImageUrl(hardcodedUrl)
      setCurrentSource('github' as ProfilePictureSource)
      setImageStatus('loaded')
      return
    }

    // For all other users, skip URL-based avatars and go directly to fallback initials
    setImageStatus('error')

    return () => {
      cancelled = true
    }
  }, [email, actualSize, themeColor])

  return (
    <Avatar 
      className={cn(
        sizeClass,
        grayscale && 'grayscale',
        'shrink-0', // Prevent shrinking in flex containers
        className
      )}
      style={customSizeStyle}
    >
      {currentImageUrl && imageStatus === 'loaded' && (
        <AvatarImage 
          src={currentImageUrl} 
          alt={`${firstName} ${lastName}`.trim() || username || 'User'}
          className={cn(
            'object-cover',
            grayscale && 'grayscale'
          )}
        />
      )}
      <AvatarFallback 
        className={cn(
          'font-medium select-none',
          // Responsive text sizing based on avatar size
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm', 
          size === 'lg' && 'text-base',
          size === 'xl' && 'text-xl',
          fallbackClassName
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

// Additional utility component for common use cases
export function UserAvatarWithTooltip({
  email,
  firstName,
  lastName,
  username,
  size = 'md',
  className,
  showName = true,
  ...props
}: UserAvatarProps & { 
  showName?: boolean 
}) {
  const displayName = `${firstName} ${lastName}`.trim() || username || 'User'

  return (
    <div className="flex items-center gap-2">
      <UserAvatar
        email={email}
        firstName={firstName}
        lastName={lastName}
        username={username}
        size={size}
        className={className}
        {...props}
      />
      {showName && (
        <div className="flex flex-col">
          <span className="text-sm font-medium truncate">{displayName}</span>
          {email && (
            <span className="text-xs text-muted-foreground truncate">{email}</span>
          )}
        </div>
      )}
    </div>
  )
}

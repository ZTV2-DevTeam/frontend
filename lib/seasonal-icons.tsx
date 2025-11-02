import {
  IconDashboard,
  IconHelp,
  IconSettings,
  IconUsers,
  IconCalendar,
} from "@tabler/icons-react"
import { 
  Mail,
  TicketCheck,
  TreePalm,
  Calendar,
  Wrench,
  CameraIcon,
  // Halloween icons
  Ghost,
  Skull,
  Candy,
  Sparkles,
  Zap,
  // Valentine icons
  Heart,
  HeartHandshake,
  HeartPulse,
  Flower2,
  // Christmas icons
  Gift,
  Snowflake,
  TreePine,
  Bell,
  Star,
  Sparkle,
  // New Year icons
  PartyPopper,
  Wine,
  Clock,
} from 'lucide-react'
import { DuckIcon } from "@/components/icons/duck-icon"
import { type SeasonalTheme } from '@/lib/seasonal-themes'

export interface SeasonalIconSet {
  dashboard: React.ElementType
  help: React.ElementType
  settings: React.ElementType
  users: React.ElementType
  calendar: React.ElementType
  mail: React.ElementType
  tickets: React.ElementType
  absence: React.ElementType
  calendarEvent: React.ElementType
  tools: React.ElementType
  camera: React.ElementType
  duck: React.ElementType
}

export const DEFAULT_ICONS: SeasonalIconSet = {
  dashboard: IconDashboard,
  help: IconHelp,
  settings: IconSettings,
  users: IconUsers,
  calendar: IconCalendar,
  mail: Mail,
  tickets: TicketCheck,
  absence: TreePalm,
  calendarEvent: Calendar,
  tools: Wrench,
  camera: CameraIcon,
  duck: DuckIcon,
}

export const HALLOWEEN_ICONS: SeasonalIconSet = {
  dashboard: Skull,
  help: Ghost,
  settings: Sparkles,
  users: Ghost,
  calendar: Candy,
  mail: Ghost,
  tickets: Candy,
  absence: Ghost,
  calendarEvent: Candy,
  tools: Zap,
  camera: Skull,
  duck: DuckIcon,
}

export const VALENTINES_ICONS: SeasonalIconSet = {
  dashboard: Heart,
  help: HeartHandshake,
  settings: HeartPulse,
  users: Heart,
  calendar: Flower2,
  mail: Heart,
  tickets: HeartHandshake,
  absence: Flower2,
  calendarEvent: Flower2,
  tools: HeartPulse,
  camera: Heart,
  duck: DuckIcon,
}

export const CHRISTMAS_ICONS: SeasonalIconSet = {
  dashboard: Gift,
  help: Star,
  settings: Sparkle,
  users: Snowflake,
  calendar: Bell,
  mail: Gift,
  tickets: Star,
  absence: TreePine,
  calendarEvent: Bell,
  tools: Star,
  camera: Gift,
  duck: DuckIcon,
}

export const NEWYEAR_ICONS: SeasonalIconSet = {
  dashboard: PartyPopper,
  help: Sparkle,
  settings: Sparkles,
  users: PartyPopper,
  calendar: Clock,
  mail: Sparkles,
  tickets: Wine,
  absence: PartyPopper,
  calendarEvent: Clock,
  tools: Sparkles,
  camera: PartyPopper,
  duck: DuckIcon,
}

export function getSeasonalIcons(theme: SeasonalTheme | string): SeasonalIconSet {
  switch (theme) {
    case 'halloween':
      return HALLOWEEN_ICONS
    case 'valentines':
      return VALENTINES_ICONS
    case 'christmas':
      return CHRISTMAS_ICONS
    case 'newyear':
      return NEWYEAR_ICONS
    default:
      return DEFAULT_ICONS
  }
}

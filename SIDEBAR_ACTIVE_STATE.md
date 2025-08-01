# Sidebar Active State Highlighting

## Overview
The sidebar components now support active state highlighting based on the current URL. When a user navigates to a page, the corresponding menu item in the sidebar will be highlighted.

## How It Works

### Components Updated
1. **NavMain** (`/components/nav-main.tsx`)
2. **NavSecondary** (`/components/nav-secondary.tsx`) 
3. **NavCategory** (`/components/nav-category.tsx`)

### Implementation Details

Each component now:
1. **Uses `usePathname` hook** to get the current URL path
2. **Compares current path with menu item URLs** to determine active state
3. **Passes `isActive` prop** to `SidebarMenuButton`
4. **Uses Next.js `Link` component** for proper client-side navigation

### Code Example

```tsx
const pathname = usePathname()

{items.map((item) => {
  const isActive = pathname === item.url
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton 
        asChild 
        tooltip={item.title}
        isActive={isActive}  // This highlights the active menu item
      >
        <Link href={item.url}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
})}
```

### Styling

The `SidebarMenuButton` component automatically applies the following styles when `isActive={true}`:
- `data-[active=true]:bg-sidebar-accent` - Background highlight
- `data-[active=true]:font-medium` - Bold font weight
- `data-[active=true]:text-sidebar-accent-foreground` - Accent text color

### Menu URLs

Current menu structure with URLs:

#### Main Navigation
- Irányítópult → `/iranyitopult`
- Üzenőfal → `/uzenofal`
- Analitika → `/analitika`
- Stáb → `/stab`
- Naptár → `/naptar`

#### Forgatások Section
- Forgatások → `/forgatasok`
- Beosztás → `/beosztas`
- Forgatási Naptár → `/shooting-calendar`
- Projektek → `/projects`
- Jelentkezések → `/applications`
- Média Archívum → `/media-archive`

#### Secondary Navigation
- Beállítások → `/beallitasok`
- Segítség → `/segitseg`
- Értesítések → `/notifications`

### Testing the Active State

To test the active highlighting:

1. Navigate to any of the pages (e.g., `/naptar`, `/stab`, `/forgatasok`)
2. The corresponding menu item in the sidebar should be highlighted
3. The highlighting will automatically update when navigating between pages

### Benefits

- **Visual feedback** - Users can easily see which page they're currently on
- **Better UX** - Consistent navigation state indication
- **Accessible** - Uses proper ARIA attributes and semantic HTML
- **Performance** - Uses Next.js Link for optimized client-side navigation

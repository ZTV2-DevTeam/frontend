// COPY-PASTE TEMPLATE FOR ANY MENU
// Just change 3 things: route name, page title, and data fields

'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { useApi } from '@/hooks/use-simple-api'

export default function YourMenuPage() {
  // 1. CHANGE THIS: Just change 'your-route' to your endpoint name
  const { data, loading, error } = useApi('your-route')

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          
          {/* 2. CHANGE THIS: Update the loading message */}
          {loading && <div>Loading your data...</div>}
          {error && <div>Error: {error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.map((item: any, index: number) => (
              <Card key={item.id || index}>
                <CardHeader>
                  {/* 3. CHANGE THIS: Update the fields you want to display */}
                  <CardTitle>{item.name || item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{item.description || item.details}</p>
                  <p className="text-sm text-gray-600">{item.type || item.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

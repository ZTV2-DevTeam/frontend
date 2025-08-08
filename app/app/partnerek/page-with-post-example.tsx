'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApi } from '@/hooks/use-simple-api'
import { useState } from 'react'

export default function PartnersPage() {
  // Original GET request (unchanged)
  const { data: partners, loading, error, refetch } = useApi('partners')
  
  // New: Add POST functionality
  const { post: createPartner, loading: creating, error: createError } = useApi('partners', { autoFetch: false })
  
  // Form state
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    institution: '',
    imageURL: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createPartner(formData)
      setFormData({ name: '', address: '', institution: '', imageURL: '' })
      setShowForm(false)
      await refetch() // Refresh the list
    } catch (err) {
      // Error is automatically handled by the hook
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4">
          
          {/* Add Partner Button */}
          <div className="mb-4">
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add Partner'}
            </Button>
          </div>

          {/* Simple Add Partner Form */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Partner</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Partner name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <Input
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                  <Input
                    placeholder="Institution"
                    value={formData.institution}
                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  />
                  <Input
                    placeholder="Image URL"
                    value={formData.imageURL}
                    onChange={(e) => setFormData({...formData, imageURL: e.target.value})}
                  />
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create Partner'}
                  </Button>
                  {createError && <div className="text-red-500">Error: {createError}</div>}
                </form>
              </CardContent>
            </Card>
          )}

          {/* Original display logic (unchanged) */}
          {loading && <div>Loading partners...</div>}
          {error && <div>Error: {error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners?.map((partner: any, index: number) => (
              <Card key={partner.id || index}>
                <CardHeader>
                  <img src={partner.imageURL} alt={`${partner.name} logo`} className="w-16 h-16 mb-2" />
                  <CardTitle>{partner.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{partner.address}</p>
                  <p className="text-sm text-gray-600">{partner.institution}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApi } from '@/hooks/use-simple-api'
import { useState } from 'react'

export default function PartnersFullCRUDPage() {
  // GET partners
  const { data: partners, loading, error, refetch } = useApi('partners')
  
  // CREATE partner
  const { post: createPartner, loading: creating, error: createError } = useApi('partners', { autoFetch: false })
  
  // DELETE partner
  const { delete: deletePartner, loading: deleting, error: deleteError } = useApi('partners', { autoFetch: false })
  
  // UPDATE partner
  const { put: updatePartner, loading: updating, error: updateError } = useApi('partners', { autoFetch: false })
  
  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    institution: '',
    imageURL: ''
  })

  // Create handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createPartner(formData)
      setFormData({ name: '', address: '', institution: '', imageURL: '' })
      setShowCreateForm(false)
      await refetch()
    } catch (err) {
      // Error handled automatically
    }
  }

  // Update handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updatePartner(formData, `partners/${editingPartner.id}`) // Custom route
      setEditingPartner(null)
      setFormData({ name: '', address: '', institution: '', imageURL: '' })
      await refetch()
    } catch (err) {
      // Error handled automatically
    }
  }

  // Delete handler
  const handleDelete = async (partnerId: number) => {
    if (confirm('Are you sure you want to delete this partner?')) {
      try {
        await deletePartner(`partners/${partnerId}`) // Custom route
        await refetch()
      } catch (err) {
        // Error handled automatically
      }
    }
  }

  // Start editing
  const startEdit = (partner: any) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name || '',
      address: partner.address || '',
      institution: partner.institution || '',
      imageURL: partner.imageURL || ''
    })
    setShowCreateForm(false)
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4">
          
          {/* Action Buttons */}
          <div className="mb-4 flex gap-2">
            <Button onClick={() => {
              setShowCreateForm(!showCreateForm)
              setEditingPartner(null)
              setFormData({ name: '', address: '', institution: '', imageURL: '' })
            }}>
              {showCreateForm ? 'Cancel' : 'Add Partner'}
            </Button>
            
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>

          {/* Create/Edit Form */}
          {(showCreateForm || editingPartner) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingPartner ? 'Edit Partner' : 'Add New Partner'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingPartner ? handleUpdate : handleCreate} className="space-y-4">
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
                  <div className="flex gap-2">
                    <Button type="submit" disabled={creating || updating}>
                      {creating || updating ? 'Saving...' : editingPartner ? 'Update Partner' : 'Create Partner'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setEditingPartner(null)
                        setShowCreateForm(false)
                        setFormData({ name: '', address: '', institution: '', imageURL: '' })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  
                  {/* Error Messages */}
                  {createError && <div className="text-red-500">Create Error: {createError}</div>}
                  {updateError && <div className="text-red-500">Update Error: {updateError}</div>}
                </form>
              </CardContent>
            </Card>
          )}

          {/* Loading/Error States */}
          {loading && <div>Loading partners...</div>}
          {error && <div>Error: {error}</div>}
          {deleteError && <div className="text-red-500 mb-4">Delete Error: {deleteError}</div>}
          
          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners?.map((partner: any, index: number) => (
              <Card key={partner.id || index} className="relative">
                <CardHeader>
                  <img src={partner.imageURL} alt={`${partner.name} logo`} className="w-16 h-16 mb-2" />
                  <CardTitle>{partner.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{partner.address}</p>
                  <p className="text-sm text-gray-600">{partner.institution}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => startEdit(partner)}
                      disabled={updating}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(partner.id)}
                      disabled={deleting}
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useApi } from '@/hooks/use-simple-api'
import { useState } from 'react'
import { Plus, RefreshCw, Edit, Trash2, Building2, MapPin, User, ImageIcon } from 'lucide-react'

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
    console.log('Update handler called')
    console.log('Editing partner:', editingPartner)
    console.log('Form data:', formData)
    
    if (!editingPartner?.id) {
      console.error('No partner ID found for update')
      return
    }
    
    console.log('Route will be:', `partners/${editingPartner.id}`)
    
    try {
      const result = await updatePartner(formData, `partners/${editingPartner.id}`) // Custom route
      console.log('Update successful:', result)
      setEditingPartner(null)
      setFormData({ name: '', address: '', institution: '', imageURL: '' })
      await refetch()
    } catch (err) {
      console.error('Update failed:', err)
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
    console.log('Starting edit for partner:', partner)
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Partners</h2>
              <p className="text-muted-foreground">
                Manage your business partners and collaborations
              </p>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => {
                  setShowCreateForm(!showCreateForm)
                  setEditingPartner(null)
                  setFormData({ name: '', address: '', institution: '', imageURL: '' })
                }}
                className="h-9"
              >
                <Plus className="mr-2 h-4 w-4" />
                {showCreateForm ? 'Cancel' : 'Add Partner'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                disabled={loading}
                className="h-9"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {partners && (
              <Badge variant="secondary" className="text-sm">
                {partners.length} partner{partners.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {/* Create/Edit Form */}
          {(showCreateForm || editingPartner) && (
            <Card className="border-dashed border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingPartner ? (
                    <>
                      <Edit className="h-5 w-5" />
                      Edit Partner
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add New Partner
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {editingPartner 
                    ? 'Update the partner information below' 
                    : 'Fill out the form below to add a new partner'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingPartner ? handleUpdate : handleCreate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Partner Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter partner name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institution" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Institution
                      </Label>
                      <Input
                        id="institution"
                        placeholder="Enter institution name"
                        value={formData.institution}
                        onChange={(e) => setFormData({...formData, institution: e.target.value})}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address *
                    </Label>
                    <Input
                      id="address"
                      placeholder="Enter partner address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageURL" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Logo URL
                    </Label>
                    <Input
                      id="imageURL"
                      placeholder="https://example.com/logo.png"
                      value={formData.imageURL}
                      onChange={(e) => setFormData({...formData, imageURL: e.target.value})}
                      className="h-10"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        disabled={creating || updating}
                        className="min-w-[120px]"
                      >
                        {creating || updating ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : editingPartner ? (
                          'Update Partner'
                        ) : (
                          'Create Partner'
                        )}
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
                    <div className="text-right">
                      {createError && (
                        <p className="text-sm text-red-600 font-medium">
                          Create Error: {createError}
                        </p>
                      )}
                      {updateError && (
                        <p className="text-sm text-red-600 font-medium">
                          Update Error: {updateError}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && !partners && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-16 w-16 mb-2" />
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-red-600">
                  <div className="text-sm font-medium">Error loading partners:</div>
                  <div className="text-sm">{error}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delete Error */}
          {deleteError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-red-600">
                  <div className="text-sm font-medium">Delete Error:</div>
                  <div className="text-sm">{deleteError}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && partners && partners.length === 0 && (
            <Card className="border-dashed border-2">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No partners yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by adding your first business partner.
                  </p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="h-9"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Partner
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Partners Grid */}
          {!loading && partners && partners.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {partners.map((partner: any, index: number) => (
                <Card key={partner.id || index} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {partner.imageURL ? (
                          <img 
                            src={partner.imageURL} 
                            alt={`${partner.name} logo`} 
                            className="h-12 w-12 object-contain rounded-md border mb-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`h-12 w-12 bg-muted rounded-md flex items-center justify-center mb-3 ${partner.imageURL ? 'hidden' : ''}`}>
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-base leading-tight">
                          {partner.name}
                          {!partner.id && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              No ID
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      {partner.address && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{partner.address}</span>
                        </div>
                      )}
                      {partner.institution && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{partner.institution}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startEdit(partner)}
                        disabled={updating || !partner.id}
                        className="flex-1 h-8"
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(partner.id)}
                        disabled={deleting || !partner.id}
                        className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        {deleting ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

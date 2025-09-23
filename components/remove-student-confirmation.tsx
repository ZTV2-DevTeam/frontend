"use client"

import React from 'react'
import { ConfirmDialog } from '@/components/ui/form-dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface CrewMember {
  id: number
  name: string
  role: string
  roleId: number
  class: string
  stab: string
  phone?: string
  email?: string
  firstName?: string
  lastName?: string
  username?: string
}

interface RemoveStudentConfirmationProps {
  student: CrewMember
  onConfirm: (studentId: number) => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  isLoading?: boolean
}

export function RemoveStudentConfirmation({
  student,
  onConfirm,
  trigger,
  open,
  onOpenChange,
  isLoading = false
}: RemoveStudentConfirmationProps) {
  const handleConfirm = () => {
    onConfirm(student.id)
  }

  // Default trigger if none provided
  const defaultTrigger = (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-destructive hover:text-destructive"
      title={`${student.name} eltávolítása a beosztásból`}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )

  return (
    <ConfirmDialog
      title="Diák eltávolítása a beosztásból"
      description={`Biztosan el szeretné távolítani ${student.name} diákot a beosztásból? A diák eltávolításra kerül a "${student.role}" szerepkörből. Ez a módosítás csak a beosztás mentésekor válik véglegessé.`}
      trigger={trigger || defaultTrigger}
      onConfirm={handleConfirm}
      onCancel={() => {}}
      isLoading={isLoading}
      confirmLabel="Eltávolítás"
      cancelLabel="Mégse"
      variant="destructive"
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}
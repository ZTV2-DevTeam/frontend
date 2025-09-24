"use client"

import { useUserRole } from "@/contexts/user-role-context"
import { TeacherAbsencesPage } from "@/components/teacher-absences-page"
import { StudentAbsenceManagement } from "@/components/student-absence-management"

function StudentAbsencesPageReal() {
  return <StudentAbsenceManagement />
}

export default function JustifyPage() {
  const { currentRole } = useUserRole()

  // Render different components based on user role
  if (currentRole === 'class-teacher') {
    return <TeacherAbsencesPage />
  } else if (currentRole === 'student') {
    return <StudentAbsencesPageReal />
  } else {
    // Admin role - show teacher view for demo
    // The TeacherAbsencesPage will handle preview mode internally
    return <TeacherAbsencesPage />
  }
}

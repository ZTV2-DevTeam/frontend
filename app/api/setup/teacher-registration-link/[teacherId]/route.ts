import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teacherId: string }> }
) {
  try {
    const { teacherId } = await params

    // This is a mock implementation
    // In a real application, you would:
    // 1. Validate the teacher ID
    // 2. Generate a secure token
    // 3. Store the token in the database with expiration
    // 4. Return the registration link

    const token = `reg_${teacherId}_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`
    const registrationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/first-password/${token}`

    console.log('Generated registration link for teacher:', teacherId)

    return NextResponse.json({
      registration_link: registrationLink
    })
  } catch (error) {
    console.error('Registration link generation failed:', error)
    return NextResponse.json(
      { error: 'Hiba történt a regisztrációs link generálása során' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // This is a mock implementation
    // In a real application, you would:
    // 1. Validate the token in your database
    // 2. Check if it's not expired
    // 3. Return user information if valid

    // For demo purposes, let's simulate a valid token
    if (token && token.length > 10) {
      return NextResponse.json({
        valid: true,
        user_info: {
          first_name: 'Nagy',
          last_name: 'Péter',
          email: 'nagy.peter@example.com',
          user_type: 'teacher'
        }
      })
    } else {
      return NextResponse.json({
        valid: false
      })
    }
  } catch (error) {
    console.error('First password token validation failed:', error)
    return NextResponse.json(
      { error: 'Failed to validate token' },
      { status: 500 }
    )
  }
}

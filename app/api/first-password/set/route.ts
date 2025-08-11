import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmPassword } = await request.json()

    // Basic validation
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Hiányzó adatok' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'A jelszavak nem egyeznek meg' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'A jelszónak legalább 8 karakter hosszúnak kell lennie' },
        { status: 400 }
      )
    }

    // This is a mock implementation
    // In a real application, you would:
    // 1. Validate the token
    // 2. Hash the password
    // 3. Update the user's password in the database
    // 4. Mark the first-time setup as complete

    console.log('Setting first password for token:', token)

    return NextResponse.json({
      success: true,
      message: 'Jelszó sikeresen beállítva'
    })
  } catch (error) {
    console.error('First password set failed:', error)
    return NextResponse.json(
      { error: 'Hiba történt a jelszó beállítása során' },
      { status: 500 }
    )
  }
}

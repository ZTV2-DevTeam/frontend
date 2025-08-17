import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ error: 'Type and data are required' }, { status: 400 })
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return success response with mock created records count
    const createdCount = Array.isArray(data) ? data.length : 1

    return NextResponse.json({
      success: true,
      created_records: createdCount,
      message: `Successfully created ${createdCount} ${type} records`
    })

  } catch (error) {
    console.error('Confirm data error:', error)
    return NextResponse.json({ error: 'Failed to create data' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 })
    }

    // For now, return a default configuration status
    // Later this can be connected to the actual backend
    return NextResponse.json({
      setup_complete: false,
      stages: {
        tanarok: { completed: false, required: true },
        osztalyok: { completed: false, required: true },
        diakok: { completed: false, required: true },
        tantargyak: { completed: false, required: true },
        teremfogatasok: { completed: false, required: false }
      }
    })

  } catch (error) {
    console.error('Config wizard status error:', error)
    
    // Return default status if there's any error
    return NextResponse.json({
      setup_complete: false,
      stages: {
        tanarok: { completed: false, required: true },
        osztalyok: { completed: false, required: true },
        diakok: { completed: false, required: true },
        tantargyak: { completed: false, required: true },
        teremfogatasok: { completed: false, required: false }
      }
    })
  }
}

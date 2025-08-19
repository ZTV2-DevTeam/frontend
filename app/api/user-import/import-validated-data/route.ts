import { NextRequest, NextResponse } from 'next/server'

interface ParsedUser {
  vezetek_nev: string
  kereszt_nev: string
  email: string
  telefonszam?: string
  stab?: string
  kezdes_eve?: number
  tagozat?: string
  radio?: string
  gyartasvezeto: boolean
  mediatana: boolean
  osztalyfonok: boolean
  osztalyai: string[]
}

interface ImportRequest {
  users: ParsedUser[]
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ 
        message: 'Nincs jogosultság a művelet végrehajtásához. Csak rendszergazdák használhatják ezt a funkciót.' 
      }, { status: 401 })
    }

    const body: ImportRequest = await request.json()
    
    if (!body.users || !Array.isArray(body.users)) {
      return NextResponse.json({ 
        message: 'Érvénytelen kérés formátum' 
      }, { status: 400 })
    }

    console.log(`Processing validated import for ${body.users.length} users`)
    
    // In a real implementation, this would:
    // 1. Create User accounts with authentication
    // 2. Create UserProfile records
    // 3. Create/update Stab records
    // 4. Create/update RadioStab records  
    // 5. Create/update Class records
    // 6. Set up class teacher assignments
    // 7. Handle stab memberships and radio assignments

    // For now, simulate the processing and return mock created data
    const createdUsers = body.users.map((user, index) => ({
      id: 1000 + index,
      username: user.email.split('@')[0],
      email: user.email,
      first_name: user.kereszt_nev,
      last_name: user.vezetek_nev
    }))

    // Extract unique stabs, classes, etc.
    const stabsSet = new Set<string>()
    const radioStabsSet = new Set<string>()
    const classesSet = new Set<string>()
    
    body.users.forEach(user => {
      if (user.stab) stabsSet.add(user.stab)
      if (user.radio) radioStabsSet.add(user.radio)
      if (user.kezdes_eve && user.tagozat) classesSet.add(`${user.kezdes_eve}${user.tagozat}`)
      user.osztalyai.forEach(osztaly => classesSet.add(osztaly))
    })

    const createdStabs = Array.from(stabsSet).map((stab, index) => ({
      id: 50 + index,
      nev: stab
    }))

    const createdRadioStabs = Array.from(radioStabsSet).map((radio, index) => ({
      id: 20 + index,
      nev: radio
    }))

    const createdClasses = Array.from(classesSet).map((osztaly, index) => ({
      id: 100 + index,
      nev: osztaly,
      tanev: "2024/2025"
    }))

    const summary = {
      users_created: body.users.length,
      stabs_created: createdStabs.length,
      radio_stabs_created: createdRadioStabs.length,
      classes_created: createdClasses.length,
      class_teachers_assigned: body.users.filter(u => u.osztalyfonok && u.osztalyai.length > 0).length
    }

    const response = {
      success: true,
      message: `${body.users.length} felhasználó sikeresen importálva`,
      summary,
      created_models: {
        users: createdUsers,
        stabs: createdStabs,
        radio_stabs: createdRadioStabs,
        classes: createdClasses
      },
      errors: [],
      warnings: []
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Validated import error:', error)
    
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error during import',
      errors: ['An unexpected error occurred while importing the data']
    }, { status: 500 })
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

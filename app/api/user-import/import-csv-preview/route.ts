import { NextRequest, NextResponse } from 'next/server'
import csv from 'csv-parser'
import { Readable } from 'stream'

interface CSVRow {
  [key: string]: string
}

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

// Column mapping to handle both Hungarian and English headers
const COLUMN_MAPPING: { [key: string]: string } = {
  'Vezetéknév': 'vezetek_nev',
  'vezetekNev': 'vezetek_nev',
  'last_name': 'vezetek_nev',
  'Keresztnév': 'kereszt_nev',
  'keresztNev': 'kereszt_nev',
  'first_name': 'kereszt_nev',
  'E-mail cím': 'email',
  'email': 'email',
  'Email': 'email',
  'e_mail': 'email',
  'Telefonszám': 'telefonszam',
  'telefonszam': 'telefonszam',
  'phone': 'telefonszam',
  'telefon': 'telefonszam',
  'Stáb': 'stab',
  'stab': 'stab',
  'Kezdés éve': 'kezdes_eve',
  'kezdesEve': 'kezdes_eve',
  'starting_year': 'kezdes_eve',
  'Tagozat': 'tagozat',
  'tagozat': 'tagozat',
  'department': 'tagozat',
  'Rádió': 'radio',
  'radio': 'radio',
  'radio_stab': 'radio',
  'Gyártásvezető?': 'gyartasvezeto',
  'gyartasvezeto': 'gyartasvezeto',
  'production_manager': 'gyartasvezeto',
  'Médiatanár': 'mediatana',
  'mediatana': 'mediatana',
  'media_teacher': 'mediatana',
  'Osztályfőnök': 'osztalyfonok',
  'osztalyfonok': 'osztalyfonok',
  'class_teacher': 'osztalyfonok',
  'Osztályai': 'osztalyai',
  'osztalyai': 'osztalyai',
  'classes': 'osztalyai'
}

function parseCSVData(fileBuffer: Buffer): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const results: CSVRow[] = []
    const csvContent = fileBuffer.toString('utf-8')
    
    // Auto-detect delimiter
    let delimiter = ';'
    if (csvContent.includes(',') && !csvContent.includes(';')) {
      delimiter = ','
    } else if (csvContent.includes('\t')) {
      delimiter = '\t'
    }
    
    const stream = Readable.from(csvContent)
    
    stream
      .pipe(csv({ separator: delimiter }))
      .on('data', (data: CSVRow) => {
        results.push(data)
      })
      .on('end', () => {
        resolve(results)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

function normalizeColumnName(columnName: string): string {
  return COLUMN_MAPPING[columnName] || columnName.toLowerCase().replace(/[^a-z0-9]/g, '_')
}

function parseBooleanValue(value: string): boolean {
  if (!value) return false
  const normalized = value.toLowerCase().trim()
  return normalized === 'igen' || normalized === 'true' || normalized === '1'
}

function parseUsersFromCSV(rows: CSVRow[]): { users: ParsedUser[], errors: string[], warnings: string[] } {
  const users: ParsedUser[] = []
  const errors: string[] = []
  const warnings: string[] = []
  
  rows.forEach((row, index) => {
    const rowNumber = index + 2 // +1 for 0-based, +1 for header row
    
    // Normalize column names
    const normalizedRow: { [key: string]: string } = {}
    Object.keys(row).forEach(key => {
      const normalizedKey = normalizeColumnName(key)
      normalizedRow[normalizedKey] = row[key]?.trim() || ''
    })
    
    // Skip empty rows
    if (!normalizedRow.vezetek_nev && !normalizedRow.kereszt_nev) {
      return
    }
    
    // Validate required fields
    if (!normalizedRow.vezetek_nev) {
      errors.push(`${rowNumber}. sor: Vezetéknév hiányzik`)
      return
    }
    
    if (!normalizedRow.kereszt_nev) {
      errors.push(`${rowNumber}. sor: Keresztnév hiányzik`)
      return
    }
    
    if (!normalizedRow.email) {
      errors.push(`${rowNumber}. sor: Email cím hiányzik`)
      return
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedRow.email)) {
      errors.push(`${rowNumber}. sor: Érvénytelen email formátum: '${normalizedRow.email}'`)
      return
    }
    
    // Parse year
    let kezdes_eve: number | undefined
    if (normalizedRow.kezdes_eve) {
      kezdes_eve = parseInt(normalizedRow.kezdes_eve)
      if (isNaN(kezdes_eve)) {
        warnings.push(`${rowNumber}. sor: Érvénytelen kezdés éve: '${normalizedRow.kezdes_eve}'`)
        kezdes_eve = undefined
      }
    }
    
    // Parse classes (semicolon separated)
    const osztalyai = normalizedRow.osztalyai 
      ? normalizedRow.osztalyai.split(';').map(c => c.trim()).filter(c => c)
      : []
    
    // Add warnings for missing optional data
    if (!normalizedRow.telefonszam) {
      warnings.push(`${rowNumber}. sor: ${normalizedRow.vezetek_nev} ${normalizedRow.kereszt_nev}: Nincs telefonszám megadva`)
    }
    
    const user: ParsedUser = {
      vezetek_nev: normalizedRow.vezetek_nev,
      kereszt_nev: normalizedRow.kereszt_nev,
      email: normalizedRow.email,
      telefonszam: normalizedRow.telefonszam || undefined,
      stab: normalizedRow.stab || undefined,
      kezdes_eve,
      tagozat: normalizedRow.tagozat || undefined,
      radio: normalizedRow.radio || undefined,
      gyartasvezeto: parseBooleanValue(normalizedRow.gyartasvezeto),
      mediatana: parseBooleanValue(normalizedRow.mediatana),
      osztalyfonok: parseBooleanValue(normalizedRow.osztalyfonok),
      osztalyai
    }
    
    users.push(user)
  })
  
  return { users, errors, warnings }
}

function generateModelPreview(users: ParsedUser[]) {
  const stabsSet = new Set<string>()
  const radioStabsSet = new Set<string>()
  const classesSet = new Set<string>()
  const classTeacherAssignments: string[] = []
  
  users.forEach(user => {
    // Collect stabs
    if (user.stab) {
      stabsSet.add(user.stab)
    }
    
    // Collect radio stabs
    if (user.radio) {
      radioStabsSet.add(`${user.radio} (Radio)`)
    }
    
    // Collect classes from student data
    if (user.kezdes_eve && user.tagozat) {
      classesSet.add(`${user.kezdes_eve}${user.tagozat}`)
    }
    
    // Collect classes from teacher assignments
    user.osztalyai.forEach(osztaly => {
      classesSet.add(osztaly)
      if (user.osztalyfonok) {
        classTeacherAssignments.push(`${user.vezetek_nev} ${user.kereszt_nev} → ${osztaly}`)
      }
    })
  })
  
  return {
    users_to_create: users.map(u => `${u.vezetek_nev} ${u.kereszt_nev} (${u.email})`),
    stabs_to_create: Array.from(stabsSet),
    radio_stabs_to_create: Array.from(radioStabsSet),
    classes_to_create: Array.from(classesSet),
    class_teacher_assignments: classTeacherAssignments
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ 
        message: 'Nincs jogosultság a művelet végrehajtásához. Csak rendszergazdák használhatják ezt a funkciót.' 
      }, { status: 401 })
    }

    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ 
        message: 'Nincs fájl feltöltve' 
      }, { status: 400 })
    }

    // Only accept CSV files
    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({ 
        message: 'Csak CSV (.csv) fájlok támogatottak' 
      }, { status: 400 })
    }

    console.log(`Processing CSV preview: ${file.name} (${file.size} bytes)`)
    
    // Read file as buffer with UTF-8 encoding
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    
    try {
      // Parse CSV data
      const rows = await parseCSVData(fileBuffer)
      console.log(`Parsed ${rows.length} rows from CSV`)

      if (rows.length === 0) {
        return NextResponse.json({ 
          success: false,
          message: 'A CSV fájl üres vagy nem tartalmaz érvényes adatokat',
          errors: ['Nincs feldolgozható sor a fájlban']
        }, { status: 400 })
      }

      // Parse and validate users
      const { users, errors, warnings } = parseUsersFromCSV(rows)
      
      if (errors.length > 0) {
        return NextResponse.json({ 
          success: false,
          message: 'CSV parsing failed',
          errors,
          warnings,
          valid_records: users.length,
          invalid_records: errors.length,
          total_records: rows.length
        }, { status: 400 })
      }

      // Generate summary
      const summary = {
        total_users: users.length,
        users_with_stab: users.filter(u => u.stab).length,
        users_with_radio: users.filter(u => u.radio).length,
        users_with_classes: users.filter(u => u.osztalyai.length > 0).length,
        production_managers: users.filter(u => u.gyartasvezeto).length,
        media_teachers: users.filter(u => u.mediatana).length,
        class_teachers: users.filter(u => u.osztalyfonok).length
      }

      // Generate model preview
      const model_preview = generateModelPreview(users)

      const response = {
        success: true,
        message: "CSV successfully parsed",
        parsed_users: users,
        summary,
        model_preview,
        errors: [],
        warnings
      }

      return NextResponse.json(response)

    } catch (parseError) {
      console.error('CSV parsing error:', parseError)
      return NextResponse.json({ 
        success: false,
        message: 'CSV parsing failed',
        errors: [
          'Failed to parse CSV file. Please check the file format.',
          'Ensure the file uses UTF-8 encoding and has the correct column headers.',
          parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        ]
      }, { status: 400 })
    }

  } catch (error) {
    console.error('CSV preview error:', error)
    
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error during file processing',
      errors: ['An unexpected error occurred while processing the file']
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

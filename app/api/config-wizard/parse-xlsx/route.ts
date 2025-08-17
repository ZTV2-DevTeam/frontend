import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const dataType = formData.get('dataType') as string

    if (!file || !dataType) {
      return NextResponse.json({ error: 'File and dataType are required' }, { status: 400 })
    }

    // For now, return mock parsed data
    // In a real implementation, this would parse the XLSX file
    let mockParsedData

    switch (dataType) {
      case 'tanarok':
        mockParsedData = {
          columns: ['Név', 'Email', 'Tantárgyak'],
          data: [
            ['Új Tanár 1', 'uj.tanar1@iskola.hu', 'Matematika'],
            ['Új Tanár 2', 'uj.tanar2@iskola.hu', 'Fizika'],
            ['Új Tanár 3', 'uj.tanar3@iskola.hu', 'Kémia']
          ]
        }
        break

      case 'osztalyok':
        mockParsedData = {
          columns: ['Osztály név', 'Létszám', 'Osztályfőnök'],
          data: [
            ['12.A', '24', 'Nagy Péter'],
            ['12.B', '26', 'Kovács Anna'],
            ['12.C', '23', 'Szabó József']
          ]
        }
        break

      case 'diakok':
        mockParsedData = {
          columns: ['Név', 'Osztály', 'Születési idő'],
          data: [
            ['Új Diák 1', '9.A', '2008-05-15'],
            ['Új Diák 2', '9.B', '2008-03-22'],
            ['Új Diák 3', '10.A', '2007-12-10']
          ]
        }
        break

      case 'tantargyak':
        mockParsedData = {
          columns: ['Tantárgy név', 'Kód', 'Kredit'],
          data: [
            ['Informatika', 'INF', '3'],
            ['Rajz', 'RAJ', '2'],
            ['Zene', 'ZEN', '1']
          ]
        }
        break

      case 'teremfogatasok':
        mockParsedData = {
          columns: ['Terem név', 'Kapacitás', 'Típus'],
          data: [
            ['D401', '28', 'Hagyományos terem'],
            ['D402', '32', 'Számítógép terem'],
            ['D403', '15', 'Laboratórium']
          ]
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: mockParsedData
    })

  } catch (error) {
    console.error('XLSX parse error:', error)
    return NextResponse.json({ error: 'Failed to parse file' }, { status: 500 })
  }
}

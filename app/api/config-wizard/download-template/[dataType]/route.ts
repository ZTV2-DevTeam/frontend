import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { dataType: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 })
    }

    const dataType = params.dataType

    // Generate a simple CSV template based on data type
    let csvContent = ''
    let filename = ''

    switch (dataType) {
      case 'tanarok':
        csvContent = 'Név,Email,Tantárgyak\n"Példa Tanár","pelda.tanar@iskola.hu","Matematika, Fizika"\n'
        filename = 'tanarok_sablon.csv'
        break

      case 'osztalyok':
        csvContent = 'Osztály név,Létszám,Osztályfőnök\n"9.C","25","Nagy Péter"\n'
        filename = 'osztalyok_sablon.csv'
        break

      case 'diakok':
        csvContent = 'Név,Osztály,Születési idő\n"Példa Diák","9.A","2008-01-15"\n'
        filename = 'diakok_sablon.csv'
        break

      case 'tantargyak':
        csvContent = 'Tantárgy név,Kód,Kredit\n"Példa Tantárgy","PEL","3"\n'
        filename = 'tantargyak_sablon.csv'
        break

      case 'teremfogatasok':
        csvContent = 'Terem név,Kapacitás,Típus\n"A101","30","Hagyományos terem"\n'
        filename = 'teremfogatasok_sablon.csv'
        break

      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 })
    }

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('Download template error:', error)
    return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 })
  }
}

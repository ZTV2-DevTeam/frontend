import { NextRequest, NextResponse } from 'next/server'

interface CurrentDataResponse {
  count: number
  data: Array<{
    id: number
    name: string
    [key: string]: any
  }>
}

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

    // Generate mock data based on the data type
    let mockData: CurrentDataResponse

    switch (dataType) {
      case 'tanarok':
        mockData = {
          count: 15,
          data: [
            { id: 1, name: 'Nagy Péter', email: 'nagy.peter@iskola.hu', tantargyak: 'Matematika, Fizika' },
            { id: 2, name: 'Kovács Anna', email: 'kovacs.anna@iskola.hu', tantargyak: 'Magyar irodalom' },
            { id: 3, name: 'Szabó József', email: 'szabo.jozsef@iskola.hu', tantargyak: 'Történelem' },
            { id: 4, name: 'Horváth Mária', email: 'horvath.maria@iskola.hu', tantargyak: 'Biológia, Kémia' },
            { id: 5, name: 'Tóth Gábor', email: 'toth.gabor@iskola.hu', tantargyak: 'Testnevelés' }
          ]
        }
        break

      case 'osztalyok':
        mockData = {
          count: 12,
          data: [
            { id: 1, name: '9.A', letszam: 28, ofonok: 'Nagy Péter' },
            { id: 2, name: '9.B', letszam: 26, ofonok: 'Kovács Anna' },
            { id: 3, name: '10.A', letszam: 24, ofonok: 'Szabó József' },
            { id: 4, name: '10.B', letszam: 25, ofonok: 'Horváth Mária' },
            { id: 5, name: '11.A', letszam: 22, ofonok: 'Tóth Gábor' }
          ]
        }
        break

      case 'diakok':
        mockData = {
          count: 312,
          data: [
            { id: 1, name: 'Kiss Tamás', osztaly: '9.A', szuletesi_ido: '2008-03-15' },
            { id: 2, name: 'Varga Eszter', osztaly: '9.A', szuletesi_ido: '2008-07-22' },
            { id: 3, name: 'Molnár Dávid', osztaly: '9.B', szuletesi_ido: '2008-01-10' },
            { id: 4, name: 'Balogh Viktória', osztaly: '9.B', szuletesi_ido: '2008-11-05' },
            { id: 5, name: 'Farkas Zoltán', osztaly: '10.A', szuletesi_ido: '2007-09-18' }
          ]
        }
        break

      case 'tantargyak':
        mockData = {
          count: 18,
          data: [
            { id: 1, name: 'Matematika', kod: 'MAT', kredit: 4 },
            { id: 2, name: 'Magyar irodalom', kod: 'MIR', kredit: 3 },
            { id: 3, name: 'Történelem', kod: 'TOR', kredit: 3 },
            { id: 4, name: 'Biológia', kod: 'BIO', kredit: 2 },
            { id: 5, name: 'Fizika', kod: 'FIZ', kredit: 3 }
          ]
        }
        break

      case 'teremfogatasok':
        mockData = {
          count: 8,
          data: [
            { id: 1, name: 'A101', kapacitas: 30, tipus: 'Hagyományos terem' },
            { id: 2, name: 'A102', kapacitas: 25, tipus: 'Számítógép terem' },
            { id: 3, name: 'B201', kapacitas: 35, tipus: 'Előadó' },
            { id: 4, name: 'B202', kapacitas: 20, tipus: 'Laboratórium' },
            { id: 5, name: 'C301', kapacitas: 40, tipus: 'Tornaterem' }
          ]
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 })
    }

    return NextResponse.json(mockData)

  } catch (error) {
    console.error('Config wizard current data error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = {
      description: "FTV felhasználó import sablon",
      required_fields: [
        "vezetekNev", "keresztNev", "email"
      ],
      optional_fields: [
        "telefonszam", "stab", "kezdesEve", "tagozat", "radio",
        "gyartasvezeto", "mediatana", "osztalyfonok", "osztalyai"
      ],
      supported_column_names: {
        vezetekNev: ["vezetekNev", "Vezetéknév", "last_name"],
        keresztNev: ["keresztNev", "Keresztnév", "first_name"],
        email: ["email", "E-mail cím", "Email", "e_mail"],
        telefonszam: ["telefonszam", "Telefonszám", "phone", "telefon"],
        stab: ["stab", "Stáb"],
        kezdesEve: ["kezdesEve", "Kezdés éve", "starting_year"],
        tagozat: ["tagozat", "Tagozat", "department"],
        radio: ["radio", "Rádió", "radio_stab"],
        gyartasvezeto: ["gyartasvezeto", "Gyártásvezető?", "production_manager"],
        mediatana: ["mediatana", "Médiatanár", "media_teacher"],
        osztalyfonok: ["osztalyfonok", "Osztályfőnök", "class_teacher"],
        osztalyai: ["osztalyai", "Osztályai", "classes"]
      },
      example_csv: "Vezetéknév;Keresztnév;E-mail cím;Telefonszám;Stáb;Kezdés éve;Tagozat;Rádió;Gyártásvezető?;Médiatanár;Osztályfőnök;Osztályai\nNagy;Imre;nagy.imre@example.com;+36301234567;A stáb;2025;F;;;;;\nKis;Péter;kis.peter@example.com;;B stáb;2024;M;B3;;;;\nKovács;Anna;kovacs.anna@example.com;+36309876543;;;;;Igen;Igen;;2025F",
      encoding_requirements: {
        required_encoding: "UTF-8",
        supported_delimiters: [";", ",", "\\t"],
        boolean_values: ["Igen/Nem", "igen/nem", "true/false", "empty for false"],
        multiple_values: "Semicolon separated (e.g., 9.A;9.B;10.C)"
      },
      validation_rules: {
        email: "Must be valid email format",
        kezdesEve: "Must be numeric year (e.g., 2024, 2025)",
        boolean_fields: "Use 'Igen' for true, empty or 'Nem' for false",
        osztályai: "Multiple classes separated by semicolon"
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Import template error:', error)
    
    return NextResponse.json({ 
      message: 'Internal server error'
    }, { status: 500 })
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

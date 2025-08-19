/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Users, 
  UserPlus, 
  GraduationCap, 
  School, 
  Building, 
  Camera, 
  Settings,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Upload,
  Plus,
  Trash2,
  Info
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { apiClient } from '@/lib/api'

interface FirstStepsWizardProps {
  onComplete: () => void
}

interface SchoolYear {
  startDate: string
  endDate: string
}

interface Class {
  startingYear: number
  section: string
}

interface Staff {
  name: string
}

interface Student {
  class_year: number
  class_section: string
  last_name: string
  first_name: string
  email: string
  phone: string
  staff: string
}

interface Teacher {
  id?: string
  last_name: string
  first_name: string
  email: string
  phone: string
  role: 'media_teacher' | 'class_teacher'
  created?: boolean
  registration_link?: string
}

interface Partner {
  name: string
  address: string
  type: string
}

interface Equipment {
  nickname: string
  type: string
  brand: string
  model: string
  serial_number?: string
  functional: boolean
  notes?: string
}

const STEPS = [
  { id: 1, title: 'Tanév konfigurálása', icon: Calendar },
  { id: 2, title: 'Osztályok konfigurálása', icon: GraduationCap },
  { id: 3, title: 'Stábok konfigurálása', icon: Users },
  { id: 4, title: 'Tanulók konfigurálása', icon: UserPlus },
  { id: 5, title: 'Tanárok konfigurálása', icon: School },
  { id: 6, title: 'Partnerintézmények', icon: Building },
  { id: 7, title: 'Felszerelések', icon: Camera },
  { id: 8, title: 'Utolsó simítások', icon: Settings }
]

export function FirstStepsWizard({ onComplete }: FirstStepsWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [schoolYear, setSchoolYear] = useState<SchoolYear>({ startDate: '', endDate: '' })
  const [classes, setClasses] = useState<Class[]>([])
  const [staffs, setStaffs] = useState<Staff[]>([{ name: 'A Stáb' }, { name: 'B Stáb' }])
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [completionStatus, setCompletionStatus] = useState({
    teachersCreated: false,
    studentEmailsSent: false,
    allRegistrationLinksGenerated: false
  })
  const { toast } = useToast()

  const progress = (currentStep / STEPS.length) * 100

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = async () => {
    try {
      // Step 1: Create school year
      await apiClient.createSchoolYear({
        start_date: schoolYear.startDate,
        end_date: schoolYear.endDate
      })

      // Step 2: Create classes
      for (const cls of classes) {
        await apiClient.createClass({
          start_year: cls.startingYear,
          szekcio: cls.section
        })
      }

      // Step 3: Create staff (stabs)
      for (const staff of staffs) {
        await apiClient.createStab({
          name: staff.name
        })
      }

      // Step 4: Create students
      for (const student of students) {
        await apiClient.createUser({
          username: `${student.last_name.toLowerCase()}.${student.first_name.toLowerCase()}`,
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          admin_type: 'student',
          telefonszam: student.phone
        })
      }

      // Step 5: Create teachers
      for (const teacher of teachers) {
        await apiClient.createUser({
          username: `${teacher.last_name.toLowerCase()}.${teacher.first_name.toLowerCase()}`,
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          email: teacher.email,
          admin_type: teacher.role === 'media_teacher' ? 'teacher' : 'class_teacher',
          telefonszam: teacher.phone
        })
      }

      // Step 6: Create partners
      for (const partner of partners) {
        await apiClient.createPartner({
          name: partner.name,
          address: partner.address,
          institution: partner.type
        })
      }

      // Step 7: Create equipment
      for (const equip of equipment) {
        await apiClient.createEquipment({
          nickname: equip.nickname,
          brand: equip.brand,
          model: equip.model,
          serial_number: equip.serial_number,
          functional: equip.functional,
          notes: equip.notes
        })
      }

      // Step 8: Complete setup (this would be a custom endpoint or just mark as complete)
      // For now, we'll just show success
      toast({
        title: "Sikeres beállítás",
        description: "A rendszer sikeresen konfigurálva lett!",
      })

      onComplete()
    } catch (error: any) {
      console.error('Setup error:', error)
      toast({
        title: "Hiba történt",
        description: error.message || "Ismeretlen hiba történt a beállítás során",
        variant: "destructive"
      })
    }
  }

  const addClass = () => {
    setClasses([...classes, { startingYear: new Date().getFullYear(), section: 'A' }])
  }

  const removeClass = (index: number) => {
    setClasses(classes.filter((_, i) => i !== index))
  }

  const updateClass = (index: number, field: keyof Class, value: any) => {
    const updatedClasses = [...classes]
    updatedClasses[index] = { ...updatedClasses[index], [field]: value }
    setClasses(updatedClasses)
  }

  const addStaff = () => {
    setStaffs([...staffs, { name: '' }])
  }

  const removeStaff = (index: number) => {
    setStaffs(staffs.filter((_, i) => i !== index))
  }

  const updateStaff = (index: number, name: string) => {
    const updatedStaffs = [...staffs]
    updatedStaffs[index] = { name }
    setStaffs(updatedStaffs)
  }

  const addTeacher = () => {
    setTeachers([...teachers, { 
      last_name: '', 
      first_name: '', 
      email: '', 
      phone: '', 
      role: 'media_teacher',
      created: false 
    }])
  }

  const removeTeacher = (index: number) => {
    setTeachers(teachers.filter((_, i) => i !== index))
  }

  const updateTeacher = (index: number, field: keyof Teacher, value: string) => {
    const updatedTeachers = [...teachers]
    updatedTeachers[index] = { ...updatedTeachers[index], [field]: value }
    setTeachers(updatedTeachers)
  }

  const createTeacher = async (index: number) => {
    const teacher = teachers[index]
    if (!teacher.last_name || !teacher.first_name || !teacher.email) {
      toast({
        title: 'Hiányzó adatok',
        description: 'Kérem töltse ki az összes kötelező mezőt.',
        variant: 'destructive'
      })
      return
    }

    try {
      // Convert Teacher to UserCreateSchema
      const userData = {
        username: teacher.email, // Use email as username
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        email: teacher.email,
        telefonszam: teacher.phone,
        special_role: teacher.role
      }
      
      const response = await apiClient.createUser(userData)
      const updatedTeachers = [...teachers]
      updatedTeachers[index] = { 
        ...updatedTeachers[index], 
        id: response.id.toString(),
        created: true 
      }
      setTeachers(updatedTeachers)
      
      toast({
        title: 'Sikeres létrehozás',
        description: `${teacher.first_name} ${teacher.last_name} sikeresen létrehozva.`
      })
    } catch (error) {
      toast({
        title: 'Hiba',
        description: 'Nem sikerült létrehozni a tanárt.',
        variant: 'destructive'
      })
    }
  }

  const getRegistrationLink = async (index: number) => {
    const teacher = teachers[index]
    if (!teacher.id || !teacher.created) return

    try {
      const response = await apiClient.generateUserFirstLoginToken(parseInt(teacher.id))
      const updatedTeachers = [...teachers]
      updatedTeachers[index] = { 
        ...updatedTeachers[index], 
        registration_link: response.token_url 
      }
      setTeachers(updatedTeachers)
      
      // Copy to clipboard
      await navigator.clipboard.writeText(response.token_url)
      toast({
        title: 'Link másolva',
        description: 'A regisztrációs link a vágólapra került.'
      })
    } catch (error) {
      toast({
        title: 'Hiba',
        description: 'Nem sikerült lekérni a regisztrációs linket.',
        variant: 'destructive'
      })
    }
  }

  const sendStudentEmails = async (classData: { startingYear: number, section: string }) => {
    try {
      // TODO: Implement student email sending functionality
      // const response = await apiClient.sendStudentRegistrationEmails({
      //   class_year: classData.startingYear,
      //   class_section: classData.section
      // })
      
      toast({
        title: 'Funkció fejlesztés alatt',
        description: 'A diák e-mail küldés funkció hamarosan elérhető lesz.'
      })
    } catch (error) {
      toast({
        title: 'Hiba',
        description: 'Nem sikerült elküldeni az e-maileket.',
        variant: 'destructive'
      })
    }
  }

  const skipOptionalStep = () => {
    // For optional steps (6, 7), allow skipping
    if (currentStep === 6 || currentStep === 7) {
      nextStep()
    }
  }

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: return !!(schoolYear.startDate && schoolYear.endDate)
      case 2: return classes.length > 0
      case 3: return staffs.length > 0 && staffs.every(s => s.name.trim())
      case 4: return true // Students can be skipped for now
      case 5: return teachers.length > 0 && teachers.every(t => t.created)
      case 6: return true // Optional
      case 7: return true // Optional
      case 8: return completionStatus.teachersCreated && completionStatus.allRegistrationLinksGenerated
      default: return false
    }
  }

  const canFinish = (): boolean => {
    return teachers.every(t => t.created && t.registration_link) && 
           completionStatus.allRegistrationLinksGenerated
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                1. Lépés - Tanév konfigurálása
              </CardTitle>
              <CardDescription>
                A tanév kezdő dátumának adja meg azt a dátumot, melytől a többi felhasználó számára 
                elérhetővé válik a rendszer, például: Augusztus 25, de a szeptember 1 nem javasolt, 
                mivel ebben az esetben, csak ettől a naptól láthatóak a kitűzött forgatások.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="start-date">Tanév Kezdete</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={schoolYear.startDate}
                  onChange={(e) => setSchoolYear({ ...schoolYear, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-date">Tanév Vége</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={schoolYear.endDate}
                  onChange={(e) => setSchoolYear({ ...schoolYear, endDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                2. Lépés - Osztályok konfigurálása
              </CardTitle>
              <CardDescription>
                Kérem adja meg, az összes idén aktív osztályt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classes.map((cls, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Osztály #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeClass(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Kezdő év</Label>
                      <Input
                        type="number"
                        value={cls.startingYear}
                        onChange={(e) => updateClass(index, 'startingYear', parseInt(e.target.value))}
                        placeholder="pl. 2023"
                      />
                    </div>
                    <div>
                      <Label>Szekció</Label>
                      <Select
                        value={cls.section}
                        onValueChange={(value) => updateClass(index, 'section', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(section => (
                            <SelectItem key={section} value={section}>{section}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={addClass} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Új Osztály
              </Button>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                3. Lépés - Stábok konfigurálása
              </CardTitle>
              <CardDescription>
                Kérem adja meg, az összes idén aktív stábot, vagy amennyiben stimmelnek a lent látható adatok, 
                kattintson a Tovább gombra. (A rádiózás stábjait nem itt kell konfigurálni)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {staffs.map((staff, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={staff.name}
                    onChange={(e) => updateStaff(index, e.target.value)}
                    placeholder="Stáb neve"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStaff(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addStaff} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Új Stáb
              </Button>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                4. Lépés - Tanulók konfigurálása
              </CardTitle>
              <CardDescription>
                3 féle mód van egy osztály feltöltésére: .csv fájl importálásával, .json fájl importálásával, 
                vagy kézi adatbevitel segítségével.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Véletlenszerű jelszavak megadására nem lesz szükség, a rendszer automatikusan küld 
                  e-mailt a tanulóknak regisztrációs linkkel.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h4 className="font-medium">Importálási módok</h4>
                
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">.csv fájl importálása</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Oszlopok: osztaly_ev, osztaly_szekcio, vezeteknev, keresztnev, email, telefonszam, stab
                  </p>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    2023, F, Kovács, János, kovacs.janos.23f@szlgbp.hu, 06301234567, A Stáb<br/>
                    2023, F, Szabó, Anna, szabo.anna.23f@szlgbp.hu, 06201234567, B Stáb
                  </div>
                  <Input type="file" accept=".csv" className="mt-3" />
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">.json fájl importálása</h5>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    [{`{
  "osztaly_ev": 2023,
  "osztaly_szekcio": "F",
  "vezeteknev": "Kovács",
  "keresztnev": "János",
  "email": "kovacs.janos.23f@szlgbp.hu",
  "telefonszam": "06301234567",
  "stab": "A Stáb"
}`}]
                  </div>
                  <Input type="file" accept=".json" className="mt-3" />
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">Kézi adatbevitel</h5>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Új tanuló hozzáadása
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                5. Lépés - Tanárok konfigurálása
              </CardTitle>
              <CardDescription>
                Médiatanárok és osztályfőnökök konfigurálása. A tanárokat először létre kell hozni, 
                majd regisztrációs linkeket kell generálni számukra.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  A Médiatanároknak és Osztályfőnököknek adminisztrátori jogosultságaik lesznek a rendszerben.
                </AlertDescription>
              </Alert>

              {teachers.map((teacher, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">
                        {teacher.role === 'media_teacher' ? 'Médiatanár' : 'Osztályfőnök'} #{index + 1}
                      </h4>
                      {teacher.created && (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Létrehozva
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeacher(index)}
                      disabled={teacher.created}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Tanár típusa</Label>
                      <Select
                        value={teacher.role}
                        onValueChange={(value: 'media_teacher' | 'class_teacher') => 
                          updateTeacher(index, 'role', value)}
                        disabled={teacher.created}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="media_teacher">Médiatanár</SelectItem>
                          <SelectItem value="class_teacher">Osztályfőnök</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div></div>
                    
                    <div>
                      <Label>Vezetéknév</Label>
                      <Input
                        value={teacher.last_name}
                        onChange={(e) => updateTeacher(index, 'last_name', e.target.value)}
                        disabled={teacher.created}
                      />
                    </div>
                    <div>
                      <Label>Keresztnév</Label>
                      <Input
                        value={teacher.first_name}
                        onChange={(e) => updateTeacher(index, 'first_name', e.target.value)}
                        disabled={teacher.created}
                      />
                    </div>
                    <div>
                      <Label>Email cím</Label>
                      <Input
                        type="email"
                        value={teacher.email}
                        onChange={(e) => updateTeacher(index, 'email', e.target.value)}
                        disabled={teacher.created}
                      />
                    </div>
                    <div>
                      <Label>Telefonszám</Label>
                      <Input
                        value={teacher.phone}
                        onChange={(e) => updateTeacher(index, 'phone', e.target.value)}
                        disabled={teacher.created}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {!teacher.created ? (
                      <Button 
                        onClick={() => createTeacher(index)}
                        disabled={!teacher.last_name || !teacher.first_name || !teacher.email}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Tanár létrehozása
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => getRegistrationLink(index)}
                        disabled={!teacher.created}
                        variant="outline"
                      >
                        {teacher.registration_link ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Link újra másolása
                          </>
                        ) : (
                          <>
                            <Settings className="h-4 w-4 mr-2" />
                            Regisztrációs link másolása
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <Button onClick={addTeacher} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Új Tanár hozzáadása
              </Button>
            </CardContent>
          </Card>
        )

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                6. Lépés - Partnerintézmények megadása
              </CardTitle>
              <CardDescription>
                Opcionális, később is konfigurálható. Feltöltheti a partnerintézményeket, 
                ahová a diákok forgatni járnak.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Ez a lépés opcionális. Később is konfigurálható, még akár a diákok (riporterek) is tudnak új intézményt hozzáadni.
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <Button variant="outline" onClick={skipOptionalStep}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Kihagyás (később beállítható)
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">.csv fájl importálása</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Oszlopok: intezmeny_neve, intezmeny_cime, intezmeny_tipusa
                  </p>
                  <Input type="file" accept=".csv" />
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">.json fájl importálása</h5>
                  <Input type="file" accept=".json" />
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">Kézi adatbevitel</h5>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Új intézmény hozzáadása
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                7. Lépés - Felszerelések bevitele
              </CardTitle>
              <CardDescription>
                Opcionális, később is konfigurálható. Csupán a tanárok vagy gyártásvezetők 
                tudnak majd új felszerelést hozzáadni a rendszerhez.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Ez a lépés opcionális. Később is konfigurálható a Felszerelések menüpontban.
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <Button variant="outline" onClick={skipOptionalStep}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Kihagyás (később beállítható)
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">.csv fájl importálása</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Oszlopok: felszereles_beceneve, felszereles_tipusa, felszereles_markaja, 
                    felszereles_modell, szeriaszam, funkcionalis, jegyzetek
                  </p>
                  <Input type="file" accept=".csv" />
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">.json fájl importálása</h5>
                  <Input type="file" accept=".json" />
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">Kézi adatbevitel</h5>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Új felszerelés hozzáadása
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                8. Lépés - Utolsó simítások és összefoglaló
              </CardTitle>
              <CardDescription>
                Ellenőrizze az összes adatot, küldje el a hozzáféréseket és fejezze be a beállítást.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Detailed Configuration Summary */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Konfigurációs összefoglaló</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* School Year */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      <Badge variant="outline">Tanév</Badge>
                    </div>
                    <p className="text-sm">
                      <strong>Kezdete:</strong> {schoolYear.startDate || 'Nincs beállítva'}<br/>
                      <strong>Vége:</strong> {schoolYear.endDate || 'Nincs beállítva'}
                    </p>
                  </div>

                  {/* Classes */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-4 w-4" />
                      <Badge variant="outline">Osztályok ({classes.length})</Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      {classes.length === 0 ? (
                        <p className="text-muted-foreground">Nincs osztály hozzáadva</p>
                      ) : (
                        classes.map((cls, i) => (
                          <p key={i}>{cls.startingYear}{cls.section}</p>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Staff */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4" />
                      <Badge variant="outline">Stábok ({staffs.length})</Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      {staffs.map((staff, i) => (
                        <p key={i}>{staff.name}</p>
                      ))}
                    </div>
                  </div>

                  {/* Teachers */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <School className="h-4 w-4" />
                      <Badge variant="outline">Tanárok ({teachers.length})</Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      {teachers.length === 0 ? (
                        <p className="text-muted-foreground">Nincs tanár hozzáadva</p>
                      ) : (
                        teachers.map((teacher, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span>{teacher.first_name} {teacher.last_name}</span>
                            <div className="flex items-center gap-1">
                              {teacher.created && <Badge variant="outline" className="text-xs">Létrehozva</Badge>}
                              {teacher.registration_link && <Badge variant="outline" className="text-xs text-green-600">Link</Badge>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Class-wise Student Email Sending */}
              <div className="space-y-4">
                <h4 className="font-medium">Hozzáférések kiküldése osztályonként</h4>
                <div className="space-y-3">
                  {classes.map((cls, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-lg p-3">
                      <span className="font-medium">{cls.startingYear}{cls.section} osztály</span>
                      <Button
                        onClick={() => sendStudentEmails(cls)}
                        size="sm"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Diákok regisztrációjának küldése
                      </Button>
                    </div>
                  ))}
                  {classes.length === 0 && (
                    <p className="text-muted-foreground text-sm">Nincs osztály konfigurálva</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Teacher Registration Links */}
              <div className="space-y-4">
                <h4 className="font-medium">Tanárok regisztrációs linkjei</h4>
                <div className="space-y-3">
                  {teachers.map((teacher, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">
                            {teacher.first_name} {teacher.last_name}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({teacher.role === 'media_teacher' ? 'Médiatanár' : 'Osztályfőnök'})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!teacher.created ? (
                            <Button
                              size="sm"
                              onClick={() => createTeacher(index)}
                              disabled={!teacher.last_name || !teacher.first_name || !teacher.email}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Létrehozás
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => getRegistrationLink(index)}
                            >
                              {teacher.registration_link ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Link újra másolása
                                </>
                              ) : (
                                <>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Link másolása
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      {teacher.registration_link && (
                        <div className="bg-muted p-2 rounded text-sm font-mono">
                          {teacher.registration_link}
                        </div>
                      )}
                    </div>
                  ))}
                  {teachers.length === 0 && (
                    <p className="text-muted-foreground text-sm">Nincs tanár konfigurálva</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* System Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Rendszerbeállítások</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">E-mail értesítések</Label>
                  <Select
                    value={emailNotifications ? 'yes' : 'no'}
                    onValueChange={(value) => setEmailNotifications(value === 'yes')}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Igen</SelectItem>
                      <SelectItem value="no">Nem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Completion Status */}
              {!canFinish() && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    A befejezéshez minden tanárt létre kell hozni és regisztrációs linkeket kell generálni számukra.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Első lépések beállítása</h2>
        <Badge variant="outline">{currentStep}/{STEPS.length}</Badge>
      </div>

      <Progress value={progress} className="w-full" />

      <div className="grid grid-cols-8 gap-2">
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.id}
              className={`flex flex-col items-center p-2 rounded-lg text-center ${
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : currentStep > step.id
                  ? 'bg-green-100 text-green-800'
                  : 'bg-muted'
              }`}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="text-xs">{step.id}</span>
            </div>
          )
        })}
      </div>

      {renderStep()}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Vissza
        </Button>

        <div className="flex gap-2">
          {/* Skip button for optional steps */}
          {(currentStep === 6 || currentStep === 7) && (
            <Button
              variant="outline"
              onClick={skipOptionalStep}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Kihagyás
            </Button>
          )}

          {currentStep === STEPS.length ? (
            <Button 
              onClick={handleFinish} 
              className="bg-green-600 hover:bg-green-700"
              disabled={!canFinish()}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Befejezés
            </Button>
          ) : (
            <Button 
              onClick={nextStep}
              disabled={(currentStep === 6 || currentStep === 7) ? false : !isStepComplete(currentStep)}
            >
              Tovább
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Server, Database, Shield, Code2, Cloud, Zap, Monitor, Lock, Globe, CheckCircle, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface TechStackItem {
  name: string
  description: string
  version?: string
  purpose: string
  icon: React.ComponentType<any>
  badges?: string[]
  link?: string
}

interface SecurityFeature {
  title: string
  description: string
  implementation: string
  icon: React.ComponentType<any>
}

export default function TechnicalDetailsPage() {
  const frontendStack: TechStackItem[] = [
    {
      name: 'Next.js',
      description: 'Modern React keretrendszer szerver-oldali renderelással és optimalizálással',
      version: '14.x',
      purpose: 'Frontend keretrendszer és alkalmazás routing',
      icon: Code2,
      badges: ['SSR', 'Optimalizált', 'TypeScript'],
      link: 'https://nextjs.org'
    },
    {
      name: 'TypeScript',
      description: 'Statikusan tipizált JavaScript, amely növeli a kód megbízhatóságát',
      version: '5.x',
      purpose: 'Típusbiztonsági rendszer és fejlesztői élmény javítása',
      icon: Code2,
      badges: ['Típusbiztonság', 'IntelliSense', 'Refaktoring']
    },
    {
      name: 'Tailwind CSS',
      description: 'Utility-first CSS keretrendszer gyors és konzisztens dizájnhoz',
      version: '3.x',
      purpose: 'Stíluskezelés és reszponzív dizájn',
      icon: Globe,
      badges: ['Utility-first', 'Reszponzív', 'Optimalizált']
    }
  ]

  const backendStack: TechStackItem[] = [
    {
      name: 'Node.js',
      description: 'JavaScript runtime környezet szerver-oldali alkalmazásokhoz',
      version: '20.x LTS',
      purpose: 'Szerver-oldali alkalmazás futtatása',
      icon: Server,
      badges: ['LTS', 'Gyors', 'Skálázható']
    },
    {
      name: 'Express.js',
      description: 'Minimális és rugalmas Node.js web alkalmazás keretrendszer',
      version: '4.x',
      purpose: 'API endpoints és middleware kezelése',
      icon: Server,
      badges: ['RESTful API', 'Middleware', 'Routing']
    },
    {
      name: 'PostgreSQL',
      description: 'Fejlett, nyílt forráskódú relációs adatbázis-kezelő rendszer',
      version: '15.x',
      purpose: 'Adatok tárolása és kezelése',
      icon: Database,
      badges: ['ACID', 'Relációs', 'Performant']
    }
  ]

  const infrastructureStack: TechStackItem[] = [
    {
      name: 'Cloudflare',
      description: 'Globális CDN és biztonsági szolgáltatások',
      purpose: 'DDoS védelem, gyorsítótár, SSL terminálás',
      icon: Cloud,
      badges: ['CDN', 'DDoS Protection', 'SSL/TLS']
    },
    {
      name: 'Docker',
      description: 'Konténerizációs platform alkalmazások csomagolásához',
      purpose: 'Alkalmazás telepítése és környezet izolálása',
      icon: Server,
      badges: ['Konténerizáció', 'Portable', 'Izolált']
    },
    {
      name: 'GitHub Actions',
      description: 'CI/CD pipeline automatizáláshoz és deployment-hez',
      purpose: 'Automatikus tesztelés és telepítés',
      icon: Zap,
      badges: ['CI/CD', 'Automatizált', 'GitHub integráció']
    }
  ]

  const securityFeatures: SecurityFeature[] = [
    {
      title: 'HTTPS/TLS 1.3 titkosítás',
      description: 'Minden kommunikáció end-to-end titkosítással védett',
      implementation: 'Cloudflare SSL/TLS tanúsítványok automatikus megújítással',
      icon: Lock
    },
    {
      title: 'DDoS Protection',
      description: 'Automatikus védelem elosztott szolgáltatásmegtagadási támadások ellen',
      implementation: 'Cloudflare Pro terv 20+ Tbps kapacitással',
      icon: Shield
    },
    {
      title: 'Bot Management',
      description: 'Intelligens bot detekció és szűrés',
      implementation: 'Cloudflare Bot Management és rate limiting',
      icon: Monitor
    },
    {
      title: 'CSRF & XSS védelem',
      description: 'Cross-site scripting és kérés hamisítás elleni védelem',
      implementation: 'Next.js beépített biztonsági fejléceivel és Content Security Policy-vel',
      icon: Shield
    }
  ]

  const performanceOptimizations = [
    'Szerver-oldali renderelés (SSR) gyorsabb kezdeti betöltéshez',
    'Automatikus kód splitting és lazy loading',
    'Image optimalizálás Next.js Image komponenssel',
    'Cloudflare CDN globális gyorsítótárazással',
    'Database connection pooling',
    'Gzip/Brotli tömörítés minden assetre',
    'Service Worker cache stratégiák',
    'Critical CSS inlining'
  ]

  const TechStackCard = ({ item }: { item: TechStackItem }) => (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <item.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {item.name}
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </CardTitle>
              {item.version && (
                <Badge variant="outline" className="text-xs mt-1">
                  v{item.version}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-gray-600 mt-2">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-700">Célkitűzés:</span>
            <p className="text-sm text-gray-600 mt-1">{item.purpose}</p>
          </div>
          {item.badges && (
            <div className="flex flex-wrap gap-1">
              {item.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const SecurityCard = ({ feature }: { feature: SecurityFeature }) => (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <feature.icon className="w-5 h-5 text-green-600" />
          </div>
          <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
        </div>
        <CardDescription className="text-gray-600 mt-2">
          {feature.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div>
          <span className="text-sm font-medium text-gray-700">Implementáció:</span>
          <p className="text-sm text-gray-600 mt-1">{feature.implementation}</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Vissza a főoldalra
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Technikai részletek</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            FTV Technikai Architektúra
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Modern technológiák és enterprise szintű biztonsági megoldások, amelyek az FTV platform működését biztosítják
          </p>
        </div>

        {/* Frontend Stack */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Frontend Technológiák</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {frontendStack.map((item) => (
              <TechStackCard key={item.name} item={item} />
            ))}
          </div>
        </section>

        {/* Backend Stack */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Backend Technológiák</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {backendStack.map((item) => (
              <TechStackCard key={item.name} item={item} />
            ))}
          </div>
        </section>

        {/* Infrastructure */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Infrastruktúra és DevOps</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {infrastructureStack.map((item) => (
              <TechStackCard key={item.name} item={item} />
            ))}
          </div>
        </section>

        {/* Security Features */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Biztonsági Funkciók</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {securityFeatures.map((feature) => (
              <SecurityCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        {/* Performance Optimizations */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Teljesítmény Optimalizációk</h3>
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-600" />
                Alkalmazott Optimalizációk
              </CardTitle>
              <CardDescription>
                Technikai megoldások, amelyek biztosítják a gyors és zökkenőmentes felhasználói élményt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {performanceOptimizations.map((optimization, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{optimization}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Architecture Diagram Placeholder */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Rendszer Architektúra</h3>
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle>Alkalmazás Felépítése</CardTitle>
              <CardDescription>
                Az FTV platform komponenseinek kapcsolata és adatfolyama
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-gray-700">Frontend (Next.js)</div>
                  <div className="text-4xl">↕</div>
                  <div className="text-lg font-semibold text-gray-700">API Layer (Express.js)</div>
                  <div className="text-4xl">↕</div>
                  <div className="text-lg font-semibold text-gray-700">Database (PostgreSQL)</div>
                </div>
                <div className="mt-6 text-sm text-gray-600">
                  Cloudflare CDN és biztonsági szolgáltatások minden szinten
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact for Technical Questions */}
        <section>
          <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Technikai kérdések?</CardTitle>
              <CardDescription>
                Ha további technikai információkra van szükséged az FTV platformról, lépj kapcsolatba a fejlesztői csapattal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Kapcsolatfelvétel
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
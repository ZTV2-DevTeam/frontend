"use client"

import React from 'react'
import { AbsenceStats } from '@/components/absence-stats'
import { TavolletSchema } from '@/lib/api'

// Mock data for preview
const mockAbsences: TavolletSchema[] = [
  {
    id: 1,
    user: { id: 1, username: 'john.doe', first_name: 'John', last_name: 'Doe', full_name: 'John Doe' },
    start_date: '2024-01-15',
    end_date: '2024-01-17',
    duration_days: 3,
    reason: 'Betegség',
    status: 'jóváhagyva',
    approved: true,
    denied: false
  },
  {
    id: 2,
    user: { id: 2, username: 'jane.smith', first_name: 'Jane', last_name: 'Smith', full_name: 'Jane Smith' },
    start_date: '2024-01-20',
    end_date: '2024-01-22',
    duration_days: 3,
    reason: 'Családi ok',
    status: 'függőben',
    approved: false,
    denied: false
  },
  {
    id: 3,
    user: { id: 3, username: 'bob.johnson', first_name: 'Bob', last_name: 'Johnson', full_name: 'Bob Johnson' },
    start_date: '2024-01-25',
    end_date: '2024-01-26',
    duration_days: 2,
    reason: 'Orvosi vizsgálat',
    status: 'elutasítva',
    approved: false,
    denied: true
  },
  {
    id: 4,
    user: { id: 4, username: 'alice.brown', first_name: 'Alice', last_name: 'Brown', full_name: 'Alice Brown' },
    start_date: '2024-02-01',
    end_date: '2024-02-05',
    duration_days: 5,
    reason: 'Utazás',
    status: 'folyamatban',
    approved: true,
    denied: false
  },
  {
    id: 5,
    user: { id: 5, username: 'charlie.wilson', first_name: 'Charlie', last_name: 'Wilson', full_name: 'Charlie Wilson' },
    start_date: '2024-02-10',
    end_date: '2024-02-12',
    duration_days: 3,
    reason: 'Személyes ügy',
    status: 'jövőbeli',
    approved: false,
    denied: false
  }
]

export default function StatsPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Távollét Statisztikák - Új Design Előnézet
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Modern, interaktív és reszponzív design a távollét statisztikákhoz
          </p>
        </div>

        <div className="space-y-12">
          {/* Admin View */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Admin Nézet</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                Adminisztrátor
              </span>
            </div>
            <AbsenceStats absences={mockAbsences} isAdmin={true} />
          </section>

          {/* Student View */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Diák Nézet</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Diák
              </span>
            </div>
            <AbsenceStats absences={mockAbsences.slice(0, 3)} isAdmin={false} />
          </section>

          {/* Features */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Új Design Funkciók</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">📊 Osztott Progressz Bár</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Az elfogadott, függőben lévő és elutasított kérelmek aránya egy intuitív progressz báron
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🎯 Kompakt Design</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  A másodlagos statisztikák kompakt kártyákban, kevesebb helyet foglalva
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🌈 Színkódolt Legenda</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Könnyen értelmezhető színes legenda a státusz megoszláshoz
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">� Mobil Barát</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Minden képernyőméreten jól működő, reszponzív elrendezés
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">💡 Admin Insights</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Adminok számára hasznos összesített információk és arányok
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">⚡ Dinamikus Animációk</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Sima átmenetek és hover effektek a jobb felhasználói élményért
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

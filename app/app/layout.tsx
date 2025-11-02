'use client'

import { ProtectedRoute } from "@/components/protected-route"
import { SeasonalSnowfall } from "@/components/seasonal-snowfall"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <SeasonalSnowfall />
      <style jsx global>{`
        html {
          background: var(--sidebar)!important;
          }
          body::before,
          body::after {
            content: '';
            position: fixed;
            left: 0;
            right: 0;
            height: 200px;
            background: linear-gradient(to bottom, var(--sidebar), var(--sidebar));
            z-index: -1;
            pointer-events: none;
          }
          
          body::before {
            top: -200px;
            background: linear-gradient(to bottom, var(--sidebar), var(--sidebar));
          }
          
          body::after {
            bottom: -200px;
            background: linear-gradient(to top, var(--sidebar), var(--sidebar));
          }
          
          /* Enhanced mobile overscroll with rubber band effect */
          @media (max-width: 768px) {
            html {
              overscroll-behavior-y: auto;
              background: var(--sidebar);
            }
            
            body {
              overscroll-behavior-y: contain;
              -webkit-overflow-scrolling: touch;
              background: var(--sidebar);
            }
            
            /* Main content container for mobile - remove borders and padding to have full-width content */
            .relative.flex.min-h-screen.flex-col {
              background: var(--sidebar);
              border: none;
              margin: 0;
              padding: 0;
            }
          }
      `}</style>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
    </ProtectedRoute>
  )
}

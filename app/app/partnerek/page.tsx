'use client'

import { DisabledFeatureMessage } from "@/components/disabled-feature-message"

export default function PartnersPage() {
  return (
    <DisabledFeatureMessage 
      featureName="Partnerkezelő" 
      description="A partnerkezelő funkció jelenleg fejlesztés alatt áll és ideiglenesen nem elérhető."
    />
  )
}
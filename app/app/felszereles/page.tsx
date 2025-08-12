"use client"

import { DisabledFeatureMessage } from "@/components/disabled-feature-message"

export default function EquipmentPage() {
  return (
    <DisabledFeatureMessage 
      featureName="Felszereléskezelő" 
      description="A felszereléskezelő funkció jelenleg fejlesztés alatt áll és ideiglenesen nem elérhető."
    />
  )
}
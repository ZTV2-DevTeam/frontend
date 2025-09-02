"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useConfetti } from "@/components/confetti"
import { Sparkles, Heart, Camera } from "lucide-react"

export function ConfettiTest() {
  const { triggerSuccess, triggerValentine, triggerCelebrate } = useConfetti()

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Confetti Test
        </CardTitle>
        <CardDescription>
          Test the different confetti animations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={triggerSuccess} 
          className="w-full"
          variant="default"
        >
          <Camera className="h-4 w-4 mr-2" />
          Success Confetti (Forgatás Creation)
        </Button>
        
        <Button 
          onClick={triggerValentine} 
          className="w-full"
          variant="secondary"
        >
          <Heart className="h-4 w-4 mr-2" />
          Valentine Easter Egg
        </Button>
        
        <Button 
          onClick={triggerCelebrate} 
          className="w-full"
          variant="outline"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generic Celebration
        </Button>
      </CardContent>
    </Card>
  )
}

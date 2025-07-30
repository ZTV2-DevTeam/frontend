"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Construction, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FAQItem {
  question: string
  answer: string
}

interface ComingSoonProps {
  featureName: string
  description?: string
  faqs?: FAQItem[]
  estimatedCompletion?: string
}

export function ComingSoon({ 
  featureName, 
  description = "Ez a funkció jelenleg fejlesztés alatt áll.", 
  faqs = [],
  estimatedCompletion 
}: ComingSoonProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-4">
              <Construction className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">
              Erre az üres helyre{" "}
              <span className="font-bold text-primary">{featureName}</span>{" "}
              funkciót képzelnénk.
            </CardTitle>
            <CardDescription className="text-base">
              {description}
            </CardDescription>
            {estimatedCompletion && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <Clock className="h-4 w-4" />
                <Badge variant="outline">
                  Várhatóan elkészül: {estimatedCompletion}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        {faqs.length > 0 && (
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Gyakran Ismételt Kérdések</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Ezek az információk nem véglegesek, a funkció sem feltétlenül fog létezni. Ezek csupán ötletek és tervek a jövőre nézve. Ha bármilyen javaslatod van, kérjük, oszd meg velünk!
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

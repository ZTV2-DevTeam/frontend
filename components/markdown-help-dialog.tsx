"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EnhancedMarkdownRenderer } from '@/components/enhanced-markdown-renderer'
import { HelpCircle, BookOpen } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MarkdownHelpDialogProps {
  trigger?: React.ReactNode
}

const basicMarkdownExamples = `# Nagy címsor (H1)
## Közepes címsor (H2)  
### Kis címsor (H3)

**Félkövér szöveg** vagy __félkövér szöveg__

*Dőlt szöveg* vagy _dőlt szöveg_

~~Áthúzott szöveg~~

\`Kódrészlet\` a szövegben

> Ez egy idézet blokk
> Több soros idézet is lehet

---

Vízszintes elválasztó vonal a fent látható

[Ez egy link](https://example.com)

![Kép címe](https://via.placeholder.com/150)
`

const listsAndTablesExamples = `## Felsorolások

### Számozatlan lista:
- Első elem
- Második elem
  - Alelem 1
  - Alelem 2
- Harmadik elem

### Számozott lista:
1. Első pont
2. Második pont
   1. Alpont a
   2. Alpont b
3. Harmadik pont

### Feladatlista:
- [x] Kész feladat
- [ ] Nem kész feladat
- [x] Másik kész feladat

## Táblázatok

| Oszlop 1 | Oszlop 2 | Oszlop 3 |
|----------|----------|----------|
| Adat 1   | Adat 2   | Adat 3   |
| Hosszabb szöveg | Rövid | Közepes |
| **Félkövér** | *Dőlt* | \`Kód\` |
`

const codeAndMathExamples = `## Kódrészletek

### Inline kód:
A \`console.log("Hello World")\` parancs kiírja a szöveget.

### Kódblokk:
\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}

const message = greet("Világ");
console.log(message);
\`\`\`

### Python kód:
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

## Matematikai kifejezések

### Inline matematika:
A Pitagorasz-tétel: $a^2 + b^2 = c^2$

### Blokk matematika:
$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
`

const emojiAndSpecialExamples = `## Emoji támogatás

### Gyakori emojik:
:smile: :heart: :thumbsup: :tada: :rocket: :star:
:warning: :exclamation: :question: :bulb: :fire: :zap:
:computer: :book: :pencil: :clipboard: :calendar: :clock:

### Arcok és érzelmek:
:joy: :laughing: :blush: :wink: :thinking: :confused:
:worried: :disappointed: :angry: :cry: :sob: :fearful:

## Speciális formázás

### Kombinált formázás:
***Félkövér és dőlt egyszerre***

~~***Áthúzott, félkövér és dőlt***~~

### Escape karakterek:
\\*Ez nem lesz dőlt\\*
\\[Ez nem lesz link\\]
\\# Ez nem lesz címsor

### Sortörések:
Két szóköz a sor végén  
új sort eredményez.

Vagy használj üres sort

új bekezdéshez.

### HTML támogatás:
<mark>Kiemelt szöveg</mark>
<u>Aláhúzott szöveg</u>
<sub>Alsó index</sub> és <sup>felső index</sup>
`

export function MarkdownHelpDialog({ trigger }: MarkdownHelpDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Markdown Súgó
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Markdown Formázási Súgó
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Alapok</TabsTrigger>
            <TabsTrigger value="lists">Listák & Táblák</TabsTrigger>
            <TabsTrigger value="code">Kód & Matek</TabsTrigger>
            <TabsTrigger value="special">Emoji & Extra</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[60vh] mt-4">
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Markdown kód:</h3>
                  <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                    {basicMarkdownExamples}
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Eredmény:</h3>
                  <div className="border rounded p-3 bg-background">
                    <EnhancedMarkdownRenderer>
                      {basicMarkdownExamples}
                    </EnhancedMarkdownRenderer>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lists" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Markdown kód:</h3>
                  <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                    {listsAndTablesExamples}
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Eredmény:</h3>
                  <div className="border rounded p-3 bg-background">
                    <EnhancedMarkdownRenderer>
                      {listsAndTablesExamples}
                    </EnhancedMarkdownRenderer>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Markdown kód:</h3>
                  <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                    {codeAndMathExamples}
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Eredmény:</h3>
                  <div className="border rounded p-3 bg-background">
                    <EnhancedMarkdownRenderer>
                      {codeAndMathExamples}
                    </EnhancedMarkdownRenderer>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="special" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Markdown kód:</h3>
                  <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                    {emojiAndSpecialExamples}
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Eredmény:</h3>
                  <div className="border rounded p-3 bg-background">
                    <EnhancedMarkdownRenderer>
                      {emojiAndSpecialExamples}
                    </EnhancedMarkdownRenderer>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

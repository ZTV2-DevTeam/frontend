import { ComingSoon } from "@/components/coming-soon"

export default function Page() {
  const faqs = [
    {
      question: "Milyen funkciók lesznek az irányítópulton?",
      answer: "Az irányítópult áttekintést nyújt a fontos információkról, mint például a saját forgatások, feladatok és statisztikák."
    },
    {
      question: "Hogyan tudom testreszabni az irányítópultot?",
      answer: "Az irányítópult testreszabható lesz, lehetőséget biztosítva a widgetek és információk kiválasztására."
    }
  ]

  return (
    <ComingSoon 
      featureName="IRÁNYÍTÓPULT"
      description="A rendszer kezdőoldala, ahol a felhasználók áttekinthetik a fontos információkat és gyorsan navigálhatnak a különböző funkciók között."
      faqs={faqs}
      estimatedCompletion="2025. szeptember"
    />
  )
}

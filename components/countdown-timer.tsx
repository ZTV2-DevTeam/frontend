"use client"

import { useState, useEffect } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const calculateTimeLeft = (targetDate: Date): TimeLeft | null => {
  const difference = +targetDate - +new Date()
  if (difference <= 0) {
    return null
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-4xl font-bold tracking-tighter md:text-5xl text-primary">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-xs tracking-widest uppercase text-muted-foreground">{label}</span>
  </div>
)

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client flag and initial time after component mounts
    setIsClient(true)
    setTimeLeft(calculateTimeLeft(targetDate))

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  // Show loading state during hydration
  if (!isClient || timeLeft === null) {
    return (
      <div className="flex justify-center gap-4 p-4 my-8 rounded-lg md:gap-8">
        <CountdownUnit value={0} label="Nap" />
        <CountdownUnit value={0} label="Óra" />
        <CountdownUnit value={0} label="Perc" />
        <CountdownUnit value={0} label="Másodperc" />
      </div>
    )
  }

  // Check if countdown has finished
  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <div className="my-8 text-center">
        <h2 className="text-3xl font-bold text-primary">Elindultunk!</h2>
        <p className="text-muted-foreground">Az alkalmazás mostantól elérhető a jogosult felhasználók számára.</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center gap-4 p-4 my-8 rounded-lg md:gap-8">
      <CountdownUnit value={timeLeft.days} label="Nap" />
      <CountdownUnit value={timeLeft.hours} label="Óra" />
      <CountdownUnit value={timeLeft.minutes} label="Perc" />
      <CountdownUnit value={timeLeft.seconds} label="Másodperc" />
    </div>
  )
}

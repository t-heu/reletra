import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

function formatRemainingTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0")
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0")
  const seconds = String(totalSeconds % 60).padStart(2, "0")
  return `${hours}:${minutes}:${seconds}`
}

export const NextWordTimer = () => {
  const [remaining, setRemaining] = useState("00:00:00")

  useEffect(() => {
    const updateRemainingTime = () => {
      const now = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(now.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const diff = tomorrow.getTime() - now.getTime()
      setRemaining(formatRemainingTime(diff))
    }

    updateRemainingTime()

    const interval = setInterval(updateRemainingTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-1 text-sm text-white">
      <Clock className="h-4 w-4" />
      <span className="font-mono">Próxima palavra em: {remaining}</span>
    </div>
  )
}

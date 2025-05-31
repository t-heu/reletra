"use client"

import { HTMLAttributes } from "react"
import { useRouter } from "next/navigation"

import { getAnalyticsIfSupported } from "../api/firebase";
import { logEvent } from "firebase/analytics";

interface SwitchProps extends HTMLAttributes<HTMLButtonElement> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id?: string
}

export function Switch({ checked, onCheckedChange, id, ...props }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-[#1e293b]" : "bg-[#eee]"
      }`}
      {...props}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-[#020817] shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  )
}

type Props = {
  mode: "daily" | "free" |  "challenge"
  setMode: (mode: "daily" | "free" | "challenge") => void
}

export default function ToggleMode({ mode, setMode }: Props) {
  const router = useRouter()
  const modeFree = mode === "free"

  function alternarModo(checked: boolean) {
    const newMode = checked ? "free" : "daily"

    // Redirecionar se estiver no modo "challenge"
    if (mode === "challenge") {
      router.push("/")
    }

    setMode(newMode)

    getAnalyticsIfSupported().then((analytics) => {
      if (analytics) {
        logEvent(analytics, "mode_switched", {
          new_mode: newMode,
        })
      }
    })
  }

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <span className={`text-sm font-medium ${!modeFree ? "text-[#eee]" : "text-[#94a3b8]"}`}>
        Diário
      </span>
      <Switch checked={modeFree} onCheckedChange={alternarModo} id="modo-jogo" />
      <span className={`text-sm font-medium ${modeFree ? "text-[#eee]" : "text-[#94a3b8]"}`}>
        Livre
      </span>
    </div>
  )
}

import { HTMLAttributes } from "react"

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
  mode: "daily" | "free"
  setMode: (mode: "daily" | "free") => void
}

export default function ToggleMode({ mode, setMode }: Props) {
  const modoLivre = mode === "free"

  function alternarModo(checked: boolean) {
    setMode(checked ? "free" : "daily")
  }

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className={`text-sm font-medium ${!modoLivre ? "text-[#eee]" : "text-[#94a3b8]"}`}>
        Diário
      </span>
      <Switch checked={modoLivre} onCheckedChange={alternarModo} id="modo-jogo" />
      <span className={`text-sm font-medium ${modoLivre ? "text-[#eee]" : "text-[#94a3b8]"}`}>
        Livre
      </span>
    </div>
  )
}

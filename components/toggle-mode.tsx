"use client"

import { HTMLAttributes } from "react"

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
      aria-label={checked ? "Modo Livre" : "Modo Diário"}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-[#CCCCCC]" : "bg-[#aaa]"
      }`}
      {...props}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-[#222] shadow transition-transform duration-200 hover:bg-[#0f172a] ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  )
}

type ToggleOption = {
  value: string
  label: string
}

type ToggleProps = {
  value: string
  onChange: (newValue: string) => void
  options: [ToggleOption, ToggleOption]
  logKey?: string // ex: 'mode_switched'
}

export default function Toggle({ value, onChange, options, logKey }: ToggleProps) {
  const [optionA, optionB] = options
  const isOptionB = value === optionB.value

  function handleToggle(checked: boolean) {
    const newValue = checked ? optionB.value : optionA.value
    onChange(newValue)

    if (logKey) {
      getAnalyticsIfSupported().then((analytics) => {
        if (analytics) {
          logEvent(analytics, logKey, {
            new_value: newValue,
          })
        }
      })
    }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <span className={`text-sm font-medium ${!isOptionB ? "text-[#eee]" : "text-[#94a3b8]"}`}>
        {optionA.label}
      </span>
      <Switch checked={isOptionB} onCheckedChange={handleToggle} id="generic-toggle" />
      <span className={`text-sm font-medium ${isOptionB ? "text-[#eee]" : "text-[#94a3b8]"}`}>
        {optionB.label}
      </span>
    </div>
  )
}

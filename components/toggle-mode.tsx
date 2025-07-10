'use client';

import React from 'react';

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
};

export function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={checked ? 'Modo Livre' : 'Modo Diário'}
      onClick={() => onCheckedChange(!checked)}
      className={`h-6 w-11 rounded-full px-0.5 flex items-center transition-colors duration-200 ${
        checked ? 'bg-gray-300' : 'bg-gray-400'
      }`}
    >
      <div
        className={`h-5 w-5 rounded-full bg-gray-900 shadow-md transform transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

type ToggleOption<T extends string> = {
  value: T;
  label: string;
};

type ToggleProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: [ToggleOption<T>, ToggleOption<T>];
  logKey?: string;
};

export default function Toggle<T extends string>({
  value,
  onChange,
  options,
}: ToggleProps<T>) {
  const [optionA, optionB] = options;
  const isOptionB = value === optionB.value;

  const handleToggle = (checked: boolean) => {
    const newValue = checked ? optionB.value : optionA.value;
    onChange(newValue);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <span
        className={`text-sm font-medium ${
          !isOptionB ? 'text-gray-100' : 'text-slate-400'
        }`}
      >
        {optionA.label}
      </span>

      <Switch checked={isOptionB} onCheckedChange={handleToggle} />

      <span
        className={`text-sm font-medium ${
          isOptionB ? 'text-gray-100' : 'text-slate-400'
        }`}
      >
        {optionB.label}
      </span>
    </div>
  );
}

"use client"

import { useState, useEffect, useRef } from "react";

export default function ToggleMode({
  setMode,
  mode
}: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [posLeft, setPosLeft] = useState(0);
  const [width, setWidth] = useState(0);

  // Atualiza posição e largura da bolinha quando muda o mode
  useEffect(() => {
    if (!containerRef.current) return;

    const buttons = containerRef.current.querySelectorAll("button");
    const index = mode === "daily" ? 0 : 1;

    if (buttons[index]) {
      setPosLeft(buttons[index].offsetLeft);
      setWidth(buttons[index].offsetWidth);
    }
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className="relative flex gap-2 mb-4 justify-center rounded-lg border-2 border-[#222] p-1 w-fit mx-auto"
      style={{ width: "max-content" }}
    >
      {/* Bolinha móvel */}
      <div
        className="absolute top-0 bottom-0 bg-[#67876e] rounded-lg transition-all duration-300"
        style={{
          left: posLeft,
          width: width,
          margin: "4px 0",
        }}
      ></div>

      <button
        onClick={() => setMode("daily")}
        className={`relative z-10 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
          mode === "daily" ? "text-[#181818]" : "text-[#181818]"
        }`}
      >
        Modo Diário
      </button>

      <button
        onClick={() => setMode("free")}
        className={`relative z-10 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
          mode === "livre" ? "text-[#181818]" : "text-[#181818]"
        }`}
      >
        Modo Livre
      </button>
    </div>
  );
}

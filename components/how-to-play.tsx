import React from "react";

export default function ComoJogarModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#020817] w-[90%] max-w-md rounded-lg shadow-lg p-6 relative text-white">
        <button
          className="absolute top-4 right-4 text-xl font-bold text-white hover:text-[#1e293b]"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-2">Como Jogar</h2>
        <p className="mb-4">Adivinhe a palavra em 6 tentativas.</p>

        <ul className="list-disc pl-5 space-y-1 mb-4 text-sm">
          <li>Cada palpite deve ser uma palavra válida.</li>
          <li>As palavras variam de 3 a 6 ou mais letras!</li>
          <li>
            Há dois modos de jogo:
            <ul className="list-disc pl-5">
              <li><strong>Modo Diário:</strong> uma palavra nova por dia, igual para todos os jogadores.</li>
              <li><strong>Modo Livre:</strong> jogue quantas vezes quiser com palavras aleatórias.</li>
            </ul>
          </li>
          <li>
            A cor das peças mudará para mostrar o quão próximo seu palpite
            estava da palavra.
          </li>
        </ul>

        <div className="mb-4">
          <p className="font-bold text-sm mb-2">Exemplos</p>

          <div className="flex gap-1 mb-1">
            <LetraBox letra="C" status="correta" />
            <LetraBox letra="O" />
            <LetraBox letra="R" />
            <LetraBox letra="D" />
            <LetraBox letra="A" />
          </div>
          <p className="text-sm mb-3">C está na palavra e no lugar correto.</p>

          <div className="flex gap-1 mb-1">
            <LetraBox letra="C" />
            <LetraBox letra="A" />
            <LetraBox letra="R" />
            <LetraBox letra="R" status="presente" />
            <LetraBox letra="O" />
          </div>
          <p className="text-sm mb-3">
            R está na palavra, mas no lugar errado.
          </p>

          <div className="flex gap-1 mb-1">
            <LetraBox letra="L" />
            <LetraBox letra="U" />
            <LetraBox letra="T" />
            <LetraBox letra="A" status="ausente" />
            <LetraBox letra="S" />
          </div>
          <p className="text-sm mb-3">
            A não está na palavra em nenhum lugar.
          </p>
        </div>

        <p className="text-xs text-gray-200 mt-4">
          Para modo Diário um novo desafio é lançado diariamente à meia-noite.
        </p>
      </div>
    </div>
  );
}

function LetraBox({
  letra,
  status,
}: {
  letra: string;
  status?: "correta" | "presente" | "ausente";
}) {
  let bg = "text-white border-2 border-[#1e293b] text-black";
  if (status === "correta") bg = "bg-[#22c55e80] border-2 border-[#22c55eb3] text-white";
  if (status === "presente") bg = "bg-[#eab30880] border-2 border-[#eab30880] text-white";
  if (status === "ausente") bg = "bg-[#6b728080] text-white border-2 border-[#9ca3afb3]";

  return (
    <div
      className={`w-10 h-10 flex items-center justify-center font-bold uppercase rounded ${bg}`}
    >
      {letra}
    </div>
  );
}

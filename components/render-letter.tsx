import { removeAccents } from "../utils/remove-accents"

const renderLetter = (
  tentativa: string,
  index: number,
  letraIndex: number,
  word: string,
  isFinalAttempt: boolean = true
) => {
  const letra = tentativa[letraIndex];
  
  const highlightClasses =
    "font-bold flex items-center justify-center font-righteous transition-none text-white rounded-sm";

  const dynamicStyle = {
    width: `clamp(36px, ${Math.min(16, 80 / word.length)}vw, 72px)`,
    height: `clamp(36px, ${Math.min(16, 80 / word.length)}vw, 72px)`,
    fontSize: `2.3rem`
  };

  if (!letra) {
    return <div key={`${index}-${letraIndex}`} className={highlightClasses} style={dynamicStyle} />;
  }

  let colorClasses = "bg-slate-700/30 text-slate-300 border border-slate-600/30 hover:bg-slate-600/40 hover:border-slate-500/50"; // borda padrão

  if (isFinalAttempt) {
    const tentativaSemAcento = removeAccents(tentativa);
    const wordSemAcento = removeAccents(word);

    const statusArray: ("correct" | "present" | "absent")[] = Array(word.length).fill("absent");
    const letterUsed = Array(word.length).fill(false);

    for (let i = 0; i < word.length; i++) {
      if (tentativaSemAcento[i] === wordSemAcento[i]) {
        statusArray[i] = "correct";
        letterUsed[i] = true;
      }
    }

    for (let i = 0; i < word.length; i++) {
      if (statusArray[i] !== "correct") {
        const letraAtual = tentativaSemAcento[i];
        const indexFound = wordSemAcento.split("").findIndex((l, idx) => {
          return l === letraAtual && !letterUsed[idx];
        });
        if (indexFound !== -1) {
          statusArray[i] = "present";
          letterUsed[indexFound] = true;
        }
      }
    }

    const status = statusArray[letraIndex];
    if (status === "correct") {
      colorClasses = "animate-flip bg-[#008080] border-2 border-[#008080] text-white"
    } else if (status === "present") {
      colorClasses = "animate-flip bg-[#D97706] border-2 border-[#D97706] text-white";
    } else {
      colorClasses = "animate-flip bg-[#4B5563] border-2 border-[#4B5563] text-white";
    }
  }

  return (
    <div
      key={`${index}-${letraIndex}`}
      style={dynamicStyle}
      className={`${highlightClasses} ${colorClasses}`}
    >
      {letra}
    </div>
  );
};

export default renderLetter;

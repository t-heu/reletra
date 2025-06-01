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
    "font-bold flex items-center justify-center font-space transition-none text-white rounded-sm";

  const dynamicStyle = {
    width: `clamp(36px, ${Math.min(16, 80 / word.length)}vw, 72px)`,
    height: `clamp(36px, ${Math.min(16, 80 / word.length)}vw, 72px)`,
    fontSize: `2rem`
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
      colorClasses = "animate-flip bg-[#22c55e80] border-2 border-[#22c55eb3] text-white"
    } else if (status === "present") {
      colorClasses = "animate-flip bg-[#eab30880] border-2 border-[#eab30880] text-white";
    } else {
      colorClasses = "animate-flip bg-[#6b728080] border-2 border-[#9ca3afb3] text-white";
    }
  }

  const animationClass = letra ? "animate-spinOnce" : "";

  return (
    <div
      key={`${index}-${letraIndex}`}
      style={dynamicStyle}
      className={`${highlightClasses} ${colorClasses} ${animationClass}`}
    >
      {letra}
    </div>
  );
};

export default renderLetter;

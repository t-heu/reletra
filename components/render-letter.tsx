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
    "font-roboto flex items-center justify-center font-bold transition-none text-white";

  const dynamicStyle = {
    width: `clamp(45px, ${80 / word.length}vw, 62px)`,
    height: `clamp(45px, ${80 / word.length}vw, 62px)`,
    fontSize: `2rem`
  };

  if (!letra) {
    return <div key={`${index}-${letraIndex}`} className={highlightClasses} style={dynamicStyle} />;
  }

  let colorClasses = "border-2 border-[#1e293b] text-white"; // borda padrão

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
      colorClasses = "bg-[#22c55e80] border-2 border-[#22c55eb3] text-white";
    } else if (status === "present") {
      colorClasses = "bg-[#eab30880] border-2 border-[#eab30880] text-white";
    } else {
      colorClasses = "bg-[#6b728080] border-2 border-[#9ca3afb3] text-white";
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

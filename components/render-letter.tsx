import { removeAccents } from "../utils/remove-accents"

const renderLetter = (
  tentativa: string,
  index: number,
  letraIndex: number,
  word: string
) => {
  const letra = tentativa[letraIndex];

  const highlightClasses =
    "font-code flex items-center justify-center font-bold transition-none text-white";

  const dynamicStyle = {
    width: `clamp(30px, ${100 / word.length}vw, 50px)`,
    height: `clamp(30px, ${100 / word.length}vw, 50px)`,
    fontSize: `clamp(1.5rem, ${100 * 0.6}vw, 2rem)`
  };

  if (!letra) {
    return <div key={`${index}-${letraIndex}`} className={highlightClasses} />;
  }

  // Remove acentos para comparação
  const tentativaSemAcento = removeAccents(tentativa);
  const wordSemAcento = removeAccents(word);

  // Gera um array de status por letra: 'correct', 'present', 'absent'
  const statusArray: ("correct" | "present" | "absent")[] = Array(word.length).fill("absent");
  const letterUsed = Array(word.length).fill(false);

  // 1ª Passagem: letras corretas
  for (let i = 0; i < word.length; i++) {
    if (tentativaSemAcento[i] === wordSemAcento[i]) {
      statusArray[i] = "correct";
      letterUsed[i] = true;
    }
  }

  // 2ª Passagem: letras presentes, mas fora de posição
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

  // Define cor da letra atual
  let colorClasses = "";
  const status = statusArray[letraIndex];
  if (status === "correct") {
    colorClasses = "bg-[#22c55e80] border-2 border-[#22c55eb3] text-white"; // verde
  } else if (status === "present") {
    colorClasses = "bg-[#eab30880] border-2 border-[#eab30880] text-white"; // amarelo
  } else {
    colorClasses = "bg-[#6b728080] border-2 border-[#9ca3afb3] text-white"; // cinza
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

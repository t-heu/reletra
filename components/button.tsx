import React from 'react';

interface PropsButton {
  text: string;
  press?: any;
}

export default function ButtonComp({ text, press }: PropsButton) {
  const baseClasses =
    "relative text-white font-sans uppercase text-sm font-semibold py-1.5 px-2 border-2 rounded-md mx-auto min-w-[140px] text-center cursor-pointer transition-all duration-100 ease-in-out";

  const greenClasses =
    "bg-[#36AA4D] border-[#36AA4D] shadow-[0_9px_0_green,0_9px_25px_rgba(0,0,0,0.7)] hover:shadow-[green_1px_1px_0_1px] active:shadow-[green_1px_1px_0_1px]";
  
  const redClasses =
    "bg-[#e2584d] border-[#e2584d] shadow-[0_9px_0_#ab473f,0_9px_25px_rgba(0,0,0,0.7)] hover:shadow-[#ab473f_1px_1px_0_1px] active:shadow-[#ab473f_1px_1px_0_1px]";

  const isGreen = text !== "SAIR" && text !== "EXIT";
  const classes = `${baseClasses} ${isGreen ? greenClasses : redClasses}`;

  return (
    <button className={classes} onClick={press}>
      {text}
    </button>
  );
}

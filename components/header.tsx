'use client';

import Link from "next/link"
import {
  ChartBar,
  CirclePlus,
  HelpCircle,
  RotateCcw,
  Settings,
  X,
  CircleAlert,
  History
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import ToggleMode from './toggle-mode';

type HeaderProps = {
  howToPlay: (show: boolean) => void;
  mode: 'daily' | 'free' | 'challenge';
  restartGame: (length?: number) => void;
  setShowStatistics: (show: boolean) => void;
  setShowCreateChallenge: (show: boolean) => void;
  setMode: React.Dispatch<React.SetStateAction<'daily' | 'free' | 'challenge'>>;
  difficulty: 'easy' | 'hard';
  handleChangeDifficulty: (difficulty: string) => void;
};

export default function Header({
  howToPlay,
  mode,
  restartGame,
  setShowStatistics,
  setShowCreateChallenge,
  setMode,
  difficulty,
  handleChangeDifficulty,
}: HeaderProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpenDropdown((prev) => !prev);
  const closeDropdown = () => setOpenDropdown(false);

  const handleExitChallenge = () => {
    setMode('daily');
    closeDropdown();
  };

  const handleResetTheme = (length?: number) => {
    restartGame(length);
    closeDropdown();
  };

  const renderModeToggle = () => {
    if (mode === 'challenge') {
      return (
        <button
          onClick={handleExitChallenge}
          className="flex items-center justify-center py-2 px-4 bg-white text-black font-bold rounded-lg"
        >
          <X size={16} />
          <span className="ml-2 text-sm">Sair do Desafio</span>
        </button>
      );
    }

    return (
      <ToggleMode
        value={mode}
        onChange={setMode}
        logKey="mode_switched"
        options={[
          { value: 'daily', label: 'Diário' },
          { value: 'free', label: 'Livre' },
        ]}
      />
    );
  };

  const renderDropdown = () => (
    <div
      ref={dropdownRef}
      className="absolute top-10 right-0 bg-neutral-900 border border-slate-800 rounded-lg p-2 w-52 z-50"
    >
      <div className="my-2">
        <ToggleMode
          value={difficulty}
          onChange={handleChangeDifficulty}
          logKey="difficulty_switched"
          options={[
            { value: 'easy', label: 'Fácil' },
            { value: 'hard', label: 'Difícil' },
          ]}
        />
        <p className="text-xs text-gray-400 px-2 mt-2">no difícil dicas são forçadas</p>
      </div>

      <Link href="/about">
        <button 
          title="Sobre"
          className="w-full text-sm text-left px-4 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 flex items-center gap-2 text-white">
          <CircleAlert className="h-5 w-5" />
          Sobre
        </button>
      </Link>
      <Link href="/history ">
        <button 
          title="Histórico"
          className="w-full text-sm text-left px-4 py-2 hover:bg-[#1e293b] dark:hover:bg-gray-700 flex items-center gap-2 text-white">
          <History className="h-5 w-5" />
          Histórico
        </button>
      </Link>

      {mode === 'free' && (
        <>
          <button
            onClick={() => handleResetTheme()}
            className="flex items-center p-2 text-white"
          >
            <RotateCcw size={16} />
            <span className="ml-2 text-sm">Resetar tema</span>
          </button>

          <p className="text-xs text-gray-400 mt-2 px-2">Nível de dificuldade em letras:</p>

          <div className="mt-1 space-y-1 px-2">
            <button onClick={() => handleResetTheme()} className="text-sm text-white hover:underline">
              Nenhum (Aleatório)
            </button>
            {[3, 4, 5, 6].map((len) => (
              <button
                key={len}
                onClick={() => handleResetTheme(len)}
                className="text-sm text-white hover:underline"
              >
                {len} Letras
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <header className="mt-8 mb-4 px-4 flex flex-col items-center">
      <div className="flex flex-wrap justify-around items-center w-8/12">
        <h1 className="font-righteous text-3xl text-white">RELETRA</h1>

        <div className="my-2">{renderModeToggle()}</div>

        <div className="relative flex gap-2">
          <IconButton icon={HelpCircle} color="#E05C5C" onClick={() => howToPlay(true)} />
          <IconButton icon={CirclePlus} color="#00C896" onClick={() => setShowCreateChallenge(true)} />
          <IconButton icon={ChartBar} color="#4EA1D3" onClick={() => setShowStatistics(true)} />
          <IconButton icon={Settings} color="#6E7D92" onClick={toggleDropdown} />

          {openDropdown && renderDropdown()}
        </div>
      </div>
    </header>
  );
}

type IconButtonProps = {
  icon: React.ElementType;
  color: string;
  onClick: () => void;
};

const IconButton = ({ icon: Icon, color, onClick }: IconButtonProps) => (
  <button
    onClick={onClick}
    className="border-2 border-gray-600 p-2 rounded-md hover:bg-gray-800"
  >
    <Icon size={20} color={color} />
  </button>
);

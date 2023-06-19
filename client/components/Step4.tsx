import React from "react";
import { FiCheck } from "react-icons/fi";

const Step4: React.FC<{ nextStep: () => void; step: number }> = ({ nextStep }) => {
  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <ul>
        <div className="flex items-center gap-2 text-sm">
          <FiCheck className="h-5 w-5" /> Wallet is connected
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FiCheck className="h-5 w-5" /> <p>Vectis account is selected</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FiCheck className="h-5 w-5" />
          <p>Cronkitty pluggin is installed</p>
        </div>
      </ul>
      <p className="text-sm">
        {`Now you are ready to play, just click in start game and make your first movement, it's like a normal tic tac toe game, after your first
        movement we will create a cronkitty task to simulate adversary movements.`}
      </p>
    </div>
  );
};

export default Step4;

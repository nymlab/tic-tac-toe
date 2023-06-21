import { useEffect, useMemo, useState } from "react";
import { useCosmos } from "~/providers/CosmosProvider";

import Button from "~/components/Button";
import Table from "~/components/Table";
import Step0 from "~/components/Step0";
import Step1 from "~/components/Step1";
import Step2 from "~/components/Step2";
import Step3 from "~/components/Step3";
import Step4 from "~/components/Step4";
import Step5 from "~/components/Step5";
import Step6 from "~/components/Step6";

import { motion, AnimatePresence } from "framer-motion";
import ConfettiExplosion from "react-confetti-explosion";
import clsx from "clsx";
import { useToast } from "~/hooks/useToast";

interface GameInfo {
  board: {
    positions: number[][];
  };
  total_moves: number;
  next_player: number;
  status: string | { won: number };
  last_position: number[];
}

const stepComp = [
  {
    title: "How to play?",
    component: Step0,
  },
  {
    title: "Install Vectis Extension",
    component: Step1,
  },
  {
    title: "Create Vectis Account",
    component: Step2,
  },
  {
    title: "Install Cronkitty Plugin",
    component: Step3,
  },
  {
    title: "Time to play",
    component: Step4,
  },
  {
    title: "Cronkitty task",
    component: Step5,
  },
  {
    title: "Tx Table",
    component: Step6,
  },
];

export default function Home() {
  const { cosmwasmClient, keyInfo, contractAddresses } = useCosmos();
  const { toast, isLoading } = useToast();
  const [step, setStep] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  const [gameInfo, setGameInfo] = useState<GameInfo>({
    board: {
      positions: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    },
    total_moves: 0,
    next_player: 1,
    status: "not_started",
    last_position: [3, 3],
  });

  const playerTurn = gameInfo.next_player === 1;
  const winner = (gameInfo.status as { won: number })?.won;

  const { title, component: Component } = useMemo(() => stepComp[step], [step]);

  const startGame = async () => {
    const promise = async () => {
      await cosmwasmClient.execute(keyInfo.address, contractAddresses.tictactoeAddress, { new_game: {} }, "auto");
      localStorage.setItem("createdAt", JSON.stringify(Date.now()));
      setIsGameStarted(true);
    };
    await toast.promise(promise());
  };

  const getGameInfo = async () => {
    const info = await cosmwasmClient.queryContractSmart(contractAddresses.tictactoeAddress, { game_info: { owner: keyInfo.address } });
    setGameInfo(info);
  };

  const addMovement = async (point: { x: number; y: number }) => {
    if (gameInfo.next_player !== 1) return;
    const promise = async () => {
      await cosmwasmClient.execute(keyInfo.address, contractAddresses.tictactoeAddress, { play: { point } }, "auto");
      await getGameInfo();
      if (step === 4) setStep(step + 1);
    };
    await toast.promise(promise());
  };

  const reset = async () => {
    const promise = async () => {
      await cosmwasmClient.execute(keyInfo.address, contractAddresses.tictactoeAddress, { new_game: {} }, "auto");
      await getGameInfo();
    };
    await toast.promise(promise());
  };

  useEffect(() => {
    if (!isGameStarted) return;
    const interval = setInterval(async () => {
      await getGameInfo();
    }, 6000);
    return () => clearInterval(interval);
  }, [isGameStarted]);

  return (
    <main className="mt-8 flex  flex-col items-center justify-start gap-24">
      <div className="flex max-w-[32rem] flex-col gap-2 text-center">
        <h2 className="text-xl font-bold">{"What's Cronkitty Experience?"}</h2>
        <div className="text-xs">
          <p>Cronkitty experience is a website to demo cronkitty plugin.</p>
          <p>
            In this demostration we are going to play a tic tac toe game against yourself, but we are configurate a task in cronkitty to
            simulate adversary movements, these movements will be trigger from your wallet.
          </p>
        </div>
      </div>
      <div className="flex min-h-[50vh] w-full flex-col items-center justify-center p-4 lg:flex-row lg:items-start lg:justify-around">
        <div className="flex h-[22r] flex-col gap-4">
          <h2 className="text-2xl">Tic Tac Toe Game</h2>
          <div className="relative ">
            <Table squares={gameInfo.board.positions} addMovement={addMovement} />
            <div
              className={clsx(
                "absolute top-0 flex h-full w-full flex-col items-center justify-center gap-4 rounded-md transition-all duration-500",
                isLoading || winner || gameInfo.status === "not_started" || !playerTurn ? "scale-1" : "scale-0"
              )}
            >
              {winner && <ConfettiExplosion colors={["#eaecf4", "#292929", "#d0d7e7", "#a7b5d2", "#475d90", "#303d5c", "#2c364e"]} />}
              {gameInfo.status === "not_started" ? (
                <Button variant="primary" disabled={step <= 3 || isLoading} onClick={startGame}>
                  {step <= 3 ? " Follow steps to start" : "Start game!"}
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className={clsx("flex min-h-[32px] items-center justify-between text-sm text-gray-200", { "opacity-0": step <= 4 })}>
            {winner ? (
              <>
                <p>{!playerTurn ? "You won!" : "Cronkitty won!"}</p>
                <Button variant="secondary" onClick={reset} className="text-xs">
                  Replay
                </Button>
              </>
            ) : (
              <>
                {gameInfo.status === "draw" ? (
                  <>
                    <p>{"It's a tie!"}</p>
                    <Button variant="secondary" onClick={reset} className="text-xs">
                      Reset
                    </Button>
                  </>
                ) : (
                  <p>{playerTurn ? "Your turn" : "Cronkitty turn"}</p>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex min-h-[22r] w-full max-w-[29rem] flex-col gap-4">
          <h2 className="text-2xl">{title}</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-[16.25rem] w-full rounded-lg bg-kashmir-blue-500/30 p-4"
            >
              <Component nextStep={() => setStep(step + 1)} step={step} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

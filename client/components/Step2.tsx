import React from "react";
import Button from "./Button";
import Link from "next/link";
import { useCosmos } from "~/providers/CosmosProvider";

const Step2: React.FC<{ nextStep: () => void; step: number }> = ({ nextStep }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { connect, keyInfo } = useCosmos();

  const verify = async () => {
    setIsLoading(true);
    await connect();
    setIsLoading(false);
  };
  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <p className="text-sm">
        Vectis account is a smart contract wallet that allow you to interact with smart contracts in the blockchain, in this case we are going
        to use a smart contract to play the tic tac toe game. You can create a vectis account in{" "}
        <Button as={Link} href="https://testnet-app.vectis.space/" variant="link" target="_blank">
          our dashboard
        </Button>
        , please we encourage to use vectis extension for account creations.
      </p>
      <p className="text-sm">
        After creating your account go to Vectis Extension and clicking on the top right button you will go to account section, there you can
        sync your vectis account with your vectis extension and select your vectis account.
      </p>
      <p className="text-xs text-gray-400">Note: Is necessary to select your vectis account to play the game.</p>
      <div className="flex w-full gap-4">
        <Button className="flex-1" onClick={verify} isLoading={isLoading}>
          Verify
        </Button>
        <Button onClick={nextStep} variant="secondary" className="flex-1" disabled={!keyInfo?.isVectisAccount}>
          {`I'm ready`}
        </Button>
      </div>
    </div>
  );
};

export default Step2;

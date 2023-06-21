import React from "react";
import Button from "./Button";
import Link from "next/link";

const Step1: React.FC<{ nextStep: () => void; step: number }> = ({ nextStep }) => {
  const [isVerified, setIsVerified] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const verify = () => {
    setIsLoading(true);
    setIsVerified(!!window.vectis);
    setIsLoading(false);
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <p className="text-sm">
        Vectis Extension is a chrome extension that allow you to connect your wallet to any website that support vectis, vectis compared with
        other wallet allow to expose your vectis accounts (smart contract wallet) to any website.
      </p>
      <p className="text-sm">
        You can{" "}
        <Button as={Link} href="" variant="link">
          download vectis extension from chrome store
        </Button>
        , just click in the button below.
      </p>
      <p className="text-xs text-gray-400">If you already have Vectis Extension installed in your browser, let us check it.</p>
      <div className="flex w-full gap-4">
        <Button className="flex-1" onClick={verify}>
          Verify
        </Button>
        <Button onClick={nextStep} variant="secondary" className="flex-1" disabled={!isVerified} isLoading={isLoading}>
          {`I'm ready`}
        </Button>
      </div>
    </div>
  );
};

export default Step1;

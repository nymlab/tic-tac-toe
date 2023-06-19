import React, { useEffect, useMemo } from "react";
import Button from "./Button";
import Link from "next/link";
import { useCosmos } from "~/providers/CosmosProvider";

const Step6: React.FC<{ nextStep: () => void; step: number }> = () => {
  const { keyInfo, chain } = useCosmos();
  const [txHistory, setTxHistory] = React.useState<any>([]);

  const txs = useMemo(() => txHistory?.filter((tx) => tx.type.includes("Play")), [txHistory]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(`https://api.vectis.space/tx/${chain.chain_name}/txs?address=${keyInfo.address}`);
      const data = await response.json();
      setTxHistory(data.txs);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <p className="text-sm">
        {`In this table you can see all the transactions that are related to your vectis account, in this case you can see the transactions
        related to the tic tac toe game.`}
      </p>
      <p className="text-sm">
        {`You could see all the transactions are trigger from your account that's one of the benefits of cronkitty plugin, you can trigger
        transactions from your account in the future.`}
      </p>
      <div>
        <div className="grid grid-cols-2 rounded-t-md bg-white text-center font-bold text-kashmir-blue-500">
          <div className="p-2">Msg</div>
          <div className="p-2">Hash</div>
        </div>
        {txs?.map((tx: { type: string; txHash: string }) => {
          return (
            <div className="grid grid-cols-2 text-sm" key={tx.txHash}>
              <div className="max-w-[216px] truncate border border-white p-2">{tx.type}</div>
              <div className="max-w-[216px] truncate border border-white p-2">
                <Button
                  as={Link}
                  href={
                    chain.chain_name.includes("testnet")
                      ? `https://testnet.mintscan.io/${chain.chain_name.replace("testnet", "-testnet")}/txs/${tx.txHash}`
                      : `https://mintscan.io/${chain.chain_name}/txs/${tx.txHash}`
                  }
                  target="_blank"
                  variant="link"
                >
                  {tx.txHash}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step6;

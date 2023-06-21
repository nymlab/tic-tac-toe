import React from "react";
import Button from "./Button";
import { useCosmos } from "~/providers/CosmosProvider";
import { useToast } from "~/hooks/useToast";
import TextArea from "./TextArea";

const Step5: React.FC<{ nextStep: () => void; step: number }> = ({ nextStep, step }) => {
  const { cosmwasmClient, contractAddresses, cronkitty, keyInfo, chain } = useCosmos();
  const { toast } = useToast();

  const createTaskMsg = {
    create_task: {
      task: {
        actions: [
          {
            gas_limit: 1000000,
            msg: {
              wasm: {
                execute: {
                  contract_addr: contractAddresses.tictactoeAddress,
                  funds: [],
                  msg: { play: {} },
                },
              },
            },
          },
        ],
        boundary: null,
        interval: { block: 5 },
        stop_on_fail: false,
      },
      auto_refill: {
        stop_after: {
          total_refilled_amount: "1000000",
        },
      },
    },
  };

  const createTask = async () => {
    if (!cronkitty) return;
    const amount_funds_for_task = "1000000";
    const funds_in_croncat = { amount: amount_funds_for_task, denom: chain.fees.fee_tokens[0].denom };
    const msg = { ...createTaskMsg };
    msg.create_task.task.actions[0].msg.wasm.execute.msg = Buffer.from(JSON.stringify({ play: {} }), "utf8").toString("base64") as any;

    await cosmwasmClient.execute(keyInfo.address, cronkitty, msg, "auto", undefined, [funds_in_croncat]);
    nextStep();
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <p className="text-sm">
        Cronkitty task is a task that will be executed in the future, in this case we are going to create a task that will be executed every 5
        block, this task will simulate adversary movements in the tic tac toe game.
      </p>
      <TextArea value={JSON.stringify(createTaskMsg, null, 2)} />
      <Button onClick={() => toast.promise(createTask())}>Create Task</Button>
    </div>
  );
};

export default Step5;

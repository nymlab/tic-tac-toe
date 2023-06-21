import React, { useEffect, useMemo } from "react";
import Button from "./Button";
import Link from "next/link";
import { useCosmos } from "~/providers/CosmosProvider";
import { useQueries, useQuery } from "@tanstack/react-query";

const Step3: React.FC<{ nextStep: () => void; step: number }> = ({ nextStep }) => {
  const { keyInfo, cosmwasmClient, contractAddresses, cronkitty, setCronkitty } = useCosmos();

  const {
    data: plugins = [],
    refetch,
    isFetching,
  } = useQuery(
    ["user_plugins", cosmwasmClient, keyInfo?.address],
    () => cosmwasmClient?.queryContractSmart(keyInfo?.address, { plugins: {} }),
    {
      select: ({ exec_plugins, pre_tx_plugins, query_plugins }) => [...exec_plugins, ...pre_tx_plugins, ...query_plugins],
      refetchOnMount: false,
      enabled: false,
    }
  );

  const pluginsInfo = useQueries({
    queries: plugins.map((plugin) => ({
      queryKey: ["user_plugin", plugin],
      queryFn: () =>
        cosmwasmClient.queryContractSmart(contractAddresses.pluginRegistryAddress, {
          query_plugin_by_address: { contract_addr: plugin },
        }),
      select: ({ plugin_info }) => ({ plugin_info, plugin }),
    })),
  });

  useEffect(() => {
    pluginsInfo.forEach((plugin) => {
      if (plugin.data?.plugin_info?.name === "cronkitty") {
        setCronkitty(plugin.data.plugin);
      }
    });
  }, [pluginsInfo]);

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <p className="text-sm">
        Cronkitty plugin is a plugin that allow you to automatize tasks in the future using your vectis accounts. In this case we are going to
        use cronkitty to simulate adversary movements in the tic tac toe game.
      </p>
      <p className="text-sm">
        You can install cronkitty plugin{" "}
        <Button as={Link} href={`https://testnet-app.vectis.space/`} variant="link" target="_blank">
          in our dashboard
        </Button>
        , in the plugin section.
      </p>
      <p className="text-xs text-gray-400">Let us verify you have the plugin installed.</p>
      <div className="flex w-full gap-4">
        <Button className="flex-1" onClick={() => refetch()} isLoading={isFetching} disabled={isFetching}>
          Verify
        </Button>
        <Button onClick={nextStep} variant="secondary" className="flex-1" disabled={!cronkitty}>
          {`I'm ready`}
        </Button>
      </div>
    </div>
  );
};

export default Step3;

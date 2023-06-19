import React, { PropsWithChildren, createContext, useCallback, useState } from "react";
import { chainIds, chains } from "~/config/chains";
import { ExecuteResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { getEndpoints } from "~/config/endpoints";
import { GasPrice } from "@cosmjs/stargate";
import { getContractAddresses } from "~/config/contracts";

interface CosmosContextState {
  keyInfo: {
    algo: string;
    name: string;
    pubKey: Uint8Array;
    address: string;
    isNanoLedger: boolean;
    isVectisAccount: boolean;
  };
  cosmwasmClient: SigningCosmWasmClient;
  connect: () => Promise<void>;
  disconnect: () => void;
  isWalletConnecting: boolean;
  createGame: () => Promise<ExecuteResult>;
  setCronkitty: (cronkitty: string) => void;
  cronkitty: string | null;
  chain: (typeof chains)[number];
  contractAddresses: { tictactoeAddress: string; pluginRegistryAddress: string };
}

const CosmosContext = createContext<CosmosContextState | null>(null);

const CosmosProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [keyInfo, setKeyInfo] = useState<{
    algo: string;
    name: string;
    pubKey: Uint8Array;
    address: string;
    isNanoLedger: boolean;
    isVectisAccount: boolean;
  } | null>(null);

  const [cosmwasmClient, setCosmwasmClient] = useState<SigningCosmWasmClient | null>(null);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [contractAddresses, setContractAddresses] = useState<{ tictactoeAddress: string; pluginRegistryAddress: string } | null>(null);
  const [cronkitty, setCronkitty] = useState<string | null>(null);
  const [chain, setChain] = useState(chains[0]);

  const connect = async () => {
    try {
      setIsWalletConnecting(true);
      const [defaultChain] = chainIds;
      await window.vectis.cosmos.enable(chainIds);
      let key = await window.vectis.cosmos.getKey(defaultChain);
      const [bech32Prefix] = key.address.split("1");
      const chain = chains.find((chain) => chain.bech32_prefix === bech32Prefix);
      if (!chain) throw new Error("Chain not found");
      if (chain?.chain_id !== defaultChain) key = await window.vectis.cosmos.getKey(chain.chain_id);
      const addresses = getContractAddresses(chain.chain_name);
      setKeyInfo(key);
      setChain(chain);
      setContractAddresses(addresses);
      const signer = window.vectis.cosmos.getOfflineSignerDirect(chain.chain_id);
      const endpoints = getEndpoints(chain.chain_name);
      const [feeToken] = chain.fees.fee_tokens;
      const client = await SigningCosmWasmClient.connectWithSigner(endpoints.rpcUrl, signer as OfflineSigner, {
        gasPrice: GasPrice.fromString(`${feeToken.average_gas_price}${feeToken.denom}`),
      });
      setCosmwasmClient(client);
    } finally {
      setIsWalletConnecting(false);
    }
  };

  const disconnect = () => {
    setKeyInfo(null);
    setCosmwasmClient(null);
  };

  return (
    <CosmosContext.Provider
      value={
        {
          keyInfo,
          cosmwasmClient,
          connect,
          isWalletConnecting,
          disconnect,
          contractAddresses,
          cronkitty,
          setCronkitty,
          chain,
        } as CosmosContextState
      }
    >
      {children}
    </CosmosContext.Provider>
  );
};

export default CosmosProvider;

export const useCosmos = () => {
  const context = React.useContext(CosmosContext);
  if (!context) throw new Error("useCosmos must be used within a CosmosProvider");
  return context;
};

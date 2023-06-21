declare global {
  interface Window {
    vectis: {
      version: string;
      cosmos: {
        enable: (chainIds: string | string[]) => Promise<void>;
        getAccounts: () => Promise<{ address: string; pubkey: Uint8Array | null; algo: string | null }[]>;
        signAmino: (signerAddress: string, doc: StdSignDoc) => Promise<unknown>;
        signDirect: (signerAddress: string, doc: SignDoc) => Promise<unknown>;
        getOfflineSignerAmino: (chainId: string) => {
          getAccounts: () => Promise<{ address: string; pubkey: Uint8Array | null; algo: string | null }[]>;
          signAmino: (signerAddress: string, doc: StdSignDoc) => Promise<unknown>;
        };
        getOfflineSignerDirect: (chainId: string) => {
          getAccounts: () => Promise<{ address: string; pubkey: Uint8Array | null; algo: string | null }[]>;
          signDirect: (signerAddress: string, doc: SignDoc) => Promise<unknown>;
        };
        getKey: (
          chainId: string
        ) => Promise<{ algo: string; name: string; pubKey: Uint8Array; address: string; isNanoLedger: boolean; isVectisAccount: boolean }>;
      };
    };
  }
}

export {};

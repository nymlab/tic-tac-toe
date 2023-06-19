// TICTACTOE
const junotestnet_tictactoe = process.env.NEXT_PUBLIC_JUNO_TICTACTOE_ADDRESS;
const injectivetestnet_tictactoe = process.env.NEXT_PUBLIC_INJECTIVE_TICTACTOE_ADDRESS;
const neutrontestnet_tictactoe = process.env.NEXT_PUBLIC_NEUTRON_TICTACTOE_ADDRESS;
const archwaytestnet_tictactoe = process.env.NEXT_PUBLIC_ARCHWAY_TICTACTOE_ADDRESS;
const stargazetestnet_tictactoe = process.env.NEXT_PUBLIC_STARGAZE_TICTACTOE_ADDRESS;

// PLUGIN REGISTRY
const junotestnet_plugin_registry = process.env.NEXT_PUBLIC_JUNO_PLUGIN_REGISTRY_ADDRESS;
const injectivetestnet_plugin_registry = process.env.NEXT_PUBLIC_INJECTIVE_PLUGIN_REGISTRY_ADDRESS;
const neutrontestnet_plugin_registry = process.env.NEXT_PUBLIC_NEUTRON_PLUGIN_REGISTRY_ADDRESS;
const archwaytestnet_plugin_registry = process.env.NEXT_PUBLIC_ARCHWAY_PLUGIN_REGISTRY_ADDRESS;
const stargazetestnet_plugin_registry = process.env.NEXT_PUBLIC_STARGAZE_PLUGIN_REGISTRY_ADDRESS;

const addresses = {
  junotestnet: {
    tictactoeAddress: junotestnet_tictactoe,
    pluginRegistryAddress: junotestnet_plugin_registry,
  },
  injectivetestnet: {
    tictactoeAddress: injectivetestnet_tictactoe,
    pluginRegistryAddress: injectivetestnet_plugin_registry,
  },
  neutrontestnet: {
    tictactoeAddress: neutrontestnet_tictactoe,
    pluginRegistryAddress: neutrontestnet_plugin_registry,
  },
  archwaytestnet: {
    tictactoeAddress: archwaytestnet_tictactoe,
    pluginRegistryAddress: archwaytestnet_plugin_registry,
  },
  stargazetestnet: {
    tictactoeAddress: stargazetestnet_tictactoe,
    pluginRegistryAddress: stargazetestnet_plugin_registry,
  },
};

export const getContractAddresses = (chainName: string) => {
  return addresses[chainName];
};

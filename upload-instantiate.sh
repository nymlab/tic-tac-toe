#!/bin/sh

# set -e
source .env

echo "Uploading to: "
echo $NETWORK

if [[ "$NETWORK" == "juno_testnet" ]]; then 
  DAEMON=junod 
elif [[ "$NETWORK" == "neutron_testnet" ]]; then
  DAEMON=neutrond
elif [[ "$NETWORK" == "stargaze_testnet" ]]; then
  DAEMON=starsd
fi 

CHAIN_FLAGS="--chain-id $CHAIN_ID --node $RPC"


 #echo "Add key to keyring - $DAEMON"
 #if ! $DAEMON keys show deployer --keyring-backend=test; then
 #  (
 #    echo "$UPLOAD_USER_MNEMONICS"
 #    echo "$UPLOAD_USER_MNEMONICS"
 #  ) | $DAEMON keys add deployer --recover --keyring-backend=test 
 #fi


 PATH_TO_CONTRACT_WASM=artifacts/tic_tac_toe.wasm
 REST=$($DAEMON tx wasm store $PATH_TO_CONTRACT_WASM --gas auto --gas-prices 0.025$FEE_TOKEN --gas-adjustment 1.3 --from deployer --keyring-backend test  $CHAIN_FLAGS -o json -y)
 echo $REST
 
 sleep 15
 
 RESQ=$($DAEMON q tx --type=hash $(echo "$REST"| jq -r '.txhash') $CHAIN_FLAGS -o json)
 CODE_ID=$(echo "$RESQ" | jq -r '.logs[0].events[]| select(.type=="store_code").attributes[]| select(.key=="code_id").value')
 CODE_HASH=$(echo "$RESQ" | jq -r '.logs[0].events[]| select(.type=="store_code").attributes[]| select(.key=="code_checksum").value')
 
 echo "Code Id:  $CODE_ID"
 
 echo "\n Instantiate Contract \n"
 
 INIT_MSG='{}'
 $DAEMON tx wasm instantiate $CODE_ID "$INIT_MSG" --gas auto --gas-prices 0.025$FEE_TOKEN --gas-adjustment 1.3 --from deployer --label 'Vectis TicTacToe' --keyring-backend test $CHAIN_FLAGS -o json -y --no-admin
 
 sleep 15

CONTRACT_ADDRESS=$($DAEMON query wasm list-contract-by-code $CODE_ID $CHAIN_FLAGS --output json | jq -r '.contracts[-1]')
echo "CONTRACT_ADDRESS : $CONTRACT_ADDRESS"





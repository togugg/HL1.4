#!/bin/bash
ACTION=$1
VERSION=$2
GLOBAL_ENV_LOCATION=$PWD/scripts/.env
source $GLOBAL_ENV_LOCATION

set -ev

# ====================================================
# JOIN peer0.org1.example.com TO THE CHANNEL mychannel.
# ====================================================
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt" -e "CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" "$CLI_NAME" peer chaincode $ACTION -n warehousecontract -l node -c '{"Args":["org.warehousenet.warehouse:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member','Org2MSP.member')" --collections-config /opt/gopath/src/github.com/chaincode/collections_config.json -v $VERSION --tls --cafile $ORDERER_CA

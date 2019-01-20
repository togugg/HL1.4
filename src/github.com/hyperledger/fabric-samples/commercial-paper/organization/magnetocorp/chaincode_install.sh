docker exec cliMagnetoCorp peer chaincode install -n materialcontract -p /opt/gopath/src/github.com/contract -l node -v 0

docker exec cliMagnetoCorp peer chaincode instantiate -n materialcontract -l node -c '{"Args":["org.materialnet.material:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')" -v 1


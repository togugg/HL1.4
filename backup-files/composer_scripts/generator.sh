#!/bin/bash          
ORG1_CERT=$(awk 'NF {sub(/\r/, ""); printf "%s\\\\n",$0;}' ../crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt )
ORG2_CERT=$(awk 'NF {sub(/\r/, ""); printf "%s\\\\n",$0;}' ../crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt )
ORDERER0_CERT=$(awk 'NF {sub(/\r/, ""); printf "%s\\\\n",$0;}' ../crypto-config/ordererOrganizations/example.com/orderers/orderer0.example.com/tls/ca.crt )
ORDERER1_CERT=$(awk 'NF {sub(/\r/, ""); printf "%s\\\\n",$0;}' ../crypto-config/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/ca.crt )

rm -r ~/.composer

cp -r ./templates/* ./

sed -i "s~INSERT_ORG1_CA_CERT~$ORG1_CERT~g" ./byfn-network-org1.json
sed -i "s~INSERT_ORG2_CA_CERT~$ORG2_CERT~g" ./byfn-network-org1.json
sed -i "s~INSERT_ORDERER0_CA_CERT~$ORDERER0_CERT~g" ./byfn-network-org1.json
sed -i "s~INSERT_ORDERER1_CA_CERT~$ORDERER1_CERT~g" ./byfn-network-org1.json

sed -i "s~INSERT_ORG1_CA_CERT~$ORG1_CERT~g" ./byfn-network-org2.json
sed -i "s~INSERT_ORG2_CA_CERT~$ORG2_CERT~g" ./byfn-network-org2.json
sed -i "s~INSERT_ORDERER0_CA_CERT~$ORDERER0_CERT~g" ./byfn-network-org2.json
sed -i "s~INSERT_ORDERER1_CA_CERT~$ORDERER1_CERT~g" ./byfn-network-org2.json

ORG1=../crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
cp -p $ORG1/signcerts/A*.pem ./creds/Admin@org1.example.com-cert.pem
cp -p $ORG1/keystore/*_sk ./creds/org1_sk

ORG2=../crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
cp -p $ORG2/signcerts/A*.pem ./creds/Admin@org2.example.com-cert.pem
cp -p $ORG2/keystore/*_sk ./creds/org2_sk

composer card create -p ./byfn-network-org1.json -u PeerAdmin -c ./creds/Admin@org1.example.com-cert.pem -k ./creds/org1_sk -r PeerAdmin -r ChannelAdmin -f PeerAdmin@byfn-network-org1.card

composer card create -p ./byfn-network-org2.json -u PeerAdmin -c ./creds/Admin@org2.example.com-cert.pem -k ./creds/org2_sk -r PeerAdmin -r ChannelAdmin -f PeerAdmin@byfn-network-org2.card

composer card import -f PeerAdmin@byfn-network-org1.card --card PeerAdmin@byfn-network-org1
composer card import -f PeerAdmin@byfn-network-org2.card --card PeerAdmin@byfn-network-org2

composer network install --card PeerAdmin@byfn-network-org1 --archiveFile tutorial-network@0.0.1.bna
composer network install --card PeerAdmin@byfn-network-org2 --archiveFile tutorial-network@0.0.1.bna

composer identity request -c PeerAdmin@byfn-network-org1 -u admin -s adminpw -d alice
composer identity request -c PeerAdmin@byfn-network-org2 -u admin -s adminpw -d bob

composer network start -c PeerAdmin@byfn-network-org1 -n tutorial-network -V 0.0.1 -o endorsementPolicyFile=./endorsement-policy.json -A alice -C alice/admin-pub.pem -A bob -C bob/admin-pub.pem


composer card create -p ./byfn-network-org1.json -u alice -n tutorial-network -c alice/admin-pub.pem -k alice/admin-priv.pem
composer card import -f alice@tutorial-network.card
composer network ping -c alice@tutorial-network

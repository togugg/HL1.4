#!/bin/bash

ACTION=$1
VERSION=$2
$PWD/scripts/move_chaincode.sh
$PWD/scripts/chaincode/install_chaincode.sh $VERSION
$PWD/scripts/chaincode/instantiate_upgrade_chaincode.sh $ACTION $VERSION

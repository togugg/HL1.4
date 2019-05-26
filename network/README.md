## Hyperledger Network - Docker Swarm

- Create the swarm and network
```
./setup_swarm.sh
./create_network.sh
```

- Move crypto material
```
./move_crypto
```
- Make sure the hostname is ubuntu or adjust the Docker composer files accordingly
- Ctart network
```
./start_all.sh
```

- Create channel
```
./scripts/create_channel.sh
```

- Install chaincode
```
./scripts/install_chaincode.sh instantiate 0
```


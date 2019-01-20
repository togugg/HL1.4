docker service rm $(docker service ls -q)


docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

docker rmi $(docker images | grep 'skcript')
docker rmi $(docker images | grep 'dev-peer')




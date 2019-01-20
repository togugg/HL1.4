docker stop mongo
docker rm mongo

docker run -d --name mongo --network skcript -p 27017:27017 mongo

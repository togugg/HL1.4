docker stop rest
docker rm rest

COMPOSER_CARD=alice@tutorial-network
COMPOSER_NAMESPACES=always
COMPOSER_AUTHENTICATION=false
COMPOSER_MULTIUSER=false
COMPOSER_PROVIDERS='{
  "jwt": {
    "provider": "jwt",
    "module": "/home/composer/node_modules/custom-jwt.js",
    "secretOrKey": "gSi4WmttWuvy2ewoTGooigPwSDoxwZOy",
    "authScheme": "saml",
    "successRedirect": "/",
    "failureRedirect":"/"
    }
}'
COMPOSER_DATASOURCES='{
  "db": {
    "name": "db",
    "connector": "mongodb",
    "host": "mongo"
  }
}'

docker run \
    -d \
    -e COMPOSER_CARD=${COMPOSER_CARD} \
    -e COMPOSER_NAMESPACES=${COMPOSER_NAMESPACES} \
    -e COMPOSER_AUTHENTICATION=${COMPOSER_AUTHENTICATION} \
    -e COMPOSER_MULTIUSER=${COMPOSER_MULTIUSER} \
    -e COMPOSER_DATASOURCES="${COMPOSER_DATASOURCES}" \
    --name rest \
    --network skcript \
    -p 3000:3000 \
    -v ~/.composer:/home/composer/.composer \
    localhost/composer-rest-server

docker logs rest -f

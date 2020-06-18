#!/usr/bin/env bash

VERSION=$(node -p -e "require('./lerna.json').version")

docker build -t docker.pkg.github.com/whitewater-guide/logbook/server:latest .
docker tag docker.pkg.github.com/whitewater-guide/logbook/server:latest docker.pkg.github.com/whitewater-guide/logbook/server:${VERSION}
docker login docker.pkg.github.com -u ${GITHUB_USER} -p ${GITHUB_TOKEN}
docker push docker.pkg.github.com/whitewater-guide/logbook/server:latest
docker push docker.pkg.github.com/whitewater-guide/logbook/server:${VERSION}

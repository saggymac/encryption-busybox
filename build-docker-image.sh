#!/bin/bash
npm install
pkg . --output docker/encryption-busybox-linux
cd docker
docker build -t local-encryption-busybox .
docker run -d -p 3000:3000 --rm --name local-ebb local-encryption-busybox
docker ps

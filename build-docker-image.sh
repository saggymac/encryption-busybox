#!/bin/bash
docker build -t local-encryption-busybox .
docker run -d -p 3000:3000 --rm --name local-ebb local-encryption-busybox
docker ps

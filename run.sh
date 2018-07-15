#!/bin/bash
echo "Running Encryption Busybox Version $1"
docker run -d -p 3000:3000 --rm --name local-ebb junkmail4mjd/encryption-busybox:$1

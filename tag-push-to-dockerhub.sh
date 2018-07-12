#!/bin/bash
echo "Tagging and pushing Version $1 to Docker Hub"
docker tag local-encryption-busybox junkmail4mjd/encryption-busybox:$1
docker push junkmail4mjd/encryption-busybox:$1

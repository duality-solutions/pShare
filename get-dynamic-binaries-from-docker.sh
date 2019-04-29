#!/usr/bin/env bash
docker exec dynamicd cat dist/dynamicd > ./static/dynamicd/linux/dynamicd
docker exec dynamicd cat dist/dynamic-cli > ./static/dynamicd/linux/dynamic-cli
chmod +x ./static/dynamicd/linux/dynamicd
chmod +x ./static/dynamicd/linux/dynamic-cli

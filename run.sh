#!/bin/bash
#
# USAGE: ./run.sh [imagename] [port] [docker options]

tag_name=${1:-$(whoami)/ehdatagen}
port=${2:-3000}
dockerargs=${2:-"--rm"}

docker run -p $port:3000 $dockerargs $tag_name

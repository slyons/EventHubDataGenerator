#!/bin/bash
#
# USAGE: ./build.sh [myuser/imagename] (defaults to $(whoami)/ehdatagen)
tag_name=${1:-$(whoami)/ehdatagen}

docker build -t $tag_name .
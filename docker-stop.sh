#!/bin/bash

# shellcheck disable=SC2046
docker stop $(docker ps -aq)
#!/bin/bash
set -e

GOOS=linux GOARCH=amd64 go build -o ./bin/altin --ldflags="-s -w" ./cmd/linux
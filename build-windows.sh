#!/bin/bash
set -e

GOOS=windows GOARCH=amd64 go build -o ./bin/altin.exe --ldflags="-s -w" ./cmd/os
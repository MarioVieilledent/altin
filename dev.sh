#!/usr/bin/env bash
set -euo pipefail

# Build Go WebAssembly target
GOOS=linux GOARCH=amd64 \
go run ./cmd/os/main.go
#!/usr/bin/env bash
set -euo pipefail

# Build Go WebAssembly target
GOOS=js GOARCH=wasm \
go build -o ./static/altin.wasm ./core

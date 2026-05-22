#!/bin/bash
set -e

# Build Go WebAssembly target
GOOS=js GOARCH=wasm go build -o ./static/altin.wasm ./cmd/wasm
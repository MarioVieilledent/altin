#!/usr/bin/env bash
set -euo pipefail

# Build with TinyGo
tinygo build -o ./static/altin.wasm -target wasm -no-debug -opt=z ./core
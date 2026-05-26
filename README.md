# Altin

Minimal multiplayer RTS written in Go

## Install

- Install Go
- Install node.js

### Install node_modules

```
cd client && npm i
```

## Build

### Server

- `./build-linux.sh` Compiles for linux/arm64
- `./build-wasm.sh` Uses gc, Go's compiler, ~3.1 MB
- `./build-wasm-tiny.sh` Uses TinyGo compiler, ~ 393 kB

### Client

- `cd client && npm run build`

## Serve locally

### Server

```
./dev.sh
```

Or alternatively,

```
go run ./cmd/os/main.go
```

### Client

```
cd client && npm run dev
```

## File structure

```
/cmd (build targets)
    /os
        main.go
        /static (served frontend dist files)
            index.html
            /assets
                ...
    /wasm
        main.go

/core (core logic)
    game.go
    utils.go
    ...

/client (frontend in React + vite)
    /src
        main.tsx
        App.tsx
    /public
        ...
    index.html
```

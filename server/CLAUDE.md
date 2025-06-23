# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Preferences

**IMPORTANT: Always respond in Korean (한국어) when communicating with users in this repository.**

## Project Overview

This is a Hono-based TypeScript server that's part of the "wonderlogy" monorepo. The server uses Bun as the runtime and package manager, with TypeScript compilation for production builds.

## Development Commands

**Install dependencies:**
```bash
bun install
```

**Development (from server directory):**
```bash
bun run dev
```
- Runs with hot-reload using `bun --watch`
- Runs TypeScript compiler in watch mode
- Server runs on http://localhost:3000

**Development (from monorepo root):**
```bash
bun run dev:server
```

**Build:**
```bash
bun run build
```
- Compiles TypeScript to `dist/` directory
- Generates declaration files

**Full monorepo development:**
```bash
bun run dev
```
- Runs shared, server, and client packages concurrently

## Architecture

### Core Structure
- **Entry point:** `src/index.ts` - Main Hono app with CORS middleware
- **Client types:** `src/client.ts` - Exports typed Hono client for type-safe API consumption
- **Build output:** `dist/` directory with compiled JS and declaration files

### Dependencies
- **Runtime:** Bun
- **Framework:** Hono (lightweight web framework)
- **Shared types:** References `shared` workspace package for common types like `ApiResponse`

### TypeScript Configuration
- Extends parent `tsconfig.json` from monorepo root
- Target: ESNext with bundler module resolution
- JSX support configured for Hono's JSX implementation
- Outputs both compiled JS and declaration files

## Monorepo Context

This server is part of a larger monorepo with:
- `shared/` - Common types and utilities
- `client/` - Frontend application
- Workspace dependencies managed at root level
- Build order: shared → server → client
# ✈️ Wonderlogy

[![한국어](https://img.shields.io/badge/한국어-README--kr.md-blue)](./README-kr.md)

> An unplanned travel companion web application that helps travelers create spontaneous and enjoyable journeys.

## 🌟 Overview

Wonderlogy is a web application designed for people who find it difficult to plan detailed travel itineraries. Users can pre-register places of interest and then spontaneously choose destinations while traveling, creating flexible travel routes and memorable experiences.

## ✨ Key Features

- **Pre-travel Planning**: Register and manage places of interest before your trip
- **Spontaneous Route Creation**: Create instant travel routes on-the-go
- **Travel Memory Recording**: Save and document your travel experiences
- **Flexible Travel Experience**: Enjoy unplanned but exciting travel adventures

## 🏢 Project Structure

This is a monorepo containing three main packages:

```
wonderlogy/
├── client/          # React frontend application
├── server/          # Hono backend API server
├── shared/          # Shared types and utilities
└── package.json     # Root workspace configuration
```

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives with custom components
- **Styling**: Tailwind CSS
- **Internationalization**: i18next with React integration
- **State Management**: React hooks and context
- **Icons**: Lucide React

### Backend (Server)
- **Runtime**: Bun
- **Framework**: Hono (lightweight web framework)
- **Language**: TypeScript
- **Database**: PostgreSQL with native `pg` driver
- **Authentication**: JWT with bcrypt password hashing
- **Testing**: Jest with coverage support

### Shared
- **Types**: Common TypeScript interfaces and types
- **Utilities**: Shared utility functions across client and server

### Development Tools
- **Package Manager**: Bun (with npm workspaces)
- **Linting**: ESLint with TypeScript support
- **Git Hooks**: Husky with lint-staged
- **Process Management**: Concurrently for running multiple services

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (latest version)
- [Node.js](https://nodejs.org) (for compatibility)
- [PostgreSQL](https://postgresql.org) (for database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wonderlogy
```

2. Install dependencies:
```bash
bun install
```

3. Set up the database:
```bash
cd server
bun run db:create
```

### Development

#### Run all services (recommended):
```bash
bun run dev
```
This will start:
- Shared package in watch mode
- Server on `http://localhost:3000`
- Client on `http://localhost:5173`

#### Run services individually:

**Frontend only:**
```bash
bun run dev:client
```

**Backend only:**
```bash
bun run dev:server
```

**Shared package:**
```bash
bun run dev:shared
```

### Building

#### Build all packages:
```bash
bun run build
```

#### Build individually:
```bash
bun run build:client   # Build frontend
bun run build:server   # Build backend
bun run build:shared   # Build shared package
```

## 🧪 Testing

### Server Tests
```bash
cd server
bun run test           # Run tests once
bun run test:watch     # Run tests in watch mode
bun run test:coverage  # Run tests with coverage
bun run test:ci        # Run tests for CI/CD
```

### Type Checking
```bash
cd server
bun run typecheck      # Check TypeScript types
```

## 📊 Project Details

### Client Architecture
- **React 19**: Latest React with modern hooks and features
- **TypeScript**: Full type safety across the application
- **Component Library**: Custom UI components built on Radix UI
- **Routing**: Modern React routing patterns
- **Error Boundaries**: Comprehensive error handling
- **Internationalization**: Support for multiple languages

### Server Architecture
- **Hono Framework**: Fast, lightweight web framework
- **PostgreSQL Integration**: Direct database queries with type safety
- **JWT Authentication**: Secure user authentication system
- **RESTful API**: Clean API design with proper HTTP methods
- **Database Migrations**: Version-controlled database schema changes

### Database Schema
- User authentication and management
- Travel destination storage
- Route planning and history
- Travel memory and photo storage

## 🌍 Internationalization

The application supports multiple languages:
- English (default)
- Korean (한국어)

Language files are located in `client/src/i18n/`.

## 📦 Package Scripts

### Root Level
- `bun run dev` - Start all services in development mode
- `bun run build` - Build all packages
- `bun run dev:client` - Start client only
- `bun run dev:server` - Start server only
- `bun run dev:shared` - Start shared package in watch mode

### Client
- `bun run dev` - Start Vite development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build

### Server
- `bun run dev` - Start server with hot reload
- `bun run build` - Compile TypeScript
- `bun run test` - Run test suite
- `bun run db:create` - Create database tables
- `bun run db:migrate-v2` - Run database migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

zerodice0

## 🔗 Links

- [BHVR](https://github.com/stevedylandev/bhvr)
- [한국어 문서](./README-kr.md)

---

**Service Concept**: *"Unplanned but fun travel experiences!"*
# PaperJet Project Documentation

## Project Overview
PaperJet is a privacy-first document processing platform that creates custom AI workflows to process various document types and extract any desired information.

## Repository Structure
This is a monorepo managed with bun workspaces and built with TurboRepo.

### Apps
- `api` - Hono.js API server
- `dashboard` - React dashboard application
- `docs` - Documentation site
- `e2e` - End-to-end tests
- `ml` - Machine learning components
- `website` - Public website

### Packages
- `db` - Database schema and utilities (Drizzle ORM)
- `email` - Email templating and sending
- `engine` - Core document processing engine
- `queue` - Job queue management
- `shared` - Shared utilities and types
- `tsconfig` - Shared TypeScript configuration
- `ui` - Shared UI components library

## Technology Stack
- **Package Manager**: bun
- **Build System**: TurboRepo
- **Runtime**: Bun
- **API**: Hono.js
- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI primitives
- **Authentication**: Better Auth
- **Validation**: Zod
- **Charts**: Recharts
- **Drag & Drop**: Dnd Kit

## Development Workflow

### Setup
1. Install dependencies: `bun install`
2. Set up environment variables (see `.env.example` files)
3. Run database migrations: `bun db:migrate`

### Common Commands
- `bun dev` - Start all services in development mode
- `bun build` - Build all packages and apps
- `bun lint` - Lint all code with Biome
- `bun db:*` - Database commands (generate, migrate, push, studio, seed)

### Testing
- Unit tests: Integrated with build process
- E2E tests: `bun test:e2e`

## Code Quality & Conventions

### Formatting & Linting
- **Formatter**: Biome (indentation: 2 spaces, line width: 120)
- **Linter**: Biome with recommended rules
- **Type Checking**: TypeScript

### Commit Conventions
- **Commit Message Format**: Conventional Commits
  - Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert
  - Subject case: lower case only

### Release Process
- **Versioning**: Semantic versioning
- **Changelog**: Auto-generated CHANGELOG.md

## Database
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Migrations**: Drizzle Kit

## Styling
- **Framework**: Tailwind CSS v4
- **Components**: Custom UI library in `packages/ui`
- **Icons**: Lucide React

## License
This project is licensed under the AGPL-3.0 for non-commercial use. Commercial use requires a separate license.

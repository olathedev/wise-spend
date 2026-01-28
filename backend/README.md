# Backend - Clean Architecture

Express backend with TypeScript following Clean Architecture principles.

## Project Structure

```
src/
├── domain/           # Business logic layer
│   ├── entities/     # Domain entities
│   └── repositories/ # Repository interfaces
├── application/      # Application layer
│   └── interfaces/   # Use case interfaces
├── infrastructure/   # Infrastructure layer
│   └── repositories/ # Repository implementations
├── presentation/     # Presentation layer
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Express middleware
│   └── routes/       # Route definitions
└── shared/           # Shared utilities
    ├── errors/       # Custom error classes
    └── types/        # Shared types
```

## Installation

```bash
npm install
```

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type checking
npm run type-check
```

## Environment Variables

Copy `.env.example` to `.env` and configure your environment variables.

## Clean Architecture Layers

- **Domain**: Core business logic, entities, and repository interfaces
- **Application**: Use cases and application-specific interfaces
- **Infrastructure**: External concerns (database, APIs, file system)
- **Presentation**: HTTP layer (controllers, routes, middleware)

## Adding New Features

1. Define domain entity in `domain/entities/`
2. Create repository interface in `domain/repositories/`
3. Implement repository in `infrastructure/repositories/`
4. Create use case in `application/use-cases/`
5. Create controller in `presentation/controllers/`
6. Add routes in `presentation/routes/`

# Rent Ride Frontend

This directory contains the frontend React application for the Rent Ride car rental management system.

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Application Structure](#application-structure)
- [Key Components](#key-components)
- [State Management](#state-management)
- [Map Integration](#map-integration)
- [Dashboard Components](#dashboard-components)
- [Services](#services)
- [Testing](#testing)
- [Development Guidelines](#development-guidelines)
- [Docker Implementation](#docker-implementation)

## Architecture

The frontend application follows a feature-based architecture with clean separation of concerns:

```
src/
├── features/           # Feature modules organized by domain functionality
│   ├── dashboard/      # Dashboard feature with car rental management
│   │   ├── components/ # React components for the dashboard
│   │   └── __tests__/  # Unit and integration tests
├── redux/              # Redux state management
│   ├── features/       # Redux slice files
│   └── store.ts        # Redux store configuration
├── shared/             # Shared utilities and components
│   ├── lib/            # Shared business logic
│   ├── ui/             # Reusable UI components
│   └── services/       # Application services (alerts, API, etc.)
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## Tech Stack

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management
- **Ant Design**: UI component library
- **TailwindCSS**: Utility-first CSS framework
- **Jest & React Testing Library**: Testing framework
- **ArcGIS Maps SDK for JavaScript**: Map integration
- **Vite**: Build tool
- **Docker**: Containerization

## Application Structure

The application follows a modular approach with the following organization:

- **Features**: Self-contained modules representing business domains
- **Components**: Reusable UI building blocks
- **Services**: Shared functionality like alerts
- **Redux**: State management with slices for different domains
- **Types**: TypeScript interfaces and type definitions

## Key Components

### Dashboard Page

The dashboard page (`src/features/dashboard/page.tsx`) serves as the main interface of the application, integrating:

1. The map container for location visualization
2. The control panel for car rental operations

### Map Integration

The application integrates with ArcGIS Maps SDK for JavaScript to provide interactive mapping capabilities:

- **Map Container**: Handles map initialization and rendering
- **Car Markers**: Visual representation of cars on the map
- **Click Handlers**: Support for selecting return locations
- **Map Mode**: Handles the map mode for the application

## Dashboard Components

The Dashboard consists of two main components:

### 1. Map Container Component

The Map Container (`src/features/dashboard/components/map.container.component.tsx`) handles:

- Initializing the ArcGIS map view
- Rendering car markers on the map
- Handling map click events for selecting return locations
- Zooming to specific locations when cars are selected

Key features:

- Interactive markers showing car availability status
- Click handlers for selecting return locations
- Two-way communication with the Control Panel via Redux state

### 2. Control Panel Component

The Control Panel (`src/features/dashboard/components/control.panel.component.tsx`) manages:

- Displaying the list of available and rented cars
- Handling car selection via table interactions
- Processing car rental and return operations
- Collecting user information for rentals
- Providing feedback through alerts

Key features:

- Tabular view of car inventory with filtering options
- Form for entering renter information
- Controls for renting and returning cars
- Integration with alert service for notifications

## State Management

The application uses Redux Toolkit for state management with the following key slices:

### Cars Slice

The cars slice (`src/redux/features/cars/carsSlice.ts`) manages:

- List of all cars
- Currently selected car IDs for rental
- Return location coordinates
- Car availability status

Key actions:

- `rentCar`: Marks a car as rented and associates it with a user
- `returnCar`: Marks a car as available and updates its location
- `selectCarForRent`: Updates the selection state
- `selectReturnLocation`: Sets the return location coordinates

## Map Integration

The application leverages ArcGIS Maps SDK to provide:

- Interactive map display
- Car location markers with different icons for available/rented status
- Click handling for location selection
- Zooming and panning functionality

Map interactions trigger Redux actions to update application state, creating a two-way binding between the map and the UI components.

## Services

### Alert Service

The alert service (`src/shared/lib/services/alert.service.ts`) provides a unified interface for displaying notifications:

- Success messages for successful operations
- Error messages for failed operations
- Info messages for general information
- Warning messages for potential issues

The service leverages Ant Design's notification system with customized styling and behavior.

## Testing

The application includes comprehensive tests using Jest and React Testing Library:

- Component tests to verify rendering and user interactions
- Redux tests for state management
- Integration tests for feature workflows

Mock implementations are provided for external dependencies like the ArcGIS Maps SDK.

## Development Guidelines

When developing for this application:

1. Maintain the feature-based architecture
2. Keep components focused on a single responsibility
3. Use TypeScript for type safety
4. Write tests for all new functionality
5. Follow the established patterns for Redux state management
6. Use the alert service for user notifications
7. Leverage Ant Design components for consistent UI

## Docker Implementation

The application is containerized using Docker, providing consistent development and deployment environments across different systems.

### Docker Files

- **Dockerfile**: Multi-stage build configuration for production deployments

  - Stage 1: Builds the React application
  - Stage 2: Serves the static files using Nginx

- **Dockerfile.dev**: Development configuration with hot-reloading

  - Mounts the source code as a volume
  - Enables live code changes without rebuilding the container

### Environment Configuration

Environment variables are passed to the container at runtime:

```
VITE_APP_ARCGIS_API_KEY: Required for ArcGIS map functionality
```

### Running in Docker

#### Development Mode

```sh
# From the root directory
docker-compose up frontend-dev
```

#### Production Mode

```sh
# From the root directory
docker-compose up frontend
```

### Testing in Docker

```sh
# Run all tests
docker-compose run --rm frontend-dev npm test

# Run specific tests
docker-compose run --rm frontend-dev npm test -- -t "Car Rental Workflow"
```

### Docker Best Practices

1. **Multi-stage builds**: The production Dockerfile uses multi-stage builds to create smaller final images
2. **Development mode**: The development setup enables hot-reloading for improved developer experience
3. **Volume mounts**: Source code is mounted as volumes in development for real-time editing
4. **Environment variables**: Configured via docker-compose for flexibility across environments
5. **Security**: Production build runs as non-root user inside Nginx container

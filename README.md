# Jitter Editor

Jitter Editor is a web application that allows users to create, edit, and animate geometric shapes in an interactive environment. This document details the technical architecture and system interactions.
<img width="1464" alt="Capture d’écran 2025-05-11 à 21 59 32" src="https://github.com/user-attachments/assets/a526ca32-367a-4517-811c-60309e14b13a" />

## Table of Contents

- [Overview](#overview)
- [Technical Architecture](#technical-architecture)
  - [Technology Stack](#technology-stack)
  - [Folder Structure](#folder-structure)
- [Main Features](#main-features)
- [Data Models](#data-models)
- [Services](#services)
- [State Management](#state-management)
- [Rendering System](#rendering-system)
- [User Interactions](#user-interactions)
- [Import and Export](#import-and-export)
- [Tests](#tests)
- [Installation and Development](#installation-and-development)

## Overview

Jitter Editor is built around an interactive canvas system that allows users to:

- Create and manage projects
- Add geometric shapes (rectangles)
- Manipulate these shapes (colors)
- Animate shapes (rotate)
- Save and load projects

## Technical Architecture

### Technology Stack

- **Frontend**: React, TypeScript
- **Bundler**: Vite
- **Styles**: Styled Components
- **Tests**: Jest
- **Persistence**: Local Storage

### Folder Structure

The application follows a feature-oriented architecture:

```
src/
├── features/
│   └── editor/
│       ├── components/
│       │   ├── canvas/
│       │   ├── control-panel/
│       │   ├── project-manager/
│       │   └── shapes/
│       ├── context/
│       ├── hooks/
│       ├── models/
│       └── services/
├── layouts/
├── pages/
└── shared/
    ├── components/
    ├── config/
    ├── hooks/
    ├── styles/
    └── types/
```

## Main Features

### Interactive Canvas

The canvas is at the core of the application, enabling:

- Shape rendering via Canvas API
- Zoom and pan of the viewport
- Shape animation

### Project Management

- Creation/deletion of projects
- Saving
- Import/export in JSON format

### Animation

- Animation duration control
- Play animation

## Data Models

### Project

```typescript
class Project {
  id: string;
  name: string;
  shapes: Shape[];
  viewport: { zoom: number; panX: number; panY: number };
  animationDuration: number;
  createdAt: Date;
  updatedAt: Date;

  // Serialization/deserialization methods
  toJSON(): ProjectData;
  static fromJSON(json: string): Project;
}
```

### Shape

Shapes are based on an object-oriented approach with factory pattern:

```typescript
interface Shape {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation: number;

  // Rendering method
  draw(ctx: CanvasRenderingContext2D): void;
}
```

## Services

### ProjectService

Manages project persistence via localStorage:

```typescript
class ProjectService {
  static saveProject(project: Project): void;
  static getAllProjects(): ProjectData[];
  static getProjectById(id: string): Project | null;
  static deleteProject(id: string): void;
  static getCurrentProject(): Project | null;
  static setCurrentProject(project: Project): void;
  static createNewProject(name?: string): Project;
  static importProjectFromJson(jsonContent: string): Project | null;
}
```

## State Management

The application uses React's Context API to manage global state:

### ShapesContext

```typescript
interface ShapesContextType {
  shapes: Shape[];
  canvasSize: { width: number; height: number };
  viewport: { zoom: number; panX: number; panY: number };
  selectedShape: Shape | null;
  currentProject: Project | null;
  animationDuration: number;
  isAnimating: boolean;

  // Actions
  addShape: (shape: Shape) => void;
  updateShape: (shape: Shape) => void;
  removeShape: (id: string) => void;
  clearShapes: () => void;
  selectShape: (shape: Shape | null) => void;
  resetView: () => void;
  zoomCanvas: (zoomFactor: number, centerX: number, centerY: number) => void;
  panCanvas: (deltaX: number, deltaY: number) => void;
  setAnimationDuration: (duration: number) => void;
  animateShapes: (duration: number) => void;
}
```

## Rendering System

The rendering system uses the HTML5 Canvas API with several abstraction layers:

1. **useCanvasSetup**: Initializes the canvas and manages dimensions
2. **useCanvasDrawing**: Manages the rendering cycle and draws shapes
3. **useCanvasInteraction**: Manages user interactions (drag, selection)
4. **useShapeInteraction**: Shape-specific interactions

## User Interactions

### Canvas Interactions

- **Zoom**: Mouse wheel
- **Selection**: Click on a shape

### Control Interactions

- Adding random shapes
- Resetting the view
- Starting animations
- Managing projects

## Import and Export

The system allows importing and exporting projects in JSON format:

1. **Export**:

   - Serialization of the project to JSON
   - Creation of a Blob and download via URL.createObjectURL

2. **Import**:
   - File selection via input[type=file]
   - File reading with FileReader
   - Deserialization and creation of a new project

## Tests

The application uses Jest for:

- React component tests
- Mocking services and context

## Installation and Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Deployment

The application can be deployed on any static hosting service such as Netlify, Vercel, or GitHub Pages.

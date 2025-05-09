import type { Shape } from '../components/shapes/Rectangle';
import type { ViewportState } from '../context/ShapesContext';
import { ShapeFactory } from '../components/shapes/ShapeFactory';

export interface ProjectData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  shapes: Shape[];
  viewport: ViewportState;
  animationDuration: number;
}

export class Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  shapes: Shape[];
  viewport: ViewportState;
  animationDuration: number;

  constructor(data: Partial<ProjectData> = {}) {
    this.id = data.id || this.generateId();
    this.name = data.name || 'Untitled Project';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    this.shapes = data.shapes ? this.recreateShapes(data.shapes) : [];
    this.viewport = data.viewport || { zoom: 1, panX: 0, panY: 0 };
    this.animationDuration = data.animationDuration || 2; 
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private recreateShapes(shapesData: Shape[]): Shape[] {
    return shapesData.map(shapeData => ShapeFactory.createShape(shapeData));
  }

  toJSON(): ProjectData {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      shapes: this.shapes,
      viewport: this.viewport,
      animationDuration: this.animationDuration
    };
  }

  static fromJSON(json: string): Project {
    try {
      const data = JSON.parse(json);
      return new Project(data);
    } catch (error) {
      console.error('Failed to parse project data:', error);
      return new Project();
    }
  }
} 
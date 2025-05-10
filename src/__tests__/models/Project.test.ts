import { Project } from '../../features/editor/models/Project';
import { ShapeFactory } from '../../features/editor/components/shapes/ShapeFactory';
import type { Shape } from '../../features/editor/components/shapes/Rectangle';

jest.mock('../../features/editor/components/shapes/ShapeFactory', () => ({
  ShapeFactory: {
    createShape: jest.fn(shape => shape),
    updateShape: jest.fn()
  }
}));

describe('Project Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new Project with default values', () => {
    const project = new Project();
    
    expect(project.id).toBeDefined();
    expect(project.name).toBe('Untitled Project');
    expect(project.shapes).toEqual([]);
    expect(project.viewport).toEqual({ zoom: 1, panX: 0, panY: 0 });
    expect(project.animationDuration).toBe(2);
    expect(project.createdAt).toBeInstanceOf(Date);
    expect(project.updatedAt).toBeInstanceOf(Date);
  });

  test('should create a Project with provided values', () => {
    const mockShape = {
      id: 'shape1',
      type: 'rectangle',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      color: '#ff0000',
      rotation: 0,
      draw: jest.fn()
    } as unknown as Shape;
    
    const testData = {
      id: 'test-id',
      name: 'Test Project',
      shapes: [mockShape],
      viewport: { zoom: 2, panX: 100, panY: 100 },
      animationDuration: 5,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z'
    };
    
    const project = new Project(testData);
    
    expect(project.id).toBe('test-id');
    expect(project.name).toBe('Test Project');
    expect(ShapeFactory.createShape).toHaveBeenCalledWith(mockShape);
    expect(project.viewport).toEqual({ zoom: 2, panX: 100, panY: 100 });
    expect(project.animationDuration).toBe(5);
    expect(project.createdAt).toEqual(new Date('2023-01-01T00:00:00.000Z'));
    expect(project.updatedAt).toEqual(new Date('2023-01-02T00:00:00.000Z'));
  });

  test('should correctly convert to JSON', () => {
    const project = new Project({
      id: 'test-id',
      name: 'Test Project',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z'
    });
    
    const json = project.toJSON();
    
    expect(json).toEqual({
      id: 'test-id',
      name: 'Test Project',
      shapes: [],
      viewport: { zoom: 1, panX: 0, panY: 0 },
      animationDuration: 2,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    });
  });

  test('should correctly create from JSON string', () => {
    const jsonString = JSON.stringify({
      id: 'test-id',
      name: 'Test Project',
      shapes: [],
      viewport: { zoom: 1, panX: 0, panY: 0 },
      animationDuration: 2,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z'
    });
    
    const project = Project.fromJSON(jsonString);
    
    expect(project.id).toBe('test-id');
    expect(project.name).toBe('Test Project');
    expect(project.createdAt).toEqual(new Date('2023-01-01T00:00:00.000Z'));
  });

  test('should handle invalid JSON', () => {
    const invalidJson = 'invalid json';
    
    const project = Project.fromJSON(invalidJson);
    
    expect(project).toBeInstanceOf(Project);
    expect(project.name).toBe('Untitled Project');
  });
}); 
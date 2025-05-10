import { ProjectService } from '../../features/editor/services/ProjectService';
import { Project } from '../../features/editor/models/Project';

describe('ProjectService', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      })
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });

  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test('should create a new project', () => {
    const project = ProjectService.createNewProject('Test Project');
    
    expect(project).toBeInstanceOf(Project);
    expect(project.name).toBe('Test Project');
  });

  test('should save a project', () => {
    const project = new Project({ id: 'test-id', name: 'Test Project' });
    
    // Mock getAllProjects to return an empty array
    jest.spyOn(ProjectService, 'getAllProjects').mockReturnValue([]);
    
    ProjectService.saveProject(project);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'jitter-editor-projects', 
      expect.any(String)
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'jitter-editor-current-project', 
      expect.any(String)
    );
  });

  test('should get project by id', () => {
    const projectData = {
      id: 'test-id',
      name: 'Test Project',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shapes: [],
      viewport: { zoom: 1, panX: 0, panY: 0 },
      animationDuration: 2
    };
    
    // Mock getAllProjects to return an array with our test project
    jest.spyOn(ProjectService, 'getAllProjects').mockReturnValue([projectData]);
    
    const retrievedProject = ProjectService.getProjectById('test-id');
    
    expect(retrievedProject).not.toBeNull();
    expect(retrievedProject?.id).toBe('test-id');
    expect(retrievedProject?.name).toBe('Test Project');
  });

  test('should return null for non-existent project id', () => {
    // Mock getAllProjects to return an empty array
    jest.spyOn(ProjectService, 'getAllProjects').mockReturnValue([]);
    
    const retrievedProject = ProjectService.getProjectById('non-existent');
    
    expect(retrievedProject).toBeNull();
  });

  test('should delete a project', () => {
    const projectsList = [
      { 
        id: 'project1', 
        name: 'Project 1', 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shapes: [],
        viewport: { zoom: 1, panX: 0, panY: 0 },
        animationDuration: 2
      },
      { 
        id: 'project2', 
        name: 'Project 2', 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shapes: [],
        viewport: { zoom: 1, panX: 0, panY: 0 },
        animationDuration: 2
      }
    ];
    
    // Mock getAllProjects to return our test projects list
    jest.spyOn(ProjectService, 'getAllProjects').mockReturnValue(projectsList);
    
    // Mock getCurrentProject to return null (no current project)
    jest.spyOn(ProjectService, 'getCurrentProject').mockReturnValue(null);
    
    ProjectService.deleteProject('project1');
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'jitter-editor-projects', 
      expect.stringContaining('project2')
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'jitter-editor-projects', 
      expect.not.stringContaining('project1')
    );
  });
}); 
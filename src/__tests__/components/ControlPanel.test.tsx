import { useShapes } from '../../features/editor/context/ShapesContext';
import { Project } from '../../features/editor/models/Project';

// Mock hooks
jest.mock('../../features/editor/context/ShapesContext', () => ({
  ...jest.requireActual('../../features/editor/context/ShapesContext'),
  useShapes: jest.fn()
}));

// Mock URL methods
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('ControlPanel Component', () => {
  const mockProject = new Project({ id: 'test-id', name: 'Test Project' });
  
  beforeEach(() => {
    // Set up mocks
    (useShapes as jest.Mock).mockReturnValue({
      addShape: jest.fn(),
      clearShapes: jest.fn(),
      canvasSize: { width: 800, height: 600 },
      viewport: { zoom: 1, panX: 0, panY: 0 },
      resetView: jest.fn(),
      animateShapes: jest.fn(),
      isAnimating: false,
      currentProject: mockProject,
      animationDuration: 2,
      setAnimationDuration: jest.fn()
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('mocks are configured correctly', () => {
    const shapesContext = useShapes();
    
    expect(shapesContext.currentProject).toBe(mockProject);
    expect(shapesContext.animationDuration).toBe(2);
    expect(typeof shapesContext.addShape).toBe('function');
    expect(typeof shapesContext.clearShapes).toBe('function');
    expect(typeof shapesContext.resetView).toBe('function');
    expect(typeof shapesContext.animateShapes).toBe('function');
  });

}); 
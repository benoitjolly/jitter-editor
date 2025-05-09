import { Project, type ProjectData } from '../models/Project';

const PROJECTS_STORAGE_KEY = 'jitter-editor-projects';
const CURRENT_PROJECT_KEY = 'jitter-editor-current-project';

export class ProjectService {
  static saveProject(project: Project): void {
    project.updatedAt = new Date();
    
    const projects = this.getAllProjects();
    
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = project.toJSON();
    } else {
      projects.push(project.toJSON());
    }
    
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    
    this.setCurrentProject(project);
  }
  
  static getAllProjects(): ProjectData[] {
    const projectsJson = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!projectsJson) return [];
    
    try {
      return JSON.parse(projectsJson);
    } catch (error) {
      console.error('Failed to parse projects data:', error);
      return [];
    }
  }
  
  static getProjectById(id: string): Project | null {
    const projects = this.getAllProjects();
    const projectData = projects.find(p => p.id === id);
    
    if (!projectData) return null;
    
    return new Project(projectData);
  }
  
  static deleteProject(id: string): void {
    let projects = this.getAllProjects();
    projects = projects.filter(p => p.id !== id);
    
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    
    const currentProject = this.getCurrentProject();
    if (currentProject && currentProject.id === id) {
      localStorage.removeItem(CURRENT_PROJECT_KEY);
    }
  }
  
  static getCurrentProject(): Project | null {
    const currentProjectJson = localStorage.getItem(CURRENT_PROJECT_KEY);
    if (!currentProjectJson) return null;
    
    try {
      return Project.fromJSON(currentProjectJson);
    } catch (error) {
      console.error('Failed to load current project:', error);
      return null;
    }
  }
  
  static setCurrentProject(project: Project): void {
    localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project.toJSON()));
  }
  
  static createNewProject(name: string = 'Untitled Project'): Project {
    return new Project({ name });
  }
} 
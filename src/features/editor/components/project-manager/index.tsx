import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../../../shared/components/ui/Button';
import { useShapes } from '../../context/ShapesContext';
import type { Project } from '../../models/Project';

const ProjectManagerContainer = styled.div`
  margin-top: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => theme.colors.light};
  padding-top: ${({ theme }) => theme.space.md};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin-bottom: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.primary};
`;

const ProjectControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`;

const InputGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  align-items: center;
`;

const ProjectInput = styled.input`
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  flex-grow: 1;
`;

const ProjectList = styled.div`
  margin-top: ${({ theme }) => theme.space.sm};
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const ProjectItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.light};
  }
`;

const ProjectInfo = styled.div`
  flex-grow: 1;
  overflow: hidden;
`;

const ProjectName = styled.div`
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.dark};
`;

const ProjectActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xs};
`;

const SmallButton = styled(Button)`
  padding: 2px 6px;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const ProjectManager: React.FC = () => {
  const { 
    currentProject, 
    saveProject, 
    loadProject, 
    createNewProject, 
    getAllProjects, 
    deleteProject 
  } = useShapes();
  
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    refreshProjects();
  }, []);
  
  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name);
    }
  }, [currentProject]);
  
  const refreshProjects = () => {
    setProjects(getAllProjects());
  };
  
  const handleSaveProject = () => {
    saveProject(projectName);
    refreshProjects();
  };
  
  const handleCreateNew = () => {
    createNewProject(projectName || undefined);
    refreshProjects();
  };
  
  const handleLoadProject = (projectId: string) => {
    loadProject(projectId);
  };
  
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      refreshProjects();
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <ProjectManagerContainer>
      <SectionTitle>Projects</SectionTitle>
      
      <ProjectControls>
        <InputGroup>
          <ProjectInput
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <Button onClick={handleSaveProject} size="small">
            Save
          </Button>
          <Button onClick={handleCreateNew} size="small" variant="secondary">
            New
          </Button>
        </InputGroup>
        
        <ProjectList>
          {projects.length === 0 ? (
            <div>No saved projects</div>
          ) : (
            projects.map((project) => (
              <ProjectItem key={project.id}>
                <ProjectInfo>
                  <ProjectName>{project.name}</ProjectName>
                  <ProjectDate>Updated: {formatDate(project.updatedAt)}</ProjectDate>
                </ProjectInfo>
                <ProjectActions>
                  <SmallButton 
                    onClick={() => handleLoadProject(project.id)}
                    variant="primary"
                    size="small"
                  >
                    Load
                  </SmallButton>
                  <SmallButton 
                    onClick={() => handleDeleteProject(project.id)}
                    variant="secondary"
                    size="small"
                  >
                    Delete
                  </SmallButton>
                </ProjectActions>
              </ProjectItem>
            ))
          )}
        </ProjectList>
      </ProjectControls>
    </ProjectManagerContainer>
  );
};

export default ProjectManager; 
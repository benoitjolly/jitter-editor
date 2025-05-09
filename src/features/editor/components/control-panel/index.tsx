import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../../../../shared/components/ui/Button'
import { useShapes } from '../../context/ShapesContext'
import ProjectManager from '../project-manager'

const ControlPanelContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: ${({ theme }) => theme.space.md};
  margin: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const PanelTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.sm};
  font-size: ${({ theme }) => theme.fontSizes.large};
`

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  flex-grow: 1;
  height: 100%;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm};
`

const BottomButtonsContainer = styled(ButtonsContainer)`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.space.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.light};
`

const AnimationSection = styled.div`
  margin-top: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => theme.colors.light};
  padding-top: ${({ theme }) => theme.space.md};
`

const AnimationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.dark};
`

const Input = styled.input`
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  width: 80px;
  font-size: ${({ theme }) => theme.fontSizes.small};
`

const LoadingIndicator = styled.span`
  margin-left: ${({ theme }) => theme.space.sm};
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.dark};
  font-style: italic;
`

const ControlPanel: React.FC = () => {
  const { 
    addShape, 
    clearShapes, 
    canvasSize, 
    viewport, 
    resetView, 
    animateShapes, 
    isAnimating, 
    currentProject,
    animationDuration,
    setAnimationDuration
  } = useShapes();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddRectangle = async () => {
    if (canvasSize.width === 0 || canvasSize.height === 0) {
      console.error('Cannot add rectangle: Canvas not initialized');
      return;
    }
    
    setIsLoading(true);
    try {
      const { zoom, panX, panY } = viewport;
      
      const visibleLeft = -panX / zoom;
      const visibleTop = -panY / zoom;
      const visibleWidth = canvasSize.width / zoom;
      const visibleHeight = canvasSize.height / zoom;
      
      const { createRandomRectangle } = await import('../shapes/ShapeFactory');
      
      const rectangle = createRandomRectangle(
        visibleWidth,
        visibleHeight,
        visibleLeft,
        visibleTop
      );
      
      addShape(rectangle);
    } catch (error) {
      console.error('Failed to load shape factory:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetView = () => {
    resetView();
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAnimationDuration(value);
    }
  };
  
  const handleAnimateClick = () => {
    animateShapes(animationDuration * 1000);
  };
  
  const handleDownloadJson = () => {
    if (!currentProject) return;
    
    const projectData = currentProject.toJSON();
    const jsonString = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <ControlPanelContainer>
      <PanelTitle>Controls</PanelTitle>
      <ControlsWrapper>
        {currentProject && (
          <div style={{ marginBottom: '8px' }}>
            <small>Project: {currentProject.name}</small>
          </div>
        )}
      
        <ButtonsContainer>
          <Button onClick={handleAddRectangle} disabled={isLoading || canvasSize.width === 0}>
            Add Random Rectangle
            {isLoading && <LoadingIndicator>Loading...</LoadingIndicator>}
          </Button>
        </ButtonsContainer>
        
        <AnimationSection>
          <Label>Animation</Label>
          <AnimationControls>
            <InputGroup>
              <Label htmlFor="duration">Duration (s)</Label>
              <Input 
                id="duration"
                type="number" 
                min="0.1" 
                max="10" 
                step="0.1"
                value={animationDuration} 
                onChange={handleDurationChange} 
              />
            </InputGroup>
            <Button 
              onClick={handleAnimateClick} 
              disabled={isAnimating || canvasSize.width === 0}
              variant="primary"
            >
              {isAnimating ? 'Animating...' : 'Play Animation'}
            </Button>
          </AnimationControls>
        </AnimationSection>
        
        <ProjectManager />
        
        <BottomButtonsContainer>
          <Button variant="secondary" onClick={clearShapes}>
            Clear All
          </Button>
          <Button variant="secondary" size="small" onClick={handleResetView}>
            Reset View
          </Button>
          {currentProject && (
            <Button 
              variant="secondary" 
              size="small" 
              onClick={handleDownloadJson}
              title="Download project as JSON file"
            >
              Download as JSON
            </Button>
          )}
        </BottomButtonsContainer>
      </ControlsWrapper>
    </ControlPanelContainer>
  )
}

export default ControlPanel 
 
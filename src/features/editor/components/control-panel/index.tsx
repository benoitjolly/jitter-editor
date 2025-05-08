import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../../../../shared/components/ui/Button'
import { useShapes } from '../../context/ShapesContext'

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

const LoadingIndicator = styled.span`
  margin-left: ${({ theme }) => theme.space.sm};
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.dark};
  font-style: italic;
`

const ControlPanel: React.FC = () => {
  const { addShape, clearShapes, canvasSize, viewport, resetView } = useShapes();
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
  
  return (
    <ControlPanelContainer>
      <PanelTitle>Controls</PanelTitle>
      <ControlsWrapper>
        <ButtonsContainer>
          <Button onClick={handleAddRectangle} disabled={isLoading || canvasSize.width === 0}>
            Add Random Rectangle
            {isLoading && <LoadingIndicator>Loading...</LoadingIndicator>}
          </Button>
        </ButtonsContainer>
        
        <BottomButtonsContainer>
          <Button variant="secondary" onClick={clearShapes}>
            Clear All
          </Button>
          <Button variant="secondary" size="small" onClick={handleResetView}>
            Reset View
          </Button>
        </BottomButtonsContainer>
      </ControlsWrapper>
    </ControlPanelContainer>
  )
}

export default ControlPanel 
 
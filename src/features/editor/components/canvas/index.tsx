import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import useWindowResize from '../../../../shared/hooks/useWindowResize'
import { 
  CANVAS_GRID_SIZE, 
  CANVAS_GRID_COLOR, 
  CANVAS_GRID_ACCENT_COLOR, 
  CANVAS_GRID_ACCENT_EVERY, 
  CANVAS_BACKGROUND_COLOR 
} from '../../../../shared/config/constants'

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  margin: 0;
  padding: 0;
  position: relative;
`

const MainCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowSize = useWindowResize();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = rect.width * pixelRatio;
      canvas.height = rect.height * pixelRatio;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(pixelRatio, pixelRatio);
        
        ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
        ctx.fillRect(0, 0, rect.width, rect.height);
        
        drawGrid(ctx, rect.width, rect.height);
      }
    };
    
    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.beginPath();
      
      for (let x = 0; x <= width; x += CANVAS_GRID_SIZE) {
        ctx.strokeStyle = x % (CANVAS_GRID_SIZE * CANVAS_GRID_ACCENT_EVERY) === 0 ? CANVAS_GRID_ACCENT_COLOR : CANVAS_GRID_COLOR;
        ctx.lineWidth = x % (CANVAS_GRID_SIZE * CANVAS_GRID_ACCENT_EVERY) === 0 ? 1 : 0.5;
        
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      
      for (let y = 0; y <= height; y += CANVAS_GRID_SIZE) {
        ctx.strokeStyle = y % (CANVAS_GRID_SIZE * CANVAS_GRID_ACCENT_EVERY) === 0 ? CANVAS_GRID_ACCENT_COLOR : CANVAS_GRID_COLOR;
        ctx.lineWidth = y % (CANVAS_GRID_SIZE * CANVAS_GRID_ACCENT_EVERY) === 0 ? 1 : 0.5;
        
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      
      ctx.stroke();
    };
    
    updateCanvasSize();
    
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(container);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [windowSize]);
  
  return (
    <CanvasContainer>
      <MainCanvas ref={canvasRef} />
    </CanvasContainer>
  )
}

export default Canvas 
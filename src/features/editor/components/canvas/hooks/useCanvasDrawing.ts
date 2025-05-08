import { useCallback } from 'react'
import { 
  CANVAS_GRID_SIZE, 
  CANVAS_GRID_COLOR, 
  CANVAS_GRID_ACCENT_COLOR, 
  CANVAS_GRID_ACCENT_EVERY, 
  CANVAS_BACKGROUND_COLOR 
} from '../../../../../shared/config/constants'
import type { Shape } from '../../shapes/Rectangle'
import type { ViewportState } from '../../../context/ShapesContext'

export const useCanvasDrawing = (shapes: Shape[], viewport: ViewportState) => {
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const { zoom, panX, panY } = viewport;
    
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);
    
    ctx.beginPath();
    
    const visibleStartX = -panX / zoom;
    const visibleStartY = -panY / zoom;
    const visibleEndX = (width - panX) / zoom;
    const visibleEndY = (height - panY) / zoom;
    
    const startX = Math.floor(visibleStartX / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE;
    const startY = Math.floor(visibleStartY / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE;
    
    for (let x = startX; x <= visibleEndX; x += CANVAS_GRID_SIZE) {
      ctx.strokeStyle = x % (CANVAS_GRID_SIZE * CANVAS_GRID_ACCENT_EVERY) === 0 ? CANVAS_GRID_ACCENT_COLOR : CANVAS_GRID_COLOR;
      ctx.lineWidth = x % (CANVAS_GRID_SIZE * CANVAS_GRID_ACCENT_EVERY) === 0 ? 1 / zoom : 0.5 / zoom;
      
      ctx.moveTo(x, visibleStartY);
      ctx.lineTo(x, visibleEndY);
    }
    
    for (let y = startY; y <= visibleEndY; y += CANVAS_GRID_SIZE) {
      ctx.strokeStyle = y % (CANVAS_GRID_SIZE * CANVAS_GRID_ACCENT_EVERY) === 0 ? CANVAS_GRID_ACCENT_COLOR : CANVAS_GRID_COLOR;
      ctx.lineWidth = y % (CANVAS_GRID_SIZE * CANVAS_GRID_ACCENT_EVERY) === 0 ? 1 / zoom : 0.5 / zoom;
      
      ctx.moveTo(visibleStartX, y);
      ctx.lineTo(visibleEndX, y);
    }
    
    ctx.stroke();
    ctx.restore();
  }, [viewport]);
  
  const drawCanvas = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const { zoom, panX, panY } = viewport;
    
    ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, width, height);
    
    drawGrid(ctx, width, height);
    
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);
    
    shapes.forEach(shape => shape.draw(ctx));
    
    ctx.restore();
  }, [shapes, drawGrid, viewport]);

  return {
    drawGrid,
    drawCanvas
  }
} 
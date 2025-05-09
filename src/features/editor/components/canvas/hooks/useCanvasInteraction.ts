import { useState, useCallback } from 'react'
import type { MouseEvent, RefObject } from 'react'
import type { ViewportState } from '../../../context/ShapesContext'

interface CanvasInteractionProps {
  viewport: ViewportState;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
}

export const useCanvasInteraction = ({
  viewport,
  setZoom,
  setPan,
  resetView,
  containerRef
}: CanvasInteractionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const handleZoom = useCallback((deltaY: number, x: number, y: number) => {
    const { zoom: currentZoom } = viewport;
    const zoomFactor = 1.03; 
    
    const newZoom = deltaY > 0 
      ? currentZoom / zoomFactor 
      : currentZoom * zoomFactor;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = x - rect.left;
    const mouseY = y - rect.top;
    
    const worldX = (mouseX - viewport.panX) / currentZoom;
    const worldY = (mouseY - viewport.panY) / currentZoom;
    
    const newPanX = mouseX - worldX * newZoom;
    const newPanY = mouseY - worldY * newZoom;
    
    setZoom(newZoom);
    setPan(newPanX, newPanY);
  }, [viewport, setZoom, setPan, containerRef]);
  
  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);
  
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setPan(viewport.panX + dx, viewport.panY + dy);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, setPan, viewport.panX, viewport.panY]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleDoubleClick = useCallback(() => {
    resetView();
  }, [resetView]);
  
  return {
    isDragging,
    setIsDragging,
    handleZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick
  }
} 
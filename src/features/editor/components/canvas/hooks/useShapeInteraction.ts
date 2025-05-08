import { useCallback, useState, useEffect } from 'react'
import type { MouseEvent, RefObject } from 'react'
import type { Shape } from '../../shapes/Rectangle'
import type { ViewportState } from '../../../context/ShapesContext'
import { getRandomColor } from '../../shapes/ShapeFactory'

const isPointInRectangle = (
  x: number, 
  y: number, 
  rect: Shape, 
  zoom: number, 
  panX: number, 
  panY: number
): boolean => {
  const worldX = (x - panX) / zoom;
  const worldY = (y - panY) / zoom;
  
  if (rect.rotation === 0) {
    return (
      worldX >= rect.x &&
      worldX <= rect.x + rect.width &&
      worldY >= rect.y &&
      worldY <= rect.y + rect.height
    );
  } else {
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    
    const x1 = worldX - centerX;
    const y1 = worldY - centerY;
    
    const angleRad = -rect.rotation * Math.PI / 180;
    const x2 = x1 * Math.cos(angleRad) - y1 * Math.sin(angleRad);
    const y2 = x1 * Math.sin(angleRad) + y1 * Math.cos(angleRad);
    
    return (
      x2 >= -rect.width / 2 &&
      x2 <= rect.width / 2 &&
      y2 >= -rect.height / 2 &&
      y2 <= rect.height / 2
    );
  }
};

interface RectangleUpdate {
  color?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
}

interface ShapeInteractionProps {
  shapes: Shape[];
  viewport: ViewportState;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  containerRef: RefObject<HTMLDivElement | null>;
}

export const useShapeInteraction = ({
  shapes,
  viewport,
  updateShape,
  containerRef
}: ShapeInteractionProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleShapeClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const { zoom, panX, panY } = viewport;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      
      if (isPointInRectangle(mouseX, mouseY, shape, zoom, panX, panY)) {
        if (shape.type === 'rectangle') {
          const update: RectangleUpdate = { color: getRandomColor() };
          updateShape(shape.id, update as Partial<Shape>);
        }
        break;
      }
    }
  }, [shapes, viewport, updateShape, containerRef]);
  
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const { zoom, panX, panY } = viewport;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    let hovering = false;
    
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      
      if (isPointInRectangle(mouseX, mouseY, shape, zoom, panX, panY)) {
        hovering = true;
        break;
      }
    }
    
    if (hovering && !isHovering) {
      container.style.cursor = 'pointer';
      setIsHovering(true);
    } else if (!hovering && isHovering) {
      container.style.cursor = 'grab';
      setIsHovering(false);
    }
  }, [shapes, viewport, containerRef, isHovering]);
  
  useEffect(() => {
    const currentContainer = containerRef.current;
    
    return () => {
      if (currentContainer) {
        currentContainer.style.cursor = 'default';
      }
    };
  }, [containerRef]);
  
  return {
    handleShapeClick,
    handleMouseMove,
    isHovering
  };
}; 
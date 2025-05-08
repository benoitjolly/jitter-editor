import { useState, useCallback } from 'react'
import type { RefObject } from 'react'

interface CanvasSize {
  width: number;
  height: number;
}

interface CanvasSetupProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  updateCanvasSize: (size: CanvasSize) => void;
  drawCanvas: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const useCanvasSetup = ({
  canvasRef,
  containerRef,
  updateCanvasSize,
  drawCanvas
}: CanvasSetupProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    if (dimensions.width === rect.width && dimensions.height === rect.height) {
      return;
    }
    
    setDimensions({ width: rect.width, height: rect.height });
    
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = rect.width * pixelRatio;
    canvas.height = rect.height * pixelRatio;
    
    updateCanvasSize({ width: rect.width, height: rect.height });
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(pixelRatio, pixelRatio);
      drawCanvas(ctx, rect.width, rect.height);
    }
  }, [dimensions, updateCanvasSize, drawCanvas, canvasRef, containerRef]);
  
  return {
    dimensions,
    updateCanvasDimensions
  }
} 
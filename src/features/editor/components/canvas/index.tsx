import React, { useRef, useEffect } from 'react'
import useWindowResize from '../../../../shared/hooks/useWindowResize'
import { useShapes } from '../../context/ShapesContext'
import { CanvasContainer, MainCanvas, ZoomInfo } from './styles'
import { useCanvasDrawing } from './hooks/useCanvasDrawing'
import { useCanvasInteraction } from './hooks/useCanvasInteraction'
import { useCanvasSetup } from './hooks/useCanvasSetup'
import { useShapeInteraction } from './hooks/useShapeInteraction'

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowResize();
  const { shapes, updateCanvasSize, viewport, setZoom, setPan, resetView, updateShape } = useShapes();
  
  const { drawCanvas } = useCanvasDrawing(shapes, viewport);
  
  const { 
    dimensions,
    updateCanvasDimensions 
  } = useCanvasSetup({
    canvasRef,
    containerRef,
    updateCanvasSize,
    drawCanvas
  });
  
  const {
    handleZoom,
    handleMouseDown,
    handleMouseMove: handleCanvasMove,
    handleMouseUp,
    handleDoubleClick,
    setIsDragging
  } = useCanvasInteraction({
    viewport,
    setZoom,
    setPan,
    resetView,
    containerRef
  });
  
  const { 
    handleShapeClick,
    handleMouseMove: handleShapeHover
  } = useShapeInteraction({
    shapes,
    viewport,
    updateShape,
    containerRef
  });
  
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      handleMouseDown(e);
      
      if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
        handleShapeClick(e);
      }
    }
  };
  
  const handleCombinedMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleCanvasMove(e);
    handleShapeHover(e);
  };
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    updateCanvasDimensions();
    
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        updateCanvasDimensions();
      });
    });
    
    resizeObserver.observe(container);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [updateCanvasDimensions, windowSize]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const wheelHandler = (e: globalThis.WheelEvent) => {
      e.preventDefault();
      handleZoom(e.deltaY, e.clientX, e.clientY);
    };
    
    container.addEventListener('wheel', wheelHandler, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, [handleZoom]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx && dimensions.width > 0 && dimensions.height > 0) {
      drawCanvas(ctx, dimensions.width, dimensions.height);
    }
  }, [shapes, dimensions, drawCanvas, viewport]);
  
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [setIsDragging]);
  
  return (
    <CanvasContainer 
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCombinedMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      <MainCanvas ref={canvasRef} />
      <ZoomInfo>Zoom: {Math.round(viewport.zoom * 100)}%</ZoomInfo>
    </CanvasContainer>
  )
}

export default Canvas 
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Shape } from '../components/shapes/Rectangle';

export interface CanvasSize {
  width: number;
  height: number;
}

export interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
}

interface ShapesContextType {
  shapes: Shape[];
  addShape: (shape: Shape) => void;
  clearShapes: () => void;
  updateCanvasSize: (size: CanvasSize) => void;
  canvasSize: CanvasSize;
  viewport: ViewportState;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
}

const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

const ShapesContext = createContext<ShapesContextType | undefined>(undefined);

export const useShapes = (): ShapesContextType => {
  const context = useContext(ShapesContext);
  if (!context) {
    throw new Error('useShapes must be used within a ShapesProvider');
  }
  return context;
};

interface ShapesProviderProps {
  children: ReactNode;
}

export const ShapesProvider: React.FC<ShapesProviderProps> = ({ children }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 0, height: 0 });
  const prevCanvasSizeRef = useRef<CanvasSize>({ width: 0, height: 0 });
  const isInitialRender = useRef(true);
  const [viewport, setViewport] = useState<ViewportState>({
    zoom: DEFAULT_ZOOM,
    panX: 0,
    panY: 0
  });

  const addShape = (shape: Shape) => {
    setShapes((prevShapes) => [...prevShapes, shape]);
  };

  const clearShapes = () => {
    setShapes([]);
  };

  const updateCanvasSize = (size: CanvasSize) => {
    if (size.width === canvasSize.width && size.height === canvasSize.height) {
      return;
    }
    setCanvasSize(size);
  };

  const setZoom = (zoom: number) => {
    const newZoom = Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
    setViewport(prev => ({ ...prev, zoom: newZoom }));
  };

  const setPan = (x: number, y: number) => {
    setViewport(prev => ({ ...prev, panX: x, panY: y }));
  };

  const resetView = () => {
    setViewport({ zoom: DEFAULT_ZOOM, panX: 0, panY: 0 });
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevCanvasSizeRef.current = canvasSize;
      return;
    }
    
    const prevSize = prevCanvasSizeRef.current;
    
    if (prevSize.width === 0 || prevSize.height === 0) {
      prevCanvasSizeRef.current = canvasSize;
      return;
    }

    prevCanvasSizeRef.current = canvasSize;
  }, [canvasSize]);

  return (
    <ShapesContext.Provider value={{ 
      shapes, 
      addShape, 
      clearShapes, 
      updateCanvasSize, 
      canvasSize,
      viewport,
      setZoom,
      setPan,
      resetView
    }}>
      {children}
    </ShapesContext.Provider>
  );
}; 
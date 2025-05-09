import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Shape } from '../components/shapes/Rectangle';
import { ShapeFactory } from '../components/shapes/ShapeFactory';

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
  updateShape: (id: string, updates: Partial<Shape>) => void;
  clearShapes: () => void;
  updateCanvasSize: (size: CanvasSize) => void;
  canvasSize: CanvasSize;
  viewport: ViewportState;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
  animateShapes: (durationMs: number) => void;
  isAnimating: boolean;
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
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const [viewport, setViewport] = useState<ViewportState>({
    zoom: DEFAULT_ZOOM,
    panX: 0,
    panY: 0
  });

  const addShape = (shape: Shape) => {
    setShapes((prevShapes) => [...prevShapes, shape]);
  };

  const updateShape = (id: string, updates: Partial<Shape>) => {
    setShapes(prevShapes => 
      prevShapes.map(shape => 
        shape.id === id 
          ? ShapeFactory.updateShape(shape, updates)
          : shape
      )
    );
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

  const animateShapes = (durationMs: number) => {
    if (isAnimating || shapes.length === 0) return;
    
    setIsAnimating(true);
    
    const initialRotations = shapes.map(shape => shape.rotation);
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / durationMs, 1);
      
      shapes.forEach((shape, index) => {
        const initialRotation = initialRotations[index];
        const newRotation = initialRotation + progress * 360;
        updateShape(shape.id, { rotation: newRotation });
      });
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        shapes.forEach((shape, index) => {
          const initialRotation = initialRotations[index];
          updateShape(shape.id, { rotation: initialRotation + 360 });
        });
        setIsAnimating(false);
        animationRef.current = null;
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
      updateShape,
      clearShapes, 
      updateCanvasSize, 
      canvasSize,
      viewport,
      setZoom,
      setPan,
      resetView,
      animateShapes,
      isAnimating
    }}>
      {children}
    </ShapesContext.Provider>
  );
}; 
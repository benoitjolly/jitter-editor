import { Rectangle } from './Rectangle';
import type { RectangleProps } from './Rectangle';

export const createRandomRectangle = (
  canvasWidth: number, 
  canvasHeight: number, 
  offsetX: number = 0, 
  offsetY: number = 0
): Rectangle => {
  const minSize = 20;
  const maxWidth = Math.min(canvasWidth / 4, 100);
  const maxHeight = Math.min(canvasHeight / 4, 100);

  const randomRotation = Math.floor(Math.random() * 360);

  const props: RectangleProps = {
    x: offsetX + Math.random() * (canvasWidth - maxWidth),
    y: offsetY + Math.random() * (canvasHeight - maxHeight),
    width: minSize + Math.random() * (maxWidth - minSize),
    height: minSize + Math.random() * (maxHeight - minSize),
    color: getRandomColor(),
    rotation: randomRotation
  };

  return new Rectangle(props);
};

export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}; 
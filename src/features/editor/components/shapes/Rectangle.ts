export interface Shape {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface RectangleProps {
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation?: number;
}

export class Rectangle implements Shape {
  id: string;
  type: string = 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation: number;

  constructor({ id, x, y, width, height, color, rotation = 0 }: RectangleProps) {
    this.id = id || Math.random().toString(36).substring(2, 9);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.rotation = rotation;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = this.color;
    
    if (this.rotation !== 0) {
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    } else {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    ctx.restore();
  }
} 
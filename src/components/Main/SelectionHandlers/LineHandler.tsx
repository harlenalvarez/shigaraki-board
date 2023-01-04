import { useCanvasCtx } from '@/store';
import { useState } from 'react';
import { ActionListenerContainer } from '@/components/Main/Main.styled';

const clearCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  strokeWidth: number = 1) => {
  const half = Math.ceil(strokeWidth / 2);
  const full = half + half;
  const topX = x - radius - half;
  const topY = y - radius - half;
  ctx.clearRect(topX, topY, radius * 2 + full, radius * 2 + full);
};

export const LineHandler = () => {
  const ctx = useCanvasCtx();
  const [[x, y], setFirstClickPosition] = useState([-1, -1]);

  const handleClick = (e: React.MouseEvent) => {
    if (ctx == null) return;
    const radius = 2;
    const width = 5;
    const { left, top } = ctx.canvas.getBoundingClientRect();
    if (x === -1 && y === -1) {
      const currentX = e.clientX - left;
      const currentY = e.clientY - top;
      setFirstClickPosition([currentX, currentY]);
      ctx.beginPath();
      ctx.arc(currentX, currentY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = width;
      ctx.stroke();
    } else {
      const currentX = e.clientX - left;
      const currentY = e.clientY - top;
      // ctx.lineJoin = 'round';
      ctx.beginPath();
      clearCircle(ctx, x, y, radius, width);
      ctx.moveTo(x, y);
      // ctx.lineTo(currentX, currentY);
      // ctx.lineTo(currentX, currentY + 40);
      ctx.bezierCurveTo(x, y + 100, currentX, currentY + 100, currentX, currentY);
      ctx.stroke();
      // end
      setFirstClickPosition([-1, -1]);
    }
  };

  return (
    <ActionListenerContainer onClick={handleClick}></ActionListenerContainer>
  );
};

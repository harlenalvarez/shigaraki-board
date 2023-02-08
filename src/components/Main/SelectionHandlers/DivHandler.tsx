
import { useCanvasCtx } from '@/store';
import { getCanvasPoint } from '@/utils';
import React from 'react';
import { ActionListenerContainer } from '../Main.styled';

export const DivHandler = () => {
  const ctx = useCanvasCtx();

  const handleSave = (e: React.MouseEvent) => {
    if (ctx == null) return;
    e.preventDefault();
    e.stopPropagation();
    ctx.resetTransform();
    ctx.beginPath();
    const [currentX, currentY] = getCanvasPoint(e, ctx);
    const pattern = ctx.createLinearGradient(currentX, currentY, currentX + 240, currentY + 10);
    const selectedColor = 'blue';
    pattern.addColorStop(0, 'blue');
    for (let x = 0.02; x <= 1; x += 0.02) {
      pattern.addColorStop(x, 'black');
      pattern.addColorStop(x + 0.01, selectedColor);
    }
    ctx.fillStyle = pattern;
    ctx.roundRect(currentX, currentY, 200, 150, 4);
    ctx.fill();
  };

  return (
    <ActionListenerContainer onClick={handleSave}></ActionListenerContainer>
  );
};

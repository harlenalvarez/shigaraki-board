
import { useCanvasCtx } from '@/store';
import { getClickedPoint } from '@/utils';
import React from 'react';
import { ActionListenerContainer } from '../Main.styled';

export const DivHandler = () => {
  const ctx = useCanvasCtx();

  const handleSave = (e: React.MouseEvent) => {
    if (ctx == null) return;
    e.preventDefault();
    e.stopPropagation();
    ctx.resetTransform();
    const [currentX, currentY] = getClickedPoint(e, ctx.canvas);
    ctx.roundRect(currentX, currentY, 200, 150, 4);
    ctx.stroke();
  };

  return (
    <ActionListenerContainer onClick={handleSave}></ActionListenerContainer>
  );
};

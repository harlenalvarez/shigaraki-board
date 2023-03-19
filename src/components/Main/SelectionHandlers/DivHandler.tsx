
import { renderedObjectsIntance, useCanvasCtx } from '@/store';
import { Div2D } from '@/types';
import { getCanvasPoint } from '@practicaljs/canvas-kit';
import React from 'react';
import { ActionListenerContainer } from '../Main.styled';

export const DivHandler = () => {
  const ctx = useCanvasCtx();

  const handleSave = (e: React.MouseEvent) => {
    if (ctx == null) return;
    e.preventDefault();
    e.stopPropagation();
    const [currentX, currentY] = getCanvasPoint(e, ctx);
    const div = new Div2D({ point: { x: currentX, y: currentY }, width: 200, height: 150, strokeColor: '#222222' });
    renderedObjectsIntance.push(div);
  };

  return (
    <ActionListenerContainer onClick={handleSave}></ActionListenerContainer>
  );
};

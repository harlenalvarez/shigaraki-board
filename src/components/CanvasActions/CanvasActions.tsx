import Divider from '@mui/material/Divider';
import { useLayoutEffect, useRef, useState } from 'react';
import { Stack } from './CanvasActions.styled';

export const CanvasActions = () => {
  const stackRef = useRef<HTMLDivElement>(null);
  const [currentHeight, setCurrentHeight] = useState('');

  useLayoutEffect(() => {
    if(!stackRef.current) return;
    const { height } = stackRef.current.getBoundingClientRect();
    setCurrentHeight(`${height}px`);
  }, []);

  return (
      <Stack ref={stackRef} currentHeight={currentHeight} direction='column' divider={<Divider orientation="vertical" flexItem  />}>
        <div style={{height: '80vh'}}>Button</div>
      </Stack>
  );
};

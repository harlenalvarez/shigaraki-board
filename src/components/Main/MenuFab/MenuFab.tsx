import Divider from '@mui/material/Divider';
import { useLayoutEffect, useRef, useState } from 'react';
import { Stack } from './MenuFab.styled';

export const MenuFab = () => {
  const stackRef = useRef<HTMLDivElement>(null);
  const [currentHeight, setCurrentHeight] = useState('');

  useLayoutEffect(() => {
    if (stackRef.current == null) return;
    const { height } = stackRef.current.getBoundingClientRect();
    setCurrentHeight(`${height}px`);
  }, []);

  return (
      <Stack ref={stackRef} currentheight={currentHeight} direction='column' divider={<Divider orientation="vertical" flexItem />}>
        <div style={{ height: '80vh' }}>Button</div>
      </Stack>
  );
};

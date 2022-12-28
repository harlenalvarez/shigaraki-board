import React from 'react';
import { createPortal } from 'react-dom';

export const PopoverSection = (props: { children: React.ReactNode }) => {
  const div = document.getElementById('popover');

  return (
    <>
      { div !== null && createPortal(props.children, div)}
    </>
  );
};

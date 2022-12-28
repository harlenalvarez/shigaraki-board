import React from 'react';
import { createPortal } from 'react-dom';

export const MainSection = (props: { children: React.ReactNode }) => {
  const div = document.getElementById('main');

  return (
    <>
      { div !== null && createPortal(props.children, div)}
    </>
  );
};

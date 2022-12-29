import React from 'react';
import ReactDOM from 'react-dom/client';
import { Container } from '@/components';

import './index.css';
import { CanvasCtxProvider } from '@/store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CanvasCtxProvider>
      <Container />
    </CanvasCtxProvider>
  </React.StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@animix-js/animix/css';
import './docs.css';
import { App } from './App';

const el = document.getElementById('root');

if (!el) {
  throw new Error('Missing #root');
}

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

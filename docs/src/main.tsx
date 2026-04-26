import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@pras75299/animix/css';
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

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
import './styles/app.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Trigger body fade-in after React hydration
document.body.classList.add('hydrated');

// Listen for system preference changes and update .dark class + color-scheme
const darkMql = window.matchMedia('(prefers-color-scheme: dark)');
function applySystemTheme(e: MediaQueryListEvent | MediaQueryList) {
  const root = document.documentElement;
  root.classList.toggle('dark', e.matches);
  root.style.colorScheme = e.matches ? 'dark' : 'light';
}
darkMql.addEventListener('change', applySystemTheme);

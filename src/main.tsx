import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import './index.css';

// The reduced-motion block in index.css only reaches CSS animations; Motion
// drives its own in JS. One config here covers every motion element in the app.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
    <Analytics />
    <SpeedInsights />
  </StrictMode>,
);



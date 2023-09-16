import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRoutes } from './BrowserRoutes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRoutes />
  </React.StrictMode>
);


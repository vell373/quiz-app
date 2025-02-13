// src/index.js (React 18 対応)
import React from 'react';
import ReactDOM from 'react-dom/client'; // react-dom/client からインポート
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

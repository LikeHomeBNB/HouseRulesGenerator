import React from 'react';
import ReactDOM from 'react-dom/client';
import Example from './Example';
import './index.css';

function App() {
  return <Example />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
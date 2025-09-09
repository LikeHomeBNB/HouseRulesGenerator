import React from 'react';
import ReactDOM from 'react-dom/client';
import HausregelnGenerator from './homerules';
import './index.css';

function App() {
  return <HausregelnGenerator />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client'; // actualizado
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';


const root = document.getElementById('root');
const appRoot = ReactDOM.createRoot(root);

appRoot.render(
  <React.StrictMode>
    
      <App />
 
  </React.StrictMode>
);

// Si deseas que tu aplicación funcione sin conexión y se cargue más rápido, 
// puedes cambiar unregister() a register() a continuación. 
// Ten en cuenta que esto viene con algunas trampas.
// Obtén más información sobre los trabajadores de servicios: https://bit.ly/CRA-PWA
serviceWorker.unregister();

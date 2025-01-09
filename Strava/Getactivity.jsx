import React from 'react';
import ReactDOM from 'react-dom';
import StravaActivities from './StravaActivities';

console.log("Iniciando aplicación"); // Esto imprimirá en la consola cuando el archivo se cargue

ReactDOM.render(
  <React.StrictMode>
    <StravaActivities />
  </React.StrictMode>,
  document.getElementById('root')
);
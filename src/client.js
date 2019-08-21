import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {environment} from './Environment';

ReactDOM.hydrate(
  <BrowserRouter basename={window.__basename__ || '/'}>
    <App environment={environment} />
  </BrowserRouter>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}

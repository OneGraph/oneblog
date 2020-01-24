import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {environment} from './Environment';

ReactDOM.hydrate(
  <App environment={environment} basepath={window.__basename__ || '/'} />,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}

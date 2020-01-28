import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {recordSource, createEnvironment} from './Environment';
import PreloadCache from './preloadQueryCache';
import PreloadCacheContext from './PreloadCacheContext';

const cache = new PreloadCache({size: 250, ttl: 1000 * 60 * 10});
const environment = createEnvironment(recordSource, null, cache);

ReactDOM.createBlockingRoot(document.getElementById('root'), {
  hydrate: true,
}).render(
  <PreloadCacheContext.Provider value={cache}>
    <App environment={environment} basepath={window.__basename__ || '/'} />
  </PreloadCacheContext.Provider>,
);

if (module.hot) {
  module.hot.accept();
}

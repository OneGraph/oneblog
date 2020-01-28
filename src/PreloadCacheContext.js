// @flow

import React from 'react';
import PreloadCache from './preloadQueryCache';

const PreloadCacheContext = React.createContext<PreloadCache>(
  new PreloadCache({
    size: 250,
    ttl: 1000 * 60 * 10,
  }),
);

export default PreloadCacheContext;

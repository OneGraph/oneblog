// @flow

import React from 'react';
import config from './config';
import type {Config} from './config';

const ConfigContext = React.createContext<{
  config: Config,
  updateConfig: ($Shape<Config>) => void,
}>({
  config,
  updateConfig: (config) => {
    console.warn('updateConfig not implemented');
  },
});

export default ConfigContext;

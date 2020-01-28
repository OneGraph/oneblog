// @flow

import React from 'react';
import {Link} from '@reach/router';
import {pick} from '@reach/router/lib/utils';
import {routes} from './App';
import {fetchQuery} from 'react-relay';
import {useRelayEnvironment} from 'react-relay/hooks';
import PreloadCacheContext from './PreloadCacheContext';

async function runQueryForLink(cache, environment, to) {
  const match = pick(routes, to);
  if (match) {
    match.route.preload(cache, environment, match.params);
  }
}

export default function PreloadLink(props: any) {
  const cache = React.useContext(PreloadCacheContext);
  const environment = useRelayEnvironment();
  const preload = () => {
    runQueryForLink(cache, environment, props.to);
  };
  return <Link onClick={preload} onMouseOver={preload} {...props} />;
}

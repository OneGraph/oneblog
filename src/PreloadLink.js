// @flow

import React from 'react';
import {Link} from '@reach/router';
import {pick} from '@reach/router/lib/utils';
import {routes} from './App';
import {fetchQuery} from 'react-relay';
import {environment} from './Environment';

async function runQueryForLink(to) {
  const match = pick(routes, to);
  if (match) {
    await fetchQuery(
      environment,
      match.route.query,
      match.route.getVariables(match.params),
    );
  }
}

export default function PreloadLink(props: any) {
  const preload = () => {
    runQueryForLink(props.to);
  };
  return <Link onClick={preload} onMouseOver={preload} {...props} />;
}

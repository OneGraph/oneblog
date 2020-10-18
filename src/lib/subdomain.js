// @flow

import type {IncomingMessage} from 'http';

export function subdomainFromReq(req: IncomingMessage) {
  const host = req.headers.host;
  if (!host) {
    return null;
  }

  const isDev = !(host.endsWith('.com') || host.endsWith('.dev'));

  const splitHost = host.split('.');
  if ((isDev && splitHost.length === 2) || (!isDev && splitHost.length === 3)) {
    return splitHost[0];
  } else {
    return null;
  }
}

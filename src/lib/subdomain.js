// @flow

import type {IncomingMessage} from 'http';

function subdomainOfHost(host: string): ?string {
  const isDev = !(host.endsWith('.com') || host.endsWith('.dev'));

  const splitHost = host.split('.');
  if ((isDev && splitHost.length === 2) || (!isDev && splitHost.length === 3)) {
    return splitHost[0];
  } else {
    return null;
  }
}

export function subdomainFromReq(req: IncomingMessage): ?string {
  const host = req.headers.host;
  if (!host) {
    return null;
  }
  return subdomainOfHost(host);
}

export function subdomainFromWindow(): ?string {
  if (typeof window !== 'undefined') {
    const host = window.location.host;
    if (host) {
      return subdomainOfHost(host);
    }
  }
}

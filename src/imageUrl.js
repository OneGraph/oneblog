// @flow

import base64Encode from './base64Encode';

export default (src: ?string): ?string => {
  if (src) {
    return `/image-proxy/${base64Encode(src)}`;
  }
  return src;
};

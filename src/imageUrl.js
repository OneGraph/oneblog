// @flow

import base64Encode from './base64Encode';

export default src => {
  if (src) {
    return `/image-proxy/${base64Encode(src)}`;
  }
  return src;
};

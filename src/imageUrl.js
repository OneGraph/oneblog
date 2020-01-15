// @flow

import base64Encode from './base64Encode';

export default ({
  src,
  firstFrame,
}: {
  src: ?string,
  firstFrame?: ?boolean,
}): ?string => {
  if (src) {
    return `/image/${firstFrame ? 'firstFrame/' : ''}${base64Encode(src)}`;
  }
  return src;
};

// @flow

import base64Encode from './base64Encode';

const imageUrl = ({
  src,
  firstFrame,
}: {
  src: ?string,
  firstFrame?: ?boolean,
}): ?string => {
  if (src) {
    return `/api/image/${firstFrame ? 'firstFrame/' : ''}${base64Encode(src)}`;
  }
  return src;
};

export default imageUrl;

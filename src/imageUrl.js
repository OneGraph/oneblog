// @flow

export default src => {
  if (src) {
    return `/image-proxy/${encodeURIComponent(src)}`;
  }
  return src;
};

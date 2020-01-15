// @flow

// Encodes to base64, with URL-safe alphabet
export default (s: string): string => {
  const base64 =
    typeof window !== 'undefined'
      ? btoa(s)
      : Buffer.from(s, 'utf-8').toString('base64');
  // Make URL-safe
  return base64
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

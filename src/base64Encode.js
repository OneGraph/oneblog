// @flow

// Encodes to base64, with URL-safe alphabet
const base64Encode = (s: string): string => {
  const base64 =
    typeof window !== 'undefined'
      ? btoa(s)
      : Buffer.from(s, 'utf-8').toString('base64');
  // Make URL-safe
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

export default base64Encode;

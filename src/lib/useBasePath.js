// @flow

import {useRouter} from 'next/router';

export default function useBasePath(): string {
  try {
    const router = useRouter();
    if (router) {
      return router.basePath || '';
    } else {
      return process.env.BASE_PATH || '';
    }
  } catch (_e) {
    return process.env.BASE_PATH || '';
  }
}

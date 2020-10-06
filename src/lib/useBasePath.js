import {useRouter} from 'next/router';

export default function useBasePath() {
  try {
    const router = useRouter();
    if (router) {
      return router.basePath;
    }
  } catch (_e) {
    return process.env.BASE_PATH || '';
  }
}

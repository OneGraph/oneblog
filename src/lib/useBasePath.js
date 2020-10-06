import {useRouter} from 'next/router';

export default function useBasePath() {
  const router = useRouter();
  if (router) {
    return router.basePath;
  } else {
    return process.env.BASE_PATH || '';
  }
}

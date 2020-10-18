import {ogImage} from '../../../ogImage';

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async (req, res) => {
  res.set = res.setHeader;
  req.params = req.query;
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
  return ogImage(req, res);
};

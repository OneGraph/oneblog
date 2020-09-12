import {ogImage} from '../../../ogImage';

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async (req, res) => {
  res.set = res.setHeader;
  req.params = req.query;
  return ogImage(req, res);
};

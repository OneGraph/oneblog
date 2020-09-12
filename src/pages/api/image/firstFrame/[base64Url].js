import {firstFrame} from '../../../../imageProxy';

export const config = {
  api: {
    externalResolver: true,
  },
};

export default (req, res) => {
  res.set = res.setHeader;
  req.params = req.query;
  return firstFrame(req, res);
};

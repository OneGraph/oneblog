// @flow

import Config from '../../config';

export default (req: any, res: any) => {
  res.setHeader('access-control-allow-origin', '*');
  res.json({
    version: '1.0.0',
    repoName: Config.repoName,
    repoOwner: Config.repoOwner,
    codeTheme: Config.codeTheme,
    title: Config.title,
    description: Config.description,
  });
};

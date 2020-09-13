import React from 'react';
import {Box, Text} from 'grommet';
import config from './config';

export default function Attribution() {
  if (config.hideAttribution) {
    return null;
  }
  return (
    <Box align="center">
      <Text>
        Powered by{' '}
        <a href="https://github.com/OneGraph/oneblog" target="_blank">
          OneBlog
        </a>{' '}
        with{' '}
        <a href="https://www.onegraph.com" target="_blank">
          OneGraph's GraphQL API
        </a>
      </Text>
    </Box>
  );
}

import React from 'react';
import {Box, Text, Grommet} from 'grommet';
import ConfigContext from './ConfigContext';

export default function Attribution() {
  const {config: hideAttribution} = React.useContext(ConfigContext);
  if (hideAttribution) {
    return null;
  }
  return (
    <Box pad={{bottom: 'small'}} align="center">
      <Text size="xsmall">
        Powered by{' '}
        <a href="https://www.onegraph.com/oneblog" target="_blank">
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

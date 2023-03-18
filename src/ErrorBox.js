// @flow

import React from 'react';
import {Box, Text} from 'grommet';
import {StatusCritical} from 'grommet-icons/icons/StatusCritical';
import ConfigContext from './ConfigContext';

const ErrorBox = ({error}: {error: any}) => {
  const {config} = React.useContext(ConfigContext);
  console.error('error', error);
  const relayError = error?.source?.errors?.[0]?.message;
  return (
    <Box
      margin={{vertical: 'large'}}
      gap="xsmall"
      justify="center"
      align="center"
      direction="row">
      <StatusCritical color="status-error" />{' '}
      <Text size="medium">{relayError || error.message}</Text>
    </Box>
  );
};

export default ErrorBox;

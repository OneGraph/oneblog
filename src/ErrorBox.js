// @flow

import React from 'react';
import {Box, Text} from 'grommet';
import {StatusCritical} from 'grommet-icons/icons/StatusCritical';
import config from './config';

const ErrorBox = ({error}: {error: any}) => {
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
      <Text size="medium">
        {relayError || error.message}
        {error.type === 'missing-cors' ? (
          <div>
            {' '}
            Allow the current URL in the CORS Origins form on the{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={`https://www.onegraph.com/dashboard/app/${config.appId}`}>
              OneGraph Dashboard
            </a>
            .
          </div>
        ) : null}
      </Text>
    </Box>
  );
};

export default ErrorBox;

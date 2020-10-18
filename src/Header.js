// @flow

/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {Box, Heading} from 'grommet';
import Avatar from './Avatar';
import Link from 'next/link';
import ConfigContext from './ConfigContext';
import {PostBox} from './Post';
import {useRouter} from 'next/router';

import type {AdminLink} from './Avatar';

import type {Avatar_gitHub$key} from './__generated__/Avatar_gitHub.graphql';

type Props = {|
  title: string,
  gitHub: Avatar_gitHub$key,
  adminLinks: Array<AdminLink>,
|};

function Header({gitHub, adminLinks}: Props) {
  const {config} = React.useContext(ConfigContext);
  const {pathname} = useRouter();

  return (
    <>
      <Box margin="medium" style={{position: 'absolute', top: 0, right: 0}}>
        <Avatar gitHub={gitHub} adminLinks={adminLinks} />
      </Box>
      <Box
        pad={{horizontal: 'medium'}}
        style={{
          maxWidth: 704,
          width: '100%',
        }}>
        <Box
          style={{maxWidth: 704, width: '100%'}}
          pad={{top: 'medium', horizontal: 'medium'}}
          border={{
            size: 'xsmall',
            side: 'bottom',
            color: 'rgba(0,0,0,0.1)',
          }}>
          <Heading style={{marginTop: 0}} level={1}>
            <Link href="/">
              <a
                style={
                  pathname === '/'
                    ? {
                        textDecoration: 'none',
                        color: 'inherit',
                        cursor: 'auto',
                      }
                    : {color: 'inherit'}
                }>
                {config.title || 'OneBlog'}
              </a>
            </Link>
          </Heading>
        </Box>
      </Box>
    </>
  );
}

export default Header;

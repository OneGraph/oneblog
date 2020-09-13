/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {Box, Heading} from 'grommet';
import Avatar from './Avatar';
import Link from 'next/link';
import config from './config';
import {PostBox} from './Post';
import {useRouter} from 'next/router';

function Header({gitHub, adminLinks}) {
  const {pathname} = useRouter();

  return (
    <>
      <Box margin="medium" style={{position: 'absolute', top: 0, right: 0}}>
        <Avatar gitHub={gitHub} adminLinks={adminLinks} />
      </Box>
      <PostBox>
        <Box
          pad={{horizontal: 'medium'}}
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
      </PostBox>
    </>
  );
}

export default Header;

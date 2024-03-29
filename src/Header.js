/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {Box, Heading} from 'grommet';
import Avatar from './Avatar';
import Link from 'next/link';
import ConfigContext from './ConfigContext';
import {PostBox} from './Post';
import {useRouter} from 'next/router';

function Header({adminLinks}) {
  const {config} = React.useContext(ConfigContext);
  const {pathname} = useRouter();

  return (
    <>
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
            <Link legacyBehavior href="/">
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

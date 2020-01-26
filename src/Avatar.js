// @flow
import React from 'react';
import UserContext from './UserContext';
import imageUrl from './imageUrl';
import {Box} from 'grommet/components/Box';
import {Image} from 'grommet/components/Image';
import {Drop} from 'grommet/components/Drop';
import {Button} from 'grommet/components/Button';
import {Text} from 'grommet/components/Text';
import {Logout} from 'grommet-icons/icons/Logout';
import {Add} from 'grommet-icons/icons/Add';
import {MoreVertical} from 'grommet-icons/icons/MoreVertical';
import {Github} from 'grommet-icons/icons/Github';
import GitHubLoginButton from './GitHubLoginButton';
import newIssueUrl from './newIssueUrl';

export default function Avatar() {
  const ref = React.useRef();
  const {viewer, logout, login} = React.useContext(UserContext);
  const [showOptions, setShowOptions] = React.useState(false);

  return (
    <>
      {viewer ? (
        <Box
          align="center"
          justify="center"
          onClick={() => setShowOptions(!showOptions)}
          ref={ref}
          round="xsmall"
          style={{
            height: 32,
            width: 32,
            overflow: 'hidden',
            cursor: 'pointer',
          }}>
          <Image
            style={{height: 32, width: 32}}
            fit="contain"
            src={imageUrl({src: viewer.avatarUrl})}
          />
        </Box>
      ) : (
        <Button
          plain
          onClick={() => login()}
          label={
            <Text size="xsmall" color="dark-5">
              Login
            </Text>
          }
        />
      )}
      {ref.current && showOptions ? (
        <Drop
          style={{margin: 12, paddingTop: 12, paddingBottom: 12}}
          align={{top: 'bottom', right: 'right'}}
          target={ref.current}
          onClickOutside={() => setShowOptions(false)}
          onEsc={() => setShowOptions(false)}>
          <Box align="start">
            {viewer ? (
              <>
                {viewer.isAdmin ? (
                  <Button
                    href={newIssueUrl()}
                    target="_blank"
                    rel="noreferrer noopener"
                    fill="horizontal"
                    alignSelf="start"
                    style={{padding: 12, display: 'flex'}}
                    plain
                    hoverIndicator="accent-4"
                    label={<Text size="small">Create new Post</Text>}
                    icon={<Github size="16px" />}
                  />
                ) : null}
                <Button
                  fill="horizontal"
                  alignSelf="start"
                  style={{padding: 12, display: 'flex'}}
                  plain
                  hoverIndicator="accent-4"
                  onClick={() => {
                    logout();
                  }}
                  label={<Text size="small">Sign out</Text>}
                  icon={<Logout size="16px" />}
                />
              </>
            ) : (
              <Button
                fill="horizontal"
                alignSelf="start"
                style={{padding: 8, display: 'flex'}}
                plain
                hoverIndicator="accent-4"
                onClick={() => {
                  login();
                }}
                icon={<Github size="16px" />}
                label={<Text size="small">Log in with GitHub</Text>}
              />
            )}
          </Box>
        </Drop>
      ) : null}
    </>
  );
}

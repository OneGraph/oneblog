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
import {newIssueUrl} from './issueUrls';
import {createFragmentContainer, type RelayProp} from 'react-relay';
import {useFragment} from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';

import type {LoginStatus} from './UserContext';
import type {
  Avatar_gitHub$key,
  Avatar_gitHub$data,
  GitHubRepositoryPermission,
} from './__generated__/Avatar_gitHub.graphql';

const MANAGE_LABEL_ROLES: Array<GitHubRepositoryPermission> = [
  'ADMIN',
  'MAINTAIN',
  'WRITE',
  'TRIAGE',
];

function checkIsAdmin(
  loginStatus: LoginStatus,
  repository: ?{|
    +viewerPermission: ?GitHubRepositoryPermission,
    +viewerCanAdminister: boolean,
  |},
) {
  if (loginStatus !== 'logged-in') {
    return false;
  }
  const viewerIsAdmin = repository?.viewerCanAdminister;
  const viewerPermission = repository?.viewerPermission;
  return viewerIsAdmin || MANAGE_LABEL_ROLES.includes(viewerPermission);
}

type AdminLink = {href: string, label: string, icon: any};

type Props = {
  gitHub: Avatar_gitHub$key,
  adminLinks: ?Array<AdminLink>,
};

export default function Avatar({gitHub, adminLinks: extraAdminLinks}: Props) {
  const ref = React.useRef();
  const {loginStatus, logout, login} = React.useContext(UserContext);
  const [showOptions, setShowOptions] = React.useState(false);

  const data: Avatar_gitHub$data = useFragment(
    graphql`
      fragment Avatar_gitHub on GitHubQuery
      @argumentDefinitions(
        repoName: {type: "String!"}
        repoOwner: {type: "String!"}
      ) {
        viewer {
          login
          avatarUrl(size: 96)
        }
        repository(name: $repoName, owner: $repoOwner) {
          viewerPermission
          viewerCanAdminister
        }
      }
    `,
    gitHub,
  );

  if (loginStatus === 'checking' || loginStatus === 'error') {
    return null;
  }

  const viewer = data.viewer;

  const adminLinks = [
    {
      href: newIssueUrl(),
      label: 'Create New Post',
      icon: <Github size="16px" />,
    },
  ].concat(extraAdminLinks || []);
  const isAdmin = checkIsAdmin(loginStatus, data.repository);
  return (
    <>
      {loginStatus === 'logged-in' ? (
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
            {loginStatus === 'logged-in' ? (
              <>
                {isAdmin
                  ? adminLinks.map(({href, label, icon}) => (
                      <Button
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        fill="horizontal"
                        alignSelf="start"
                        style={{padding: 12, display: 'flex'}}
                        plain
                        hoverIndicator="accent-4"
                        label={<Text size="small">{label}</Text>}
                        icon={icon}
                      />
                    ))
                  : null}
                <Button
                  fill="horizontal"
                  alignSelf="start"
                  style={{padding: 12, display: 'flex'}}
                  plain
                  hoverIndicator="accent-4"
                  onClick={() => {
                    logout();
                    setShowOptions(false);
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

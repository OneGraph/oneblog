// @flow
import React from 'react';
import UserContext from './UserContext';
import imageUrl from './imageUrl';
import {Box} from 'grommet/components/Box';
import {Image} from 'grommet/components/Image';
import {Drop} from 'grommet/components/Drop';
import {Button} from 'grommet/components/Button';
import {Text} from 'grommet/components/Text';
import {Form, Layer, FormField, TextInput, TextArea, Select} from 'grommet';
import {Logout} from 'grommet-icons/icons/Logout';
import {Add} from 'grommet-icons/icons/Add';
import {MoreVertical} from 'grommet-icons/icons/MoreVertical';
import {Github} from 'grommet-icons/icons/Github';
import {SettingsOption} from 'grommet-icons/icons/SettingsOption';
import GitHubLoginButton from './GitHubLoginButton';
import {newIssueUrl} from './issueUrls';
import {createFragmentContainer, type RelayProp} from 'react-relay';
import {useFragment} from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import ConfigContext from './ConfigContext';
import {defaultThemeColors} from './lib/codeHighlight';
import {commitConfig} from './lib/commitConfig';

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

export type AdminLink = {href: string, label: string, icon: any};

type Props = {
  gitHub: Avatar_gitHub$key,
  adminLinks: ?Array<AdminLink>,
};

export default function Avatar({gitHub, adminLinks: extraAdminLinks}: Props) {
  const {subdomain} = React.useContext(ConfigContext);
  const ref = React.useRef();
  const {loginStatus, logout, login} = React.useContext(UserContext);
  const [showOptions, setShowOptions] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

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
  const isAdmin =
    subdomain && subdomain.toLowerCase() === data.viewer.login.toLowerCase();
  return (
    <>
      {showSettings ? (
        <Settings onClose={() => setShowSettings(false)} />
      ) : null}
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
                {isAdmin ? (
                  <Button
                    fill="horizontal"
                    alignSelf="start"
                    style={{padding: 12, display: 'flex'}}
                    plain
                    hoverIndicator="accent-4"
                    onClick={() => {
                      setShowSettings(true);
                      setShowOptions(false);
                    }}
                    label={<Text size="small">Update settings</Text>}
                    icon={<SettingsOption size="16px" />}
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

function Settings({onClose}) {
  const {config, updateConfig} = React.useContext(ConfigContext);
  const initialConfig = React.useRef(config);
  const handleCancel = React.useCallback(() => {
    updateConfig(initialConfig.current);
    onClose();
  }, []);
  const [formValue, setFormValue] = React.useState({
    title: config.title,
    description: config.description,
    codeTheme: config.codeTheme,
    gaTrackingId: config.gaTrackingId,
  });

  const hasChanges = Object.keys(formValue).find(
    (k) => formValue[k] !== initialConfig.current[k],
  );

  const handleChange = (value) => {
    setFormValue(value);
    setMessage(null);
    updateConfig(value);
  };

  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  const handleSubmit = (newConfig) => {
    setSaving(true);
    function setError() {
      setMessage(
        <Text>
          There was an error updating the settings. Join{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.onegraph.com/chat">
            the OneGraph chat
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/onegraph/oneblog/issues/new">
            open an issue
          </a>{' '}
          for help.
        </Text>,
      );
    }
    commitConfig(newConfig)
      .then((res) => {
        setSaving(false);
        if (res && res.url) {
          setMessage(
            <Text>
              Success! Your settings were committed and the change will be live
              as soon as{' '}
              <a href={res.url} target="_blank" rel="noopener noreferrer">
                the commit
              </a>{' '}
              status is green (usually takes about a minute).
            </Text>,
          );
          updateConfig(newConfig);
        } else {
          setError();
        }
      })
      .catch((e) => {
        console.error('Error saving config', e);
        setSaving(false);
        setError();
      });
  };

  return (
    <Layer
      animation="fadeIn"
      onEsc={handleCancel}
      onClickOutside={handleCancel}>
      <Box width="medium" margin="medium" padding="medium">
        <Form
          value={formValue}
          onChange={handleChange}
          onSubmit={({value}) => handleSubmit(value)}>
          <FormField disabled={saving} pad={false} name="title" label="Title">
            <TextInput name="title" />
          </FormField>
          <FormField
            disabled={saving}
            pad={false}
            name="description"
            label="Description">
            <TextArea name="description" />
          </FormField>
          <FormField
            disabled={saving}
            pad={false}
            name="codeTheme"
            label="Code Theme">
            <Select
              name="codeTheme"
              options={Object.keys(defaultThemeColors)}
            />
          </FormField>
          <FormField
            disabled={saving}
            pad={false}
            name="gaTrackingId"
            label="Google Analytics ID (e.g. UA-28732921-1)">
            <TextInput name="gaTrackingId" />
          </FormField>

          <Box direction="row" gap="small">
            <Button
              type="submit"
              disabled={!hasChanges || saving}
              style={{cursor: undefined}}
              label={<Text>Save</Text>}
            />
            <Button plain onClick={handleCancel} label={<Text>Cancel</Text>} />
          </Box>
        </Form>
        <Box margin={{top: 'small'}}>{message}</Box>
      </Box>
    </Layer>
  );
}

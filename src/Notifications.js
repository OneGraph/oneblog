// @flow

import * as React from 'react';
import {Box} from 'grommet/components/Box';
import {Text} from 'grommet/components/Text';
import {Header} from 'grommet/components/Header';
import {Button} from 'grommet/components/Button';
import {Layer} from 'grommet/components/Layer';
import {Anchor} from 'grommet/components/Anchor';
import {StatusGood} from 'grommet-icons/icons/StatusGood';
import {FormClose} from 'grommet-icons/icons/FormClose';
import config from './config';

export type NotificationContextType = {
  error: (string) => void,
  success: (string) => void,
  setCorsViolation: () => void,
  clearCorsViolation: () => void,
};

export const NotificationContext = React.createContext<NotificationContextType>(
  {
    error: (msg: string) => undefined,
    success: (msg: string) => undefined,
    setCorsViolation: () => undefined,
    clearCorsViolation: () => undefined,
  },
);

type Notification = {|
  level: 'error' | 'success',
  message: string,
|};

type Props = {children: React.Node};
type State = {
  notifications: {[key: string]: Notification},
  corsViolation: boolean,
};

let _id = 1;
function genId() {
  return (_id++).toString(36);
}

function CorsViolation({corsViolation}) {
  return corsViolation ? (
    <Header justify="center" background="status-error">
      <Box pad="small" align="center" width="large">
        <Text style={{textAlign: 'center'}}>
          Missing CORS origin.
          <br />
          Allow the current URL on the CORS Origins form on the{' '}
          <Anchor
            color="white"
            target="_blank"
            rel="noreferrer noopener"
            href={`https://www.onegraph.com/dashboard/app/${config.appId}`}>
            OneGraph Dashboard
          </Anchor>
          .
        </Text>
      </Box>
    </Header>
  ) : (
    // Empty header to prevent re-render
    <Header />
  );
}

export class NotificationContainer extends React.PureComponent<Props, State> {
  state = {
    notifications: {},
    corsViolation: false,
  };

  _removeNotification = (id: string) => {
    this.setState(({notifications}) => {
      const {[id]: _x, ...rest} = notifications;
      return {notifications: rest};
    });
  };

  _addNotification = (notification: Notification) => {
    const id = genId();
    this.setState(
      ({notifications}) => ({
        notifications: {...notifications, [id]: notification},
      }),
      () => setTimeout(() => this._removeNotification(id), 5000),
    );
  };
  _error = (message: string) => {
    this._addNotification({message, level: 'error'});
  };
  _success = (message: string) => {
    this._addNotification({message, level: 'success'});
  };
  _setCorsViolation = () => {
    this.setState({corsViolation: true});
  };
  _clearCorsViolation = () => {
    this.setState({corsViolation: false});
  };

  _notificationContext = {
    error: this._error,
    success: this._success,
    setCorsViolation: this._setCorsViolation,
    clearCorsViolation: this._clearCorsViolation,
  };
  render() {
    const {notifications} = this.state;
    return (
      <>
        <NotificationContext.Provider value={this._notificationContext}>
          <CorsViolation corsViolation={this.state.corsViolation} />
          {this.props.children}

          <Layer
            position="top-right"
            modal={false}
            responsive={false}
            plain
            margin={{vertical: 'medium', horizontal: 'small'}}>
            {Object.keys(notifications).map((k) => (
              <Box
                key={k}
                style={{alignSelf: 'flex-end'}}
                fill={false}
                margin="xsmall"
                align="center"
                direction="row"
                gap="small"
                justify="between"
                round="medium"
                elevation="medium"
                color="white"
                background={
                  notifications[k].level === 'success'
                    ? 'status-ok'
                    : 'status-error'
                }
                pad={{vertical: 'small', horizontal: 'medium'}}>
                <Box align="center" direction="row" gap="xsmall">
                  {notifications[k].message}
                </Box>
                <Button
                  icon={<FormClose />}
                  onClick={() => this._removeNotification(k)}
                  plain
                />
              </Box>
            ))}
          </Layer>
        </NotificationContext.Provider>
      </>
    );
  }
}

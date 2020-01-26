// @flow

import React from 'react';

export type LoginStatus = 'checking' | 'logged-in' | 'logged-out' | 'error';

export type UserContextType = {
  loginStatus: LoginStatus,
  login: () => void,
  logout: () => void,
};

const UserContext = React.createContext<UserContextType>({
  loginStatus: 'checking',
  login: () => undefined,
  logout: () => undefined,
});

export default UserContext;

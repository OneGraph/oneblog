// @flow

import React from 'react';

export type Viewer = {
  login: string,
  avatarUrl: string,
  isAdmin: boolean,
};

export type UserContextType = {
  isLoggedIn: boolean,
  viewer: ?Viewer,
  login: () => void,
  logout: () => void,
};

const UserContext = React.createContext<UserContextType>({
  isLoggedIn: false,
  viewer: null,
  login: () => undefined,
  logout: () => undefined,
});

export default UserContext;

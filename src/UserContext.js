// @flow

import React from 'react';

const UserContext = React.createContext<*>({
  isLoggedIn: false,
  login: () => undefined,
  logout: () => undefined,
});

export default UserContext;

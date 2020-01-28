import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createMockEnvironment} from 'relay-test-utils';

it('renders without crashing', () => {
  const environment = createMockEnvironment();
  const div = document.createElement('div');
  ReactDOM.render(<App environment={environment} basepath="/" />, div);
  ReactDOM.unmountComponentAtNode(div);
});

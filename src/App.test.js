import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import {createMockEnvironment} from 'relay-test-utils';

it('renders without crashing', () => {
  const environment = createMockEnvironment();
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <App environment={environment} />
    </BrowserRouter>,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});

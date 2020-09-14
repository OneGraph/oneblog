import React from 'react';
import ErrorBox from './ErrorBox';
import {NotificationContext} from './Notifications';

class ErrorBoundary extends React.Component<{children: *}, {error: ?Error}> {
  static contextType = NotificationContext;

  state = {error: null};

  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  render() {
    if (this.state.error != null) {
      if (
        this.state.error.type === 'missing-cors' &&
        this.context?.setCorsViolation
      ) {
        this.context.setCorsViolation();
      }
      return <ErrorBox error={this.state.error} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
